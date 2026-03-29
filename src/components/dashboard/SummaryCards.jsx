import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import GlassCard from "../shared/GlassCard";
import { formatCurrency } from "../../utils/formatCurrency";

const cards = [
  { key: "income", label: "Income", icon: TrendingUp, color: "text-income", borderGlow: "hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]" },
  { key: "expense", label: "Expenses", icon: TrendingDown, color: "text-expense", borderGlow: "hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]" },
  { key: "balance", label: "Balance", icon: Wallet, color: null, borderGlow: null },
];

export default function SummaryCards({ income, expense, balance }) {
  const values = { income, expense, balance };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ key, label, icon: Icon, color, borderGlow }) => {
        const val = values[key];
        const textColor = key === "balance" ? (val >= 0 ? "text-income" : "text-expense") : color;
        const glowClass = key === "balance"
          ? (val >= 0 ? "hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]" : "hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]")
          : borderGlow;

        return (
          <GlassCard key={key} className={glowClass}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {label}
              </span>
              <div className={`p-2 rounded-lg bg-white/5 ${textColor}`}>
                <Icon size={18} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${textColor}`}>
              {formatCurrency(val)}
            </p>
          </GlassCard>
        );
      })}
    </div>
  );
}
