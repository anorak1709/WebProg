export const getMonthKey = (dateStr) => dateStr.slice(0, 7);

export const getMonthLabel = (monthKey) => {
  const [y, m] = monthKey.split("-");
  return new Date(y, m - 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

export const getCurrentMonthKey = () => new Date().toISOString().slice(0, 7);

export const getLastNMonths = (n, fromMonth) => {
  const [year, month] = fromMonth.split("-").map(Number);
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(year, month - 1 - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    months.push(`${y}-${m}`);
  }
  return months;
};

export const formatDateShort = (dateStr) => {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

export const getShortMonthLabel = (monthKey) => {
  const [y, m] = monthKey.split("-");
  return new Date(y, m - 1).toLocaleDateString("en-IN", {
    month: "short",
    year: "2-digit",
  });
};

export const navigateMonth = (monthKey, direction) => {
  const [year, month] = monthKey.split("-").map(Number);
  const d = new Date(year, month - 1 + direction, 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};
