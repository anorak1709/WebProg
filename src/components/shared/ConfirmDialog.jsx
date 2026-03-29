import Modal from "./Modal";

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Confirm">
      <p className="text-gray-300 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-colors"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
