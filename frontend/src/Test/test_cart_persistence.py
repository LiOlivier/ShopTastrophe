"""
Script de test pour vérifier la persistance des paniers
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_cart_persistence():
    print("🧪 Test de persistance des paniers")
    print("=" * 50)
    
    # 1. Créer un utilisateur
    register_data = {
        "email": "test@example.com",
        "password": "password123",
        "first_name": "Test",
        "last_name": "User",
        "address": "123 Test Street"
    }
    
    print("📝 Création d'un utilisateur...")
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        if response.status_code == 200:
            print("✅ Utilisateur créé")
        else:
            print(f"⚠️  Utilisateur existe déjà (code {response.status_code})")
    except:
        print("❌ Erreur lors de la création d'utilisateur")
        return
    
    # 2. Se connecter
    login_data = {
        "email": "test@example.com", 
        "password": "password123"
    }
    
    print("🔑 Connexion...")
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            token = response.json()["token"]
            print(f"✅ Connecté (token: {token[:8]}...)")
        else:
            print(f"❌ Échec de la connexion: {response.text}")
            return
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        return
    
    # 3. Ajouter des produits au panier
    print("\n🛒 Ajout de produits au panier...")
    cart_items = [
        {"product_id": "1", "qty": 2},  # T-Shirt
        {"product_id": "3", "qty": 1}   # Casquette
    ]
    
    for item in cart_items:
        try:
            add_data = {"token": token, **item}
            response = requests.post(f"{BASE_URL}/cart/add", json=add_data)
            if response.status_code == 200:
                print(f"✅ Ajouté: Produit {item['product_id']} x{item['qty']}")
            else:
                print(f"❌ Échec ajout produit {item['product_id']}: {response.text}")
        except Exception as e:
            print(f"❌ Erreur ajout: {e}")
    
    # 4. Vérifier le panier
    print("\n📋 Vérification du panier...")
    try:
        response = requests.get(f"{BASE_URL}/cart/view", params={"token": token})
        if response.status_code == 200:
            cart = response.json()
            print(f"✅ Panier trouvé: {len(cart['items'])} articles")
            print(f"   Total: {cart['total_cents']/100:.2f}€")
            for item in cart['items']:
                print(f"   - Produit {item['product_id']}: {item['quantity']}x")
        else:
            print(f"❌ Erreur lecture panier: {response.text}")
    except Exception as e:
        print(f"❌ Erreur: {e}")
    
    print(f"\n🔄 MAINTENANT: Redémarrez le serveur et reconnectez-vous")
    print(f"   Le panier devrait persister avec les mêmes articles !")
    print(f"   Token à réutiliser: {token}")

if __name__ == "__main__":
    test_cart_persistence()