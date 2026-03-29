import { createContext, useState, useMemo, useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getCurrentMonthKey } from "../utils/dateHelpers";
import { calcSpentPerCategory, getBudgetStatus } from "../utils/budgetHelpers";

export const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage("finance_transactions", []);
  const [budgets, setBudgets] = useLocalStorage("finance_budgets", []);
  const [activeMonth, setActiveMonth] = useState(getCurrentMonthKey());

  const addTransaction = useCallback(
    (data) => {
      const txn = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      setTransactions((prev) => [...prev, txn]);
    },
    [setTransactions]
  );

  const updateTransaction = useCallback(
    (id, patch) => {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
      );
    },
    [setTransactions]
  );

  const deleteTransaction = useCallback(
    (id) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    },
    [setTransactions]
  );

  const setBudget = useCallback(
    (category, month, limit) => {
      setBudgets((prev) => {
        const idx = prev.findIndex(
          (b) => b.category === category && b.month === month
        );
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], limit };
          return updated;
        }
        return [...prev, { category, month, limit }];
      });
    },
    [setBudgets]
  );

  const deleteBudget = useCallback(
    (category, month) => {
      setBudgets((prev) =>
        prev.filter((b) => !(b.category === category && b.month === month))
      );
    },
    [setBudgets]
  );

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
