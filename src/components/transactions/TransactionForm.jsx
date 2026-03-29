import { useState, useEffect } from "react";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "../../constants/categories";

export default function TransactionForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        type: initial.type,
        amount: String(initial.amount),
        category: initial.category,
        description: initial.description,
        date: initial.date,
      });
    }
  }, [initial]);

  const categories = form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (form.category && !categories.includes(form.category)) {
      setForm((f) => ({ ...f, category: "" }));
    }
  }, [form.type, form.category, categories]);

  const validate = () => {
    const errs = {};
    if (!form.amount || Number(form.amount) <= 0) errs.amount = "Enter a valid amount";
    if (!form.category) errs.category = "Select a category";
    if (!form.description.trim()) errs.description = "Enter a description";
    if (!form.date) errs.date = "Select a date";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      type: form.type,
      amount: Number(form.amount),
      category: form.category,
      description: form.description.trim(),
      date: form.date,
    });
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg px-3 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Toggle */}
      <div className="flex rounded-lg bg-white/5 p-1">
        {["income", "expense"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setForm((f) => ({ ...f, type: t }))}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              form.type === t
                ? t === "income"
                  ? "bg-income/20 text-income"
                  : "bg-expense/20 text-expense"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Amount (INR)</label>
        <input
          type="number"
          min="1"
          step="1"
          placeholder="Enter amount"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          className={inputClass}
        />
        {errors.amount && <p className="text-xs text-expense mt-1">{errors.amount}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className={inputClass}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.category && <p className="text-xs text-expense mt-1">{errors.category}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Description</label>
        <input
          type="text"
          placeholder="What was this for?"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className={inputClass}
        />
        {errors.description && <p className="text-xs text-expense mt-1">{errors.description}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          className={inputClass}
        />
        {errors.date && <p className="text-xs text-expense mt-1">{errors.date}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-white hover:bg-accent-light transition-colors text-sm font-medium"
        >
          {initial ? "Update" : "Add"} Transaction
        </button>
      </div>
    </form>
  );
}
