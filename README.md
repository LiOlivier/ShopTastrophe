# 🛒 ShopTastrophe

Petit e-commerce développé en **React** + **FastAPI** pour un projet étudiant. Gestion de produits, panier, auth et commandes 🎉

## 🚀 Installation

### Prérequis
- Python 3.8+ 
- Node.js 16+
- Un terminal qui marche

### Comment faire tourner le truc

**1. Récupérer le code**
```bash
git clone [ton-repo-ici]
cd ShopTastrophe
```

**2. Backend (l'API)**
```bash
# Installer les trucs Python
pip install -r requirements.txt

# Lancer le serveur
python -m uvicorn backend.main:app --reload --port 8000
```
➡️ API dispo sur **http://localhost:8000**

**3. Frontend (le site)**
```bash
# Aller dans le dossier frontend
cd frontend

## 🎯 Ce que ça fait

- **Catalogue** : Des produits avec différentes couleurs/tailles
- **Panier** : Ajouter des trucs, les supprimer, tout ça
- **Comptes** : S'inscrire, se connecter (chacun son panier)
- **Commandes** : Valider ses achats et voir l'historique
- **Responsive** : Ça marche sur mobile et desktop

## 🛠️ Stack technique

**Frontend :**
- React 18 + Vite
- React Router pour la navigation  
- Context API pour l'état global
- CSS vanilla (pas de framework, on est pas des fainéants)

**Backend :**
- FastAPI (Python)
- SQLite pour stocker les données
- JWT pour l'auth
- Documentation auto avec Swagger

## 📂 Structure du projet
```
backend/                    # L'API
├── main.py                 # Point d'entrée  
├── shop.py                 # Classes métier (User, Product...)
├── core.py                 # Services globaux
└── api/                    # Routes
    ├── auth.py             # Login/register
    ├── cart.py             # Panier
    └── orders.py           # Commandes

frontend/                   # L'interface React
├── src/
│   ├── components/         # Composants réutilisables
│   ├── pages/             # Pages (Home, Products, Cart...)
│   ├── context/           # États globaux (Auth, Cart)
│   └── api/               # Appels API
└── public/                # Images et trucs statiques
```

## � API (si ça t'intéresse)

L'API REST est documentée automatiquement sur **http://localhost:8000/docs**

Quelques endpoints utiles :
- `POST /auth/register` - Créer un compte
- `POST /auth/login` - Se connecter
- `GET /products` - Liste des produits
- `POST /cart/add` - Ajouter au panier
- `POST /orders/checkout` - Finaliser commande

## 🐛 Si ça marche pas

**Port déjà utilisé ?**
```bash
# Changer le port du backend
python -m uvicorn backend.main:app --reload --port 8001

# Ou du frontend (dans package.json)
npm run dev -- --port 5174
```

**Problème d'import Python ?**
```bash
pip install --upgrade fastapi uvicorn sqlmodel
```

**CORS qui fait chier ?**
Vérifie que le frontend tourne bien sur `localhost:5173`, sinon ajuste dans `main.py`

## 🎓 Contexte

Projet réalisé pour le BUT 3 - Qualité de Développement. On a mis en pratique :
- Architecture propre (séparation frontend/backend)
- API REST bien documentée
- Gestion d'état côté client
- Persistence des données
- Tests (enfin... on devrait)

## Numéro de carte : 4111 1111 1111 1111
Mois d'expiration : 12
Année d'expiration : 2025
CVC : 123

---
*Made with ❤️ et beaucoup de café par des étudiants motivés*