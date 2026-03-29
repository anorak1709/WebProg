export default function ProgressBar({ value, max, showLabel = true, size = "md" }) {
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const rawPercent = max > 0 ? (value / max) * 100 : 0;

  let barColor = "bg-emerald-500";
  if (rawPercent >= 100) barColor = "bg-red-500";
  else if (rawPercent >= 80) barColor = "bg-yellow-500";

  const height = size === "sm" ? "h-2" : "h-3";

  return (
    <div className="w-full">
      <div className={`w-full ${height} bg-white/10 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${barColor} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-400 mt-1 block">
          {Math.round(rawPercent)}%
        </span>
      )}
    </div>
  );
}
