import { useMemo } from "react";
import { useFinance } from "../hooks/useFinance";
import PageWrapper from "../components/layout/PageWrapper";
import SummaryCards from "../components/dashboard/SummaryCards";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import BudgetWarnings from "../components/dashboard/BudgetWarnings";
import SpendingPieChart from "../components/charts/SpendingPieChart";
import IncomeExpenseBar from "../components/charts/IncomeExpenseBar";
import GlassCard from "../components/shared/GlassCard";
import { getLastNMonths, getShortMonthLabel } from "../utils/dateHelpers";

export default function Dashboard() {
  const { activeMonth, getMonthlyTotals, getSpentByCategory } = useFinance();

  const { income, expense, balance } = getMonthlyTotals(activeMonth);

  const spentByCategory = getSpentByCategory(activeMonth);
  const pieData = useMemo(
    () =>
      Object.entries(spentByCategory)
        .filter(([, v]) => v > 0)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
    [spentByCategory]
  );

  const barData = useMemo(() => {
    const months = getLastNMonths(6, activeMonth);
    return months.map((m) => {
      const totals = getMonthlyTotals(m);
      return {
        month: getShortMonthLabel(m),
        income: totals.income,
        expense: totals.expense,
      };
    });
  }, [activeMonth, getMonthlyTotals]);

  return (
    <PageWrapper title="Dashboard">
      <div className="space-y-6">
        <SummaryCards income={income} expense={expense} balance={balance} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-sm font-semibold text-white mb-4">Spending by Category</h3>
            <SpendingPieChart data={pieData} />
          </GlassCard>
          <GlassCard>
            <h3 className="text-sm font-semibold text-white mb-4">Income vs Expenses</h3>
            <IncomeExpenseBar data={barData} />
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentTransactions />
          <BudgetWarnings />
        </div>
      </div>
    </PageWrapper>
  );
}
