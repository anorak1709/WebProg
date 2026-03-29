import { Pencil, Trash2 } from "lucide-react";
import Badge from "../shared/Badge";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateShort } from "../../utils/dateHelpers";

export default function TransactionRow({ transaction, onEdit, onDelete }) {
  const { id, type, amount, category, description, date } = transaction;

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${type === "income" ? "bg-income" : "bg-expense"}`} />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-white truncate">{description}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-500">{formatDateShort(date)}</span>
            <Badge label={category} />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <span
          className={`text-sm font-semibold whitespace-nowrap ${
            type === "income" ? "text-income" : "text-expense"
          }`}
        >
          {type === "income" ? "+" : "-"}{formatCurrency(amount)}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(transaction)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
