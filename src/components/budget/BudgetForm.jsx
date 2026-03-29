import { useState, useEffect } from "react";
import { EXPENSE_CATEGORIES } from "../../constants/categories";

export default function BudgetForm({ existingBudgets, onSave }) {
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  const existingCats = existingBudgets.map((b) => b.category);

  useEffect(() => {
    const existing = existingBudgets.find((b) => b.category === category);
    if (existing) {
      setLimit(String(existing.limit));
    } else {
      setLimit("");
    }
  }, [category, existingBudgets]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !limit || Number(limit) <= 0) return;
    onSave(category, Number(limit));
    setCategory("");
    setLimit("");
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg px-3 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={`${inputClass} sm:w-48`}
      >
        <option value="">Select category</option>
        {EXPENSE_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c} {existingCats.includes(c) ? "(edit)" : ""}
          </option>
        ))}
      </select>
      <input
        type="number"
        min="1"
        step="1"
        placeholder="Budget limit (₹)"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        className={`${inputClass} sm:w-48`}
      />
      <button
        type="submit"
        className="px-6 py-2.5 rounded-lg bg-accent text-white hover:bg-accent-light transition-colors text-sm font-medium whitespace-nowrap"
      >
        {existingCats.includes(category) ? "Update" : "Set"} Budget
      </button>
    </form>
  );
}
