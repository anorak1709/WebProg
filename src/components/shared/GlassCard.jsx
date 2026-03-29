export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] ${className}`}
    >
      {children}
    </div>
  );
}
