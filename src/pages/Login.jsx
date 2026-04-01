import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, User, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    const result = login(username.trim(), password);
    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative animate-fade-in">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
              <Wallet size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Fin<span className="text-accent-light">Track</span>
            </span>
          </div>
          <p className="text-center text-gray-400 text-sm mb-8">
            Sign in to manage your finances
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                Username
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-dark-700 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-gray-500 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-dark-700 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-white text-sm placeholder-gray-500 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-expense text-sm text-center bg-expense/10 border border-expense/20 rounded-lg py-2 px-3 animate-fade-in">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent-light text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-accent/40"
            >
              Sign In
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 pt-5 border-t border-white/5">
            <p className="text-xs text-gray-500 text-center mb-2">Demo Accounts</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setUsername("admin"); setPassword("admin123"); setError(""); }}
                className="flex-1 text-xs text-gray-400 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg py-2 px-3 text-center transition-colors"
              >
                <span className="text-accent-light font-medium">Admin</span>
                <br />admin / admin123
              </button>
              <button
                type="button"
                onClick={() => { setUsername("user"); setPassword("user123"); setError(""); }}
                className="flex-1 text-xs text-gray-400 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg py-2 px-3 text-center transition-colors"
              >
                <span className="text-accent-light font-medium">User</span>
                <br />user / user123
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
