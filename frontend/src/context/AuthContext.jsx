import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth:user");
      if (raw) setUser(JSON.parse(raw));
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem("auth:user", JSON.stringify(user));
      else localStorage.removeItem("auth:user");
    } catch (_) {}
  }, [user]);

  const login = async ({ email, name }) => {
    setUser({ email, name: name || email.split("@")[0] });
    return true;
  };

  const register = async ({ email, name, password }) => {
    setUser({ email, name: name || email.split("@")[0] });
    return true;
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
