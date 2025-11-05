import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

// Fournit le contexte d'authentification à l'application
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("auth:user");
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  });
// Initialisation du token d'authentification depuis le localStorage
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("auth:token") || null;
    } catch (_) {
      return null;
    }
  });

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
// Fonction de login
  const login = async ({ email, password }) => {
    try {
      console.log("🔐 Tentative de login avec:", email);
      console.log("🌐 URL API:", `http://127.0.0.1:8000/auth/login`);
      
      const response = await api.login({ email, password });
      console.log("📡 Réponse API login:", response.status, response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Données reçues:", data);
        
        // Créer l'objet utilisateur de base
        let userData = { email, name: email.split("@")[0] };
        
        // Charger le profil sauvegardé s'il existe
        const savedProfile = loadProfile(email);
        if (savedProfile) {
          console.log("📋 Profil sauvegardé trouvé:", savedProfile);
          userData = { ...userData, ...savedProfile };
        }
        
        setUser(userData);
        setToken(data.token);
        console.log("✅ Login réussi, token:", data.token.substring(0, 8) + "...");
        return true;
      } else {
        const errorText = await response.text();
        console.error("❌ Erreur login:", response.status, errorText);
        return false;
      }
    } catch (error) {
      console.error("💥 Erreur API login:", error);
      return false;
    }
  };
// Fonction d'enregistrement
  const register = async ({ email, password, first_name, last_name, address }) => {
    try {
      console.log("🔐 API register appelée avec:", { email, first_name, last_name, address });
      console.log("🌐 URL API:", `http://127.0.0.1:8000/auth/register`);
      
      const response = await api.register({ 
        email, 
        password, 
        first_name: first_name || email.split("@")[0], 
        last_name: last_name || "User",
        address: address || "Adresse par défaut"
      });
      
      console.log("📡 Réponse register:", response.status, response.ok);
      
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
  // Fonction de logout
  const logout = () => {
    console.log("🚪 Logout en cours...");
    
    // Si on avait un token, on notifie le CartContext pour qu'il vide le backend
    if (token) {
      // Le CartContext va détecter le changement et gérer le nettoyage
      setToken(null);
      setUser(null);
    } else {
      setUser(null);
      setToken(null);
    }
  };
// Fonction de mise à jour du profil utilisateur
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
