import { createContext, useState, useMemo, useCallback, useEffect } from "react";
import { getCurrentMonthKey } from "../utils/dateHelpers";
import { calcSpentPerCategory, getBudgetStatus } from "../utils/budgetHelpers";
import { api } from "../api";
import { useAuth } from "../hooks/useAuth";

export const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [activeMonth, setActiveMonth] = useState(getCurrentMonthKey());
  const [loading, setLoading] = useState(false);

  // Fetch data when authenticated or month changes
  useEffect(() => {
    if (!isAuthenticated) {
      setTransactions([]);
      setBudgets([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all([
      api(`/api/transactions?month=${activeMonth}`),
      api(`/api/budgets?month=${activeMonth}`),
    ])
      .then(([txnData, budgetData]) => {
        if (!cancelled) {
          setTransactions(txnData.transactions);
          setBudgets(budgetData.budgets);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTransactions([]);
          setBudgets([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [isAuthenticated, activeMonth]);

  const addTransaction = useCallback(async (data) => {
    const res = await api("/api/transactions", {
      method: "POST",
      body: data,
    });
    // Only add to local state if it belongs to the active month
    if (res.transaction.date.startsWith(activeMonth)) {
      setTransactions((prev) => [res.transaction, ...prev]);
    }
  }, [activeMonth]);

  const updateTransaction = useCallback(async (id, patch) => {
    const res = await api(`/api/transactions/${id}`, {
      method: "PUT",
      body: patch,
    });
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? res.transaction : t))
    );
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    await api(`/api/transactions/${id}`, { method: "DELETE" });
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setBudget = useCallback(async (category, month, limit) => {
    const res = await api("/api/budgets", {
      method: "PUT",
      body: { category, month, limit },
    });
    setBudgets((prev) => {
      const idx = prev.findIndex(
        (b) => b.category === category && b.month === month
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = res.budget;
        return updated;
      }
      return [...prev, res.budget];
    });
  }, []);

  const deleteBudget = useCallback(async (category, month) => {
    await api("/api/budgets", {
      method: "DELETE",
      body: { category, month },
    });
    setBudgets((prev) =>
      prev.filter((b) => !(b.category === category && b.month === month))
    );
  }, []);

  const getMonthlyTransactions = useCallback(
    (month) => transactions.filter((t) => t.date.startsWith(month)),
    [transactions]
  );

  const getSpentByCategory = useCallback(
    (month) => calcSpentPerCategory(transactions, month),
    [transactions]
  );

  const getMonthlyTotals = useCallback(
    (month) => {
      const monthTxns = transactions.filter((t) => t.date.startsWith(month));
      const income = monthTxns
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTxns
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      return { income, expense, balance: income - expense };
    },
    [transactions]
  );

  const getMonthBudgets = useCallback(
    (month) => budgets.filter((b) => b.month === month),
    [budgets]
  );

  const getBudgetStatusForCategory = useCallback(
    (category, month) => {
      const budget = budgets.find(
        (b) => b.category === category && b.month === month
      );
      if (!budget) return null;
      const spent = calcSpentPerCategory(transactions, month)[category] || 0;
      const { percent, status } = getBudgetStatus(spent, budget.limit);
      return { limit: budget.limit, spent, percent, status };
    },
    [budgets, transactions]
  );

  const value = useMemo(
    () => ({
      transactions,
      budgets,
      activeMonth,
      loading,
      setActiveMonth,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      setBudget,
      deleteBudget,
      getMonthlyTransactions,
      getSpentByCategory,
      getMonthlyTotals,
      getMonthBudgets,
      getBudgetStatusForCategory,
    }),
    [
      transactions,
      budgets,
      activeMonth,
      loading,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      setBudget,
      deleteBudget,
      getMonthlyTransactions,
      getSpentByCategory,
      getMonthlyTotals,
      getMonthBudgets,
      getBudgetStatusForCategory,
    ]
  );

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}
