import { Search } from "lucide-react";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, ALL_CATEGORIES } from "../../constants/categories";

export default function TransactionFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  typeFilter,
  onTypeChange,
}) {
  const categories =
    typeFilter === "income"
      ? INCOME_CATEGORIES
      : typeFilter === "expense"
      ? EXPENSE_CATEGORIES
      : ALL_CATEGORIES;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
        />
      </div>

      {/* Type Toggle */}
      <div className="flex rounded-lg bg-white/5 p-1 border border-white/10">
        {["all", "income", "expense"].map((t) => (
          <button
            key={t}
            onClick={() => onTypeChange(t)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
              typeFilter === t
                ? "bg-accent/20 text-accent-light"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Category */}
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
      >
        <option value="all">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}
