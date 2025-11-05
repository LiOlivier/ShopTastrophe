"""
Test de validation des emails - vérifie que les emails invalides sont rejetés
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_invalid_emails():
    print("🧪 Test de validation des emails...")
    
    # Liste d'emails invalides qui doivent être rejetés
    invalid_emails = [
        "test@",                    # Pas de domaine
        "test@exemple",             # Pas d'extension
        "test@exemple.",            # Extension vide
        "test@exemple.c",           # Extension trop courte
        "test@exemple.co",          # Extension non autorisée (.co)
        "test@exemple.xyz",         # Extension non autorisée
        "test.exemple.com",         # Pas de @
        "@exemple.com",             # Pas d'utilisateur
        "test@@exemple.com",        # Double @
    ]
    
    import time
    timestamp = int(time.time())
    
    for i, email in enumerate(invalid_emails):
        print(f"\n📧 Test {i+1}: {email}")
        
        user_data = {
            "email": email,
            "password": "motdepasse123",
            "first_name": "Test",
            "last_name": "User",
            "address": "123 Test Street"
        }
        
        try:
            response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
            print(f"📡 Status: {response.status_code}")
            
            if response.status_code == 400:
                print("✅ Email correctement rejeté!")
                print(f"📄 Raison: {response.text}")
            else:
                print(f"❌ Email accepté à tort! Response: {response.text}")
                
        except Exception as e:
            print(f"💥 Erreur: {e}")

def test_valid_emails():
    print("\n\n🧪 Test d'emails valides...")
    
    # Liste d'emails valides qui doivent être acceptés
    valid_emails = [
        "test@exemple.com",
        "test@exemple.fr", 
        "test@exemple.org",
        "test@exemple.net",
        "user.name@domain.edu",
        "test123@site.gov",
        "lol@",
        "lol@gmail.c"
    ]
    
    import time
    timestamp = int(time.time())
    
    for i, email in enumerate(valid_emails):
        print(f"\n📧 Test {i+1}: {email}")
        
        # Ajouter timestamp pour éviter les conflits
        unique_email = email.replace("test", f"test{timestamp}{i}")
        
        user_data = {
            "email": unique_email,
            "password": "motdepasse123",
            "first_name": "Test",
            "last_name": "User",
            "address": "123 Test Street"
        }
        
        try:
            response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
            print(f"📡 Status: {response.status_code}")
            
            if response.status_code == 200:
                print("✅ Email correctement accepté!")
            else:
                print(f"❌ Email rejeté à tort! Response: {response.text}")
                
        except Exception as e:
            print(f"💥 Erreur: {e}")

if __name__ == "__main__":
    test_invalid_emails()
    test_valid_emails()