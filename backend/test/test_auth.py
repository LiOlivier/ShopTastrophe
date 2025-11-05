"""
Script pour créer un utilisateur de test
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def create_test_user():
    print("👤 Création d'un utilisateur de test...")
    
    # Générer un email unique avec timestamp
    import time
    timestamp = int(time.time())
    
    # Données de test avec email valide
    user_data = {
        "email": f"test_{timestamp}@hotmail.org",  # Email avec extension valide
        "password": "motdepasse123",
        "first_name": "Test",
        "last_name": "User",
        "address": "123 Test Street"
    }
    
    try:
        # Tentative de création
        response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
        print(f"📡 Status: {response.status_code}")
        print(f"📄 Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Utilisateur créé avec succès!")
        elif response.status_code == 400 and "Email déjà utilisé" in response.text:
            print("⚠️  L'utilisateur existe déjà")
        else:
            print(f"❌ Erreur: {response.status_code}")
            
        # Test de connexion avec email valide
        print("\n🔑 Test de connexion...")
        login_data = {
            "email": user_data["email"],  # Utilise l'email du user créé
            "password": user_data["password"]
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"📡 Login Status: {response.status_code}")
        print(f"📄 Login Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Connexion réussie! Token: {data.get('token', 'N/A')[:10]}...")
        else:
            print(f"❌ Échec connexion: {response.status_code}")
            
    except Exception as e:
        print(f"💥 Erreur: {e}")

if __name__ == "__main__":
    create_test_user()