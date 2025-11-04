import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

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

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("auth:token") || null;
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

  useEffect(() => {
    try {
      if (token) localStorage.setItem("auth:token", token);
      else localStorage.removeItem("auth:token");
    } catch (_) {}
  }, [token]);

  const login = async ({ email, password }) => {
    try {
      const response = await api.login({ email, password });
      
      if (response.ok) {
        const data = await response.json();
        const userData = { email, name: email.split("@")[0] };
        setUser(userData);
        setToken(data.token);
        return true;
      } else {
        console.error("Erreur login:", await response.text());
        return false;
      }
    } catch (error) {
      console.error("Erreur API login:", error);
      return false;
    }
  };

  const register = async ({ email, password, first_name, last_name, address }) => {
    try {
      console.log("🔐 API register appelée avec:", { email, first_name, last_name, address });
      const response = await api.register({ 
        email, 
        password, 
        first_name: first_name || email.split("@")[0], 
        last_name: last_name || "User",
        address: address || "Adresse par défaut"
      });
      
      console.log("📡 Réponse register:", response.status);
      
      if (response.ok) {
        console.log("✅ Register OK, tentative login auto...");
        // Après register, on fait un login automatique
        return await login({ email, password });
      } else {
        const errorText = await response.text();
        console.error("❌ Erreur register:", response.status, errorText);
        return false;
      }
    } catch (error) {
      console.error("💥 Erreur API register:", error);
      return false;
    }
  };
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateUser = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      saveProfile(next.email, next);
      return next;
    });
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: !!user, login, register, logout, updateUser }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
