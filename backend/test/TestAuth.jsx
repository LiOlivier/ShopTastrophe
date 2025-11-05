import { useState } from "react";
import { api } from "../api/client";

export default function TestAuth() {
  const [result, setResult] = useState("");

  const createTestUser = async () => {
    setResult("Création utilisateur test...");
    try {
      // Créer un compte de test
      const registerResponse = await api.register({
        email: "test@shoptest.com",
        password: "test123",
        first_name: "Test",
        last_name: "User", 
        address: "123 Test Street"
      });

      if (registerResponse.ok) {
        setResult("✅ Compte créé! Tentative de connexion...");
        
        // Se connecter
        const loginResponse = await api.login({
          email: "test@shoptest.com",
          password: "test123"
        });

        if (loginResponse.ok) {
          const data = await loginResponse.json();
          setResult(`✅ Connexion réussie! Token: ${data.token.slice(0, 10)}...`);
        } else {
          setResult(`❌ Échec connexion: ${await loginResponse.text()}`);
        }
      } else {
        const error = await registerResponse.text();
        if (error.includes("Email déjà utilisé")) {
          setResult("⚠️ Compte existe déjà, tentative de connexion...");
          
          // Se connecter directement
          const loginResponse = await api.login({
            email: "test@shoptest.com",
            password: "test123"
          });

          if (loginResponse.ok) {
            const data = await loginResponse.json();
            setResult(`✅ Connexion réussie! Token: ${data.token.slice(0, 10)}...`);
          } else {
            setResult(`❌ Échec connexion: ${await loginResponse.text()}`);
          }
        } else {
          setResult(`❌ Erreur création: ${error}`);
        }
      }
    } catch (error) {
      setResult(`💥 Erreur: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>🧪 Test API Auth</h3>
      <button onClick={createTestUser}>
        Créer/Tester compte test
      </button>
      <pre style={{ marginTop: "10px", color: "#333" }}>
        {result}
      </pre>
    </div>
  );
}