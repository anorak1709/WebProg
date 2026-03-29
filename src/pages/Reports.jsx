import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";
import { useFinance } from "../hooks/useFinance";
import PageWrapper from "../components/layout/PageWrapper";
import GlassCard from "../components/shared/GlassCard";
import TrendLineChart from "../components/charts/TrendLineChart";
import CategoryBreakdown from "../components/charts/CategoryBreakdown";
import { formatCurrency } from "../utils/formatCurrency";
import { getLastNMonths, getShortMonthLabel, getMonthLabel } from "../utils/dateHelpers";

export default function Reports() {
  const { activeMonth, getMonthlyTotals, getSpentByCategory } = useFinance();
  const [range, setRange] = useState("6");
  const [copied, setCopied] = useState(false);

  const months = useMemo(
    () => getLastNMonths(Number(range), activeMonth),
    [range, activeMonth]
  );

  const trendData = useMemo(
    () =>
      months.map((m) => {
        const { income, expense } = getMonthlyTotals(m);
        return { month: getShortMonthLabel(m), income, expense };
      }),
    [months, getMonthlyTotals]
  );

  const aggregateTotals = useMemo(() => {
    let income = 0, expense = 0;
    months.forEach((m) => {
      const t = getMonthlyTotals(m);
      income += t.income;
      expense += t.expense;
    });
    return { income, expense, savings: income - expense };
  }, [months, getMonthlyTotals]);

  const categoryData = useMemo(() => {
    const totals = {};
    months.forEach((m) => {
      const spent = getSpentByCategory(m);
      Object.entries(spent).forEach(([cat, amt]) => {
        totals[cat] = (totals[cat] || 0) + amt;
      });
    });
    return Object.entries(totals)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [months, getSpentByCategory]);

  const summaryRows = useMemo(
    () =>
      months.map((m) => {
        const { income, expense, balance } = getMonthlyTotals(m);
        return { month: getMonthLabel(m), income, expense, savings: balance };
      }),
    [months, getMonthlyTotals]
  );

  const handleCopy = () => {
    const header = "Month\tIncome\tExpenses\tSavings";
    const rows = summaryRows.map(
      (r) => `${r.month}\t${r.income}\t${r.expense}\t${r.savings}`
    );
    navigator.clipboard.writeText([header, ...rows].join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageWrapper title="Reports">
      <div className="space-y-6">
        {/* Range Selector */}
        <div className="flex items-center gap-2">
          {["3", "6", "12"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                range === r
                  ? "bg-accent/20 text-accent-light border border-accent/30"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10"
              }`}
            >
              {r}M
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Income</p>
            <p className="text-xl font-bold text-income">{formatCurrency(aggregateTotals.income)}</p>
          </GlassCard>
          <GlassCard>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Expenses</p>
            <p className="text-xl font-bold text-expense">{formatCurrency(aggregateTotals.expense)}</p>
          </GlassCard>
          <GlassCard>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Net Savings</p>
            <p className={`text-xl font-bold ${aggregateTotals.savings >= 0 ? "text-income" : "text-expense"}`}>
              {formatCurrency(aggregateTotals.savings)}
            </p>
          </GlassCard>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-sm font-semibold text-white mb-4">Income & Expense Trend</h3>
            <TrendLineChart data={trendData} />
          </GlassCard>
          <GlassCard>
            <h3 className="text-sm font-semibold text-white mb-4">Category Breakdown</h3>
            <CategoryBreakdown data={categoryData} />
          </GlassCard>
        </div>

        {/* Summary Table */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Monthly Summary</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              {copied ? <Check size={14} className="text-income" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium">Month</th>
                  <th className="text-right py-2 px-3 text-xs text-gray-400 font-medium">Income</th>
                  <th className="text-right py-2 px-3 text-xs text-gray-400 font-medium">Expenses</th>
                  <th className="text-right py-2 px-3 text-xs text-gray-400 font-medium">Savings</th>
                </tr>
              </thead>
              <tbody>
                {summaryRows.map((row) => (
                  <tr key={row.month} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 text-white">{row.month}</td>
                    <td className="py-2.5 px-3 text-right text-income">{formatCurrency(row.income)}</td>
                    <td className="py-2.5 px-3 text-right text-expense">{formatCurrency(row.expense)}</td>
                    <td className={`py-2.5 px-3 text-right font-medium ${row.savings >= 0 ? "text-income" : "text-expense"}`}>
                      {formatCurrency(row.savings)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
