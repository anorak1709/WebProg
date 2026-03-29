import { AlertTriangle, CheckCircle } from "lucide-react";
import { useFinance } from "../../hooks/useFinance";
import GlassCard from "../shared/GlassCard";
import ProgressBar from "../shared/ProgressBar";
import { CATEGORY_COLORS } from "../../constants/categories";
import { calcSpentPerCategory, getBudgetStatus } from "../../utils/budgetHelpers";

export default function BudgetWarnings() {
  const { activeMonth, transactions, getMonthBudgets } = useFinance();
  const monthBudgets = getMonthBudgets(activeMonth);
  const spent = calcSpentPerCategory(transactions, activeMonth);

  const warnings = monthBudgets
    .map((b) => {
      const s = spent[b.category] || 0;
      const { percent, status } = getBudgetStatus(s, b.limit);
      return { ...b, spent: s, percent, status };
    })
    .filter((b) => b.status === "warning" || b.status === "exceeded");

  return (
    <GlassCard>
      <h3 className="text-sm font-semibold text-white mb-4">Budget Alerts</h3>
      {warnings.length === 0 ? (
        <div className="flex items-center gap-2 py-4 text-income">
          <CheckCircle size={18} />
          <span className="text-sm">All budgets on track</span>
        </div>
      ) : (
        <div className="space-y-3">
          {warnings.map((w) => (
            <div key={w.category} className="flex items-center gap-3">
              <AlertTriangle
                size={16}
                className={w.status === "exceeded" ? "text-expense" : "text-warning"}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white" style={{ color: CATEGORY_COLORS[w.category] }}>
                    {w.category}
                  </span>
                  <span className="text-xs text-gray-400">{Math.round(w.percent)}%</span>
                </div>
                <ProgressBar value={w.spent} max={w.limit} showLabel={false} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
