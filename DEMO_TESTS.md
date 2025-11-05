# 🧪 Démonstration Tests - ShopTastrophe

## 📋 Présentation Qualité Développement

### 🎯 Objectifs de la démonstration
Montrer l'implémentation de bonnes pratiques de développement avec :
- Validation des données côté client et serveur
- Tests fonctionnels et unitaires
- Interface de test pour validation manuelle
- Documentation des cas de test

---

## 🌐 Interface de Test Principal

**Fichier :** `frontend/test-api.html`

### Comment lancer la démonstration :

1. **Démarrer les serveurs :**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python -m uvicorn main:app --reload --port 8000
   
   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

2. **Ouvrir l'interface de test :**
   - Ouvrir `frontend/test-api.html` dans un navigateur
   - Ou aller sur http://localhost:5173 et naviguer vers les tests

---

## 🧪 Tests Implémentés

### 📧 Validation Email
**Tests disponibles :**
- ✅ `user@example.com` - Email valide
- ❌ `user@test.c` - Extension invalide  
- ❌ `user@test` - Format incomplet
- ✅ `contact@site.fr` - Extension française valide

**Règles validées :**
- Format `nom@domaine.extension`
- Extensions autorisées : `.com`, `.fr`, `.org`, `.net`, etc.
- Rejet des extensions courtes ou non reconnues

### 📱 Validation Téléphone
**Tests disponibles :**
- ✅ `+33 1 23 45 67 89` - Format français complet
- ✅ `+33 123456789` - 9 chiffres maximum
- ❌ `+33 1234567890` - Trop de chiffres (10)
- ❌ `01 23 45 67 89` - Sans préfixe +33

**Règles validées :**
- Préfixe `+33` obligatoire
- Maximum 9 chiffres après +33
- Auto-conversion des anciens formats

### 🔐 Authentification
**Tests disponibles :**
- Création d'utilisateur avec validation
- Login avec gestion des erreurs
- Gestion des tokens d'authentification

### 💳 Système de Paiement
**Tests disponibles :**
- Flux complet panier → checkout → paiement
- Validation des cartes de crédit
- Gestion des échecs de paiement

### 📦 Suivi de Commandes
**Tests disponibles :**
- Timeline de statuts de commande
- Interface de suivi utilisateur
- Historique des commandes

---

## 🐍 Tests Automatisés Python

### Fichiers de test :
- `frontend/src/Test/test_auth.py` - Tests d'authentification
- `frontend/src/Test/test_cart_persistence.py` - Tests de panier
- `frontend/src/Test/test_minimal_server.py` - Tests serveur

### Lancer les tests Python :
```bash
cd frontend/src/Test
python test_auth.py
python test_cart_persistence.py
```

---

## ⚛️ Tests React

### Composant de test :
`frontend/src/Test/TestAuth.jsx`

Composant React intégré pour tester l'authentification directement dans l'interface utilisateur.

---

## 📊 Points Qualité Démontrés

### 1. **Validation des Données**
- ✅ Validation côté client (temps réel)
- ✅ Validation côté serveur (sécurité)
- ✅ Messages d'erreur explicites
- ✅ Feedback utilisateur immédiat

### 2. **Tests Complets**
- ✅ Tests unitaires (validation functions)
- ✅ Tests d'intégration (API)
- ✅ Tests manuels (interface HTML)
- ✅ Tests automatisés (Python scripts)

### 3. **Documentation**
- ✅ Documentation des tests
- ✅ Exemples d'utilisation
- ✅ Guide de démonstration
- ✅ Cas de test documentés

### 4. **Expérience Utilisateur**
- ✅ Validation en temps réel
- ✅ Messages d'erreur clairs
- ✅ Interface intuitive
- ✅ Feedback visuel

---

## 🎬 Script de Démonstration (pour le prof)

### 1. **Montrer la page de test**
- Ouvrir `test-api.html`
- Expliquer l'organisation des tests

### 2. **Démontrer la validation email**
- Tester `user@test.c` → Montrer l'erreur
- Tester `user@example.com` → Montrer le succès
- Expliquer les règles implémentées

### 3. **Démontrer la validation téléphone**
- Tester `01 23 45 67 89` → Montrer l'erreur
- Tester `+33 1 23 45 67 89` → Montrer le succès
- Montrer la limitation à 9 chiffres

### 4. **Montrer les tests automatisés**
- Lancer `python test_auth.py`
- Expliquer la stratégie de test

### 5. **Démontrer dans l'application**
- Aller sur la page Profile
- Montrer la validation en temps réel
- Montrer les messages de validation

---

## 🏆 Valeur Ajoutée Qualité

Cette approche démontre :
- **Rigueur technique** : Validation multi-niveaux
- **Approche professionnelle** : Tests documentés et organisés  
- **Expérience utilisateur** : Feedback immédiat et clair
- **Maintenabilité** : Code testé et documenté
- **Sécurité** : Validation côté client ET serveur

---

*Démonstration préparée pour le cours de Qualité Développement*