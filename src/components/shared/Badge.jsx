import { CATEGORY_COLORS } from "../../constants/categories";

export default function Badge({ label, color }) {
  const bg = color || CATEGORY_COLORS[label] || "#94a3b8";
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: `${bg}33`, color: bg, borderColor: `${bg}55`, borderWidth: 1 }}
    >
      {label}
    </span>
  );
}
