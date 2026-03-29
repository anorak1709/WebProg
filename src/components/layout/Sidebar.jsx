import { NavLink } from "react-router-dom";
import { LayoutDashboard, ArrowLeftRight, Wallet, BarChart3 } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/budget", icon: Wallet, label: "Budget" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
];

export default function Sidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-dark-800/80 backdrop-blur-md border-r border-white/10 min-h-screen p-4">
        <div className="flex items-center gap-2 px-3 py-4 mb-6">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Wallet size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Fin<span className="text-accent-light">Track</span>
          </span>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-accent/10 text-accent-light border-l-2 border-accent shadow-[inset_4px_0_10px_rgba(99,102,241,0.3)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-800/90 backdrop-blur-md border-t border-white/10 flex justify-around py-2 px-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? "text-accent-light" : "text-gray-500 hover:text-gray-300"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
