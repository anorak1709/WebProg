import { Inbox } from "lucide-react";

export default function EmptyState({ message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <Inbox size={48} className="mb-4 opacity-40" />
      <p className="text-sm mb-4">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-light transition-colors text-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
