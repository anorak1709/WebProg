export const calcSpentPerCategory = (transactions, month) => {
  return transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(month))
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
};

export const getBudgetStatus = (spent, limit) => {
  if (limit <= 0) return { percent: 0, status: "ok" };
  const percent = (spent / limit) * 100;
  if (percent >= 100) return { percent, status: "exceeded" };
  if (percent >= 80) return { percent, status: "warning" };
  return { percent, status: "ok" };
};
