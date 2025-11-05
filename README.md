# ShopTastrophe 😏

Une application e-commerce avec FastAPI (backend) et React (frontend).

## Configuration de la base de données

### Option 1: Base de données SQLite (Recommandée pour le développement)

L'application utilise par défaut SQLite avec le fichier `shop.db` qui sera créé automatiquement.

```powershell
# Installer les dépendances Python
py -m pip install -r requirements.txt

# La base de données SQLite sera créée automatiquement au premier démarrage
```

## Test de persistance des paniers

Pour tester que les paniers se conservent après déconnexion :

1. **Créer un compte et se connecter**
2. **Ajouter des produits au panier** 
3. **Redémarrer le serveur ou se déconnecter**
4. **Se reconnecter** → Le panier doit contenir les mêmes articles !

```powershell
# Script de test automatique
py test_cart_persistence.py
```

### Option 2: Base de données PostgreSQL/MySQL (Production)

Pour utiliser une autre base de données, modifiez la variable d'environnement `DATABASE_URL` :

```powershell
# Exemple PostgreSQL
$env:DATABASE_URL="postgresql://user:password@localhost/shopdb"

# Exemple MySQL
$env:DATABASE_URL="mysql+pymysql://user:password@localhost/shopdb"
```

## Démarrage rapide

### Backend (FastAPI)

```powershell
# Se placer dans le dossier du projet
cd "c:\Users\lioli\Desktop\BUT3FA\Qualité Dév\ShopTastrophe"

# Installer les dépendances
py -m pip install -r requirements.txt

# Démarrer le serveur de développement
py -m uvicorn backend.main:app --reload --port 8000
```

Le backend sera disponible sur : http://127.0.0.1:8000

- API Documentation: http://127.0.0.1:8000/docs
- Produits: http://127.0.0.1:8000/products

### Frontend (React/Vite)

```powershell
# Se placer dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera disponible sur : http://localhost:5173 ou http://localhost:5174

## Test de persistance des paniers 🛒

**Le problème était** : ajouter 1 article au panier, se déconnecter → le panier restait à 1, se reconnecter → ça doublait à 2, puis 4, etc.

**La solution** : Synchronisation complète backend/frontend avec l'API + correction du hachage des mots de passe

### 🧪 **Pour tester la correction :**

1. **Ouvrir** http://localhost:5174 (frontend)
2. **Créer un compte** via "Inscription" avec email/mot de passe
3. **Se connecter** avec les mêmes identifiants → Le profil s'affiche ✅
4. **Ajouter 2 produits** au panier → Backend sauvegarde en base SQLite
5. **Se déconnecter** → Panier passe à 0 (localStorage guest vide)
6. **Se reconnecter** → Panier = 2 (rechargé depuis backend) ✅
7. **Fermer/rouvrir navigateur + se reconnecter** → Panier = 2 ✅

### 🔧 **Corrections apportées :**

- **PasswordHasher** : Utilise `hashlib.sha256()` au lieu de `hash()` Python (non déterministe)
- **Base de données** : Supprimée et recréée pour éviter les conflits d'anciens comptes
- **AuthContext** : Utilise maintenant l'API `/auth/login` et stocke le `token`
- **CartContext** : Synchronise avec `/cart/add`, `/cart/view`, `/cart/remove` quand connecté
- **API client** : Nouveau fichier `frontend/src/api/client.js`
- **Backend** : `CartRepositorySQL` sauvegarde dans `cart_items` table

### ⚠️ **Note importante :**
Les anciens comptes créés avant la correction ne fonctionnent plus. Il faut créer un nouveau compte.

## Structure du projet

```
ShopTastrophe/
├── backend/                 # API FastAPI
│   ├── main.py             # Point d'entrée de l'application
│   ├── shop.py             # Classes métier (User, Product, etc.)
│   ├── models.py           # Modèles SQLModel pour la base
│   ├── db.py               # Configuration base de données
│   ├── core.py             # Instances globales et services
│   ├── persistence_sql.py  # Repositories SQL
│   └── api/                # Routes API
│       ├── auth.py         # Authentification
│       ├── cart.py         # Panier
│       └── orders.py       # Commandes
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── context/        # Contextes React (Auth, Cart)
│   │   └── api/            # Client API
│   └── public/             # Assets statiques
└── requirements.txt        # Dépendances Python
```

## API Endpoints

### Authentification
- `POST /auth/register` - Créer un compte
- `POST /auth/login` - Se connecter

### Produits
- `GET /products` - Liste des produits

### Panier
- `POST /cart/add` - Ajouter au panier
- `GET /cart/view` - Voir le panier
- `DELETE /cart/remove` - Retirer du panier

### Commandes
- `POST /orders/checkout` - Finaliser une commande
- `GET /orders/list` - Historique des commandes

## Données de test

Au premier démarrage, l'application ajoute automatiquement des produits de démonstration :
- T-Shirt Ironique - 25.00€
- Sweat Sarcastique - 60.00€  
- Casquette Stylée - 20.00€
- Chatastrophe - 15.00€

## Problèmes courants

### Erreur d'import SQLModel/SQLAlchemy
```powershell
py -m pip install --upgrade sqlmodel sqlalchemy
```

### Le serveur ne démarre pas
Vérifiez que le port 8000 n'est pas utilisé par une autre application :
```powershell
netstat -an | findstr :8000
```

### Erreurs de CORS
Le backend est configuré pour accepter les requêtes depuis `http://localhost:5173` (port par défaut de Vite).