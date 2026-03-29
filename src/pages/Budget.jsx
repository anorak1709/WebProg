import { useFinance } from "../hooks/useFinance";
import PageWrapper from "../components/layout/PageWrapper";
import GlassCard from "../components/shared/GlassCard";
import BudgetForm from "../components/budget/BudgetForm";
import BudgetOverview from "../components/budget/BudgetOverview";
import { getMonthLabel } from "../utils/dateHelpers";

export default function Budget() {
  const {
    activeMonth,
    getMonthBudgets,
    getSpentByCategory,
    setBudget,
    deleteBudget,
  } = useFinance();

  const monthBudgets = getMonthBudgets(activeMonth);
  const spentByCategory = getSpentByCategory(activeMonth);

  const handleSave = (category, limit) => {
    setBudget(category, activeMonth, limit);
  };

  const handleDelete = (category) => {
    deleteBudget(category, activeMonth);
  };

  return (
    <PageWrapper title="Budget">
      <div className="space-y-6">
        <GlassCard>
          <h3 className="text-sm font-semibold text-white mb-1">
            Set Budget for {getMonthLabel(activeMonth)}
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Define spending limits per category. Warnings appear at 80%, alerts at 100%.
          </p>
          <BudgetForm existingBudgets={monthBudgets} onSave={handleSave} />
        </GlassCard>

        <div>
          <h3 className="text-sm font-semibold text-white mb-4">
            Budget Overview ({monthBudgets.length} categories)
          </h3>
          <BudgetOverview
            budgets={monthBudgets}
            spentByCategory={spentByCategory}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
