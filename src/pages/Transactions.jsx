import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useFinance } from "../hooks/useFinance";
import PageWrapper from "../components/layout/PageWrapper";
import GlassCard from "../components/shared/GlassCard";
import Modal from "../components/shared/Modal";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionList from "../components/transactions/TransactionList";

export default function Transactions() {
  const {
    activeMonth,
    getMonthlyTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useFinance();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    let txns = getMonthlyTransactions(activeMonth);

    if (typeFilter !== "all") {
      txns = txns.filter((t) => t.type === typeFilter);
    }
    if (categoryFilter !== "all") {
      txns = txns.filter((t) => t.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      txns = txns.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    return txns.sort((a, b) => b.createdAt - a.createdAt);
  }, [activeMonth, getMonthlyTransactions, typeFilter, categoryFilter, search]);

  const openAdd = () => {
    setEditingTxn(null);
    setModalOpen(true);
  };

  const openEdit = (txn) => {
    setEditingTxn(txn);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingTxn) {
        await updateTransaction(editingTxn.id, data);
      } else {
        await addTransaction(data);
      }
      setModalOpen(false);
      setEditingTxn(null);
    } catch (err) {
      console.error("Failed to save transaction:", err.message);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteTransaction(deleteId);
      } catch (err) {
        console.error("Failed to delete transaction:", err.message);
      }
      setDeleteId(null);
    }
  };

  return (
    <PageWrapper title="Transactions">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TransactionFilters
            search={search}
            onSearchChange={setSearch}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
          />
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white hover:bg-accent-light transition-colors text-sm font-medium whitespace-nowrap"
          >
            <Plus size={16} />
            Add Transaction
          </button>
        </div>

        <GlassCard className="p-2">
          <TransactionList
            transactions={filtered}
            onEdit={openEdit}
            onDelete={(id) => setDeleteId(id)}
            onAdd={openAdd}
          />
        </GlassCard>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTxn(null); }}
        title={editingTxn ? "Edit Transaction" : "Add Transaction"}
      >
        <TransactionForm
          initial={editingTxn}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditingTxn(null); }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        message="Are you sure you want to delete this transaction? This cannot be undone."
      />
    </PageWrapper>
  );
}
