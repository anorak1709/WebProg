import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { useFinance } from "../../hooks/useFinance";
import { useAuth } from "../../hooks/useAuth";
import { getMonthLabel, navigateMonth } from "../../utils/dateHelpers";

export default function Navbar() {
  const { activeMonth, setActiveMonth } = useFinance();
  const { currentUser } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-dark-800/60 backdrop-blur-md border-b border-white/10 px-6 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white lg:hidden">
          Fin<span className="text-accent-light">Track</span>
        </h1>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setActiveMonth(navigateMonth(activeMonth, -1))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-gray-200 min-w-[140px] text-center">
            {getMonthLabel(activeMonth)}
          </span>
          <button
            onClick={() => setActiveMonth(navigateMonth(activeMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        {currentUser && (
          <div className="flex items-center gap-2 ml-4">
            <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <User size={13} />
              {currentUser.username}
              {currentUser.role === "admin" && (
                <span className="text-warning text-[10px] ml-0.5">admin</span>
              )}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
