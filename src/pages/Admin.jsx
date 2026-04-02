import { useState, useEffect } from "react";
import { Users, Shield, ShieldCheck, Activity, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import PageWrapper from "../components/layout/PageWrapper";
import GlassCard from "../components/shared/GlassCard";

export default function Admin() {
  const { currentUser, users, accessLogs, updateUserRole, deleteUser, fetchUsers, fetchLogs } = useAuth();
  const [logsExpanded, setLogsExpanded] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchUsers(), fetchLogs()]).finally(() => setDataLoading(false));
  }, [fetchUsers, fetchLogs]);

  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalLogins = accessLogs.filter((l) => l.action === "login").length;

  const formatDate = (ts) =>
    new Date(ts).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTimestamp = (ts) =>
    new Date(ts).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const actionStyles = {
    register: "bg-accent/10 text-accent-light",
    login: "bg-income/10 text-income",
    logout: "bg-white/10 text-gray-300",
    role_change: "bg-warning/10 text-warning",
    user_deleted: "bg-expense/10 text-expense",
  };

  if (dataLoading) {
    return (
      <PageWrapper title="Admin Panel">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Admin Panel">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard>
            <div className="flex items-center gap-3 p-1">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users size={20} className="text-accent-light" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Users</p>
                <p className="text-xl font-bold text-white">{users.length}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3 p-1">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <ShieldCheck size={20} className="text-warning" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Admins</p>
                <p className="text-xl font-bold text-white">{totalAdmins}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3 p-1">
              <div className="w-10 h-10 rounded-xl bg-income/10 flex items-center justify-center">
                <Activity size={20} className="text-income" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Logins</p>
                <p className="text-xl font-bold text-white">{totalLogins}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* User Management */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-accent-light" />
            <h2 className="text-lg font-semibold text-white">User Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 font-medium py-3 px-3">Username</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-3">Role</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-3 hidden sm:table-cell">Created</th>
                  <th className="text-right text-gray-400 font-medium py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = user.id === currentUser.id;
                  return (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{user.username}</span>
                          {isSelf && (
                            <span className="text-[10px] bg-accent/20 text-accent-light px-1.5 py-0.5 rounded-full">
                              you
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            user.role === "admin"
                              ? "bg-warning/10 text-warning"
                              : "bg-white/10 text-gray-300"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-400 hidden sm:table-cell">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-end gap-2">
                          {!isSelf && (
                            <>
                              <button
                                onClick={() =>
                                  updateUserRole(user.id, user.role === "admin" ? "user" : "admin")
                                }
                                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                  user.role === "admin"
                                    ? "bg-white/10 text-gray-300 hover:bg-white/20"
                                    : "bg-accent/10 text-accent-light hover:bg-accent/20"
                                }`}
                              >
                                {user.role === "admin" ? "Demote" : "Promote"}
                              </button>
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-expense hover:bg-expense/10 transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Access Logs */}
        <GlassCard>
          <button
            onClick={() => setLogsExpanded(!logsExpanded)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-accent-light" />
              <h2 className="text-lg font-semibold text-white">Access Logs</h2>
              <span className="text-xs text-gray-500 ml-1">({accessLogs.length})</span>
            </div>
            {logsExpanded ? (
              <ChevronUp size={18} className="text-gray-400" />
            ) : (
              <ChevronDown size={18} className="text-gray-400" />
            )}
          </button>

          {logsExpanded && (
            <div className="mt-4 overflow-x-auto max-h-[400px] overflow-y-auto">
              {accessLogs.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">No logs yet</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-dark-800">
                    <tr className="border-b border-white/10">
                      <th className="text-left text-gray-400 font-medium py-2 px-3">Time</th>
                      <th className="text-left text-gray-400 font-medium py-2 px-3">User</th>
                      <th className="text-left text-gray-400 font-medium py-2 px-3">Action</th>
                      <th className="text-left text-gray-400 font-medium py-2 px-3 hidden sm:table-cell">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessLogs.map((log) => (
                      <tr key={log.id} className="border-b border-white/5">
                        <td className="py-2 px-3 text-gray-400 whitespace-nowrap">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="py-2 px-3 text-white font-medium">{log.username}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              actionStyles[log.action] || "bg-white/10 text-gray-300"
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-gray-500 text-xs hidden sm:table-cell">
                          {log.details || "\u2014"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
