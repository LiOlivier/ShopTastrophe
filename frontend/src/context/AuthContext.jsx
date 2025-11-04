import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize synchronously from localStorage so a page refresh keeps the session
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("auth:user");
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  });

  // Helper: per-user profile storage so data survives logout (client-side only)
  const profileKey = (email) => `profile:${(email || "").toLowerCase()}`;
  const loadProfile = (email) => {
    try {
      if (!email) return null;
      const raw = localStorage.getItem(profileKey(email));
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  };
  const saveProfile = (email, data) => {
    try {
      if (!email) return;
      localStorage.setItem(profileKey(email), JSON.stringify(data));
    } catch (_) {}
  };

  useEffect(() => {
    try {
      if (user) localStorage.setItem("auth:user", JSON.stringify(user));
      else localStorage.removeItem("auth:user");
    } catch (_) {}
  }, [user]);

  const login = async ({ email, name }) => {
    const base = { email, name: name || email.split("@")[0] };
    const persisted = loadProfile(email) || {};
    setUser({ ...base, ...persisted });
    return true;
  };

  const register = async ({ email, name, password }) => {
    const base = { email, name: name || email.split("@")[0] };
    const persisted = loadProfile(email) || {};
    setUser({ ...base, ...persisted });
    return true;
  };

  const logout = () => setUser(null);

  const updateUser = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      saveProfile(next.email, next);
      return next;
    });
  };

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register, logout, updateUser }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
