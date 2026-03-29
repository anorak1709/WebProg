import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useFinance } from "../../hooks/useFinance";
import GlassCard from "../shared/GlassCard";
import Badge from "../shared/Badge";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateShort } from "../../utils/dateHelpers";

export default function RecentTransactions() {
  const { activeMonth, getMonthlyTransactions } = useFinance();
  const navigate = useNavigate();

  const transactions = getMonthlyTransactions(activeMonth)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Recent Transactions</h3>
        <button
          onClick={() => navigate("/transactions")}
          className="flex items-center gap-1 text-xs text-accent-light hover:text-white transition-colors"
        >
          View All <ArrowRight size={14} />
        </button>
      </div>
      {transactions.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center">No transactions this month</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-col min-w-0">
                  <span className="text-sm text-white truncate">{t.description}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">{formatDateShort(t.date)}</span>
                    <Badge label={t.category} />
                  </div>
                </div>
              </div>
              <span
                className={`text-sm font-semibold whitespace-nowrap ml-4 ${
                  t.type === "income" ? "text-income" : "text-expense"
                }`}
              >
                {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
