import { createContext, useMemo, useCallback, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const AuthContext = createContext(null);

const DEFAULT_USERS = [
  {
    id: "admin-001",
    username: "admin",
    password: "admin123",
    role: "admin",
    createdAt: Date.now(),
  },
  {
    id: "user-001",
    username: "user",
    password: "user123",
    role: "user",
    createdAt: Date.now(),
  },
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage("auth_users", []);
  const [currentUser, setCurrentUser] = useLocalStorage("auth_current_user", null);
  const [accessLogs, setAccessLogs] = useLocalStorage("auth_access_logs", []);

  // Seed default accounts on first mount
  useEffect(() => {
    if (users.length === 0) {
      setUsers(DEFAULT_USERS);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addLog = useCallback(
    (userId, username, action, details) => {
      setAccessLogs((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          userId,
          username,
          action,
          details: details || null,
          timestamp: Date.now(),
        },
      ]);
    },
    [setAccessLogs]
  );

  const register = useCallback(
    (username, password) => {
      const trimmed = username.trim();
      if (!trimmed || !password) {
        return { success: false, error: "Username and password are required" };
      }
      if (trimmed.length < 3) {
        return { success: false, error: "Username must be at least 3 characters" };
      }
      if (password.length < 4) {
        return { success: false, error: "Password must be at least 4 characters" };
      }
      const exists = users.find(
        (u) => u.username.toLowerCase() === trimmed.toLowerCase()
      );
      if (exists) {
        return { success: false, error: "Username already taken" };
      }
      const newUser = {
        id: crypto.randomUUID(),
        username: trimmed,
        password,
        role: "user",
        createdAt: Date.now(),
      };
      setUsers((prev) => [...prev, newUser]);
      const sessionUser = { id: newUser.id, username: newUser.username, role: newUser.role };
      setCurrentUser(sessionUser);
      addLog(newUser.id, newUser.username, "register");
      addLog(newUser.id, newUser.username, "login");
      return { success: true };
    },
    [users, setUsers, setCurrentUser, addLog]
  );

  const login = useCallback(
    (username, password) => {
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
      if (!user) {
        return { success: false, error: "Invalid username or password" };
      }
      const sessionUser = { id: user.id, username: user.username, role: user.role };
      setCurrentUser(sessionUser);
      addLog(user.id, user.username, "login");
      return { success: true };
    },
    [users, setCurrentUser, addLog]
  );

  const logout = useCallback(() => {
    if (currentUser) {
      addLog(currentUser.id, currentUser.username, "logout");
    }
    setCurrentUser(null);
  }, [currentUser, setCurrentUser, addLog]);

  const updateUserRole = useCallback(
    (userId, newRole) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      const target = users.find((u) => u.id === userId);
      if (target) {
        addLog(currentUser?.id, currentUser?.username, "role_change", `${target.username}: ${target.role} → ${newRole}`);
      }
      // If updating the current user's role, update session too
      if (currentUser && currentUser.id === userId) {
        setCurrentUser((prev) => ({ ...prev, role: newRole }));
      }
    },
    [users, currentUser, setUsers, setCurrentUser, addLog]
  );

  const deleteUser = useCallback(
    (userId) => {
      const target = users.find((u) => u.id === userId);
      if (target) {
        addLog(currentUser?.id, currentUser?.username, "user_deleted", `Deleted: ${target.username}`);
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    },
    [users, currentUser, setUsers, addLog]
  );

  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.role === "admin";

  const value = useMemo(
    () => ({
      currentUser,
      users,
      accessLogs,
      isAuthenticated,
      isAdmin,
      register,
      login,
      logout,
      updateUserRole,
      deleteUser,
    }),
    [currentUser, users, accessLogs, isAuthenticated, isAdmin, register, login, logout, updateUserRole, deleteUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
