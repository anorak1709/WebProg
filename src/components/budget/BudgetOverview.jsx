import BudgetCard from "./BudgetCard";
import EmptyState from "../shared/EmptyState";

export default function BudgetOverview({ budgets, spentByCategory, onDelete }) {
  if (budgets.length === 0) {
    return (
      <EmptyState message="No budgets set for this month. Set one above to start tracking!" />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {budgets.map((b) => (
        <BudgetCard
          key={b.category}
          category={b.category}
          limit={b.limit}
          spent={spentByCategory[b.category] || 0}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
