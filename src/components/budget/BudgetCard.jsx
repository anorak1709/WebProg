import { X } from "lucide-react";
import GlassCard from "../shared/GlassCard";
import Badge from "../shared/Badge";
import ProgressBar from "../shared/ProgressBar";
import { formatCurrency } from "../../utils/formatCurrency";
import { getBudgetStatus } from "../../utils/budgetHelpers";

export default function BudgetCard({ category, limit, spent, onDelete }) {
  const { status } = getBudgetStatus(spent, limit);

  const borderClass =
    status === "exceeded"
      ? "border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
      : status === "warning"
      ? "border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.15)]"
      : "";

  return (
    <GlassCard className={`relative ${borderClass}`}>
      <button
        onClick={() => onDelete(category)}
        className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors"
      >
        <X size={14} />
      </button>
      <div className="flex items-center gap-2 mb-3">
        <Badge label={category} />
      </div>
      <ProgressBar value={spent} max={limit} showLabel={false} />
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm text-gray-300">
          {formatCurrency(spent)}{" "}
          <span className="text-gray-500">/ {formatCurrency(limit)}</span>
        </span>
        <span
          className={`text-xs font-medium ${
            status === "exceeded"
              ? "text-expense"
              : status === "warning"
              ? "text-warning"
              : "text-income"
          }`}
        >
          {Math.round((spent / limit) * 100)}%
        </span>
      </div>
    </GlassCard>
  );
}
