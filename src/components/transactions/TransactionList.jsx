import TransactionRow from "./TransactionRow";
import EmptyState from "../shared/EmptyState";

export default function TransactionList({ transactions, onEdit, onDelete, onAdd }) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        message="No transactions found"
        actionLabel="Add Transaction"
        onAction={onAdd}
      />
    );
  }

  return (
    <div className="space-y-1">
      {transactions.map((t) => (
        <TransactionRow
          key={t.id}
          transaction={t}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
