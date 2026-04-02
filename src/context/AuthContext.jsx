import { createContext, useState, useMemo, useCallback, useEffect } from "react";
import { api } from "../api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Restore session from cookie on mount
  useEffect(() => {
    api("/api/auth/me")
      .then((data) => setCurrentUser(data.user))
      .catch(() => setCurrentUser(null))
      .finally(() => setLoading(false));
  }, []);

  const register = useCallback(async (username, password) => {
    try {
      const data = await api("/api/auth/register", {
        method: "POST",
        body: { username, password },
      });
      setCurrentUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: { username, password },
      });
      setCurrentUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch {
      // Clear locally even if request fails
    }
    setCurrentUser(null);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await api("/api/admin/users");
      setUsers(data.users);
    } catch {
      setUsers([]);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const data = await api("/api/admin/logs");
      setAccessLogs(data.logs);
    } catch {
      setAccessLogs([]);
    }
  }, []);

  const updateUserRole = useCallback(
    async (userId, newRole) => {
      try {
        await api(`/api/admin/users/${userId}/role`, {
          method: "PUT",
          body: { role: newRole },
        });
        // Update local state
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        // If updating self, update session
        if (currentUser && currentUser.id === userId) {
          setCurrentUser((prev) => ({ ...prev, role: newRole }));
        }
      } catch (err) {
        console.error("Failed to update role:", err.message);
      }
    },
    [currentUser]
  );

  const deleteUser = useCallback(async (userId) => {
    try {
      await api(`/api/admin/users/${userId}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Failed to delete user:", err.message);
    }
  }, []);

  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.role === "admin";

  const value = useMemo(
    () => ({
      currentUser,
      users,
      accessLogs,
      loading,
      isAuthenticated,
      isAdmin,
      register,
      login,
      logout,
      fetchUsers,
      fetchLogs,
      updateUserRole,
      deleteUser,
    }),
    [currentUser, users, accessLogs, loading, isAuthenticated, isAdmin, register, login, logout, fetchUsers, fetchLogs, updateUserRole, deleteUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
