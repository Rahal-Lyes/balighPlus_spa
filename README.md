# 🏘️ Balligh+ — بلّغ+
### Plateforme Intelligente de Signalement Urbain
**Stack :** Vue 3 + Pinia + Vue Router + Leaflet + Chart.js &nbsp;|&nbsp; FastAPI + JWT + JSON storage

---

## 📁 Structure du projet

```
balligh-plus/
├── backend/                   ← FastAPI Python
│   ├── main.py                ← App entry point
│   ├── requirements.txt
│   ├── models/
│   │   └── db.py              ← JSON file storage + seed data
│   ├── routers/
│   │   ├── auth.py            ← Register / Login / Admin login
│   │   ├── reports.py         ← CRUD + vote + CSV export
│   │   ├── comments.py
│   │   ├── notifications.py
│   │   ├── admin.py           ← Dashboard stats + charts data
│   │   └── users.py           ← Profile + ban + delete
│   ├── schemas/
│   │   └── schemas.py         ← Pydantic validation
│   └── utils/
│       └── security.py        ← JWT + bcrypt
│
└── frontend/                  ← Vue 3 (Vite)
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.js
        ├── App.vue            ← Navbar + Toast + Lightbox + Notifs
        ├── assets/
        │   └── main.css       ← Global styles (fidèle au PHP)
        ├── router/
        │   └── index.js
        ├── stores/
        │   ├── auth.js        ← Pinia auth store
        │   └── toast.js       ← Pinia toast store
        ├── composables/
        │   ├── useI18n.js     ← AR / FR / EN translations
        │   └── useApi.js      ← Axios + WILAYAT + CATEGORIES
        ├── components/
        │   ├── ReportCard.vue
        │   ├── StatusBadge.vue
        │   ├── StatCard.vue
        │   ├── EmptyState.vue
        │   ├── AlertMsg.vue
        │   └── LoadingSpinner.vue
        └── views/
            ├── HomeView.vue
            ├── ReportsView.vue
            ├── ReportDetailView.vue
            ├── NewReportView.vue
            ├── MyReportsView.vue
            ├── ProfileView.vue
            ├── LoginView.vue
            ├── RegisterView.vue
            ├── MapView.vue
            └── AdminView.vue
```

---

## 🚀 Installation & Lancement

### Prérequis
- **Python** ≥ 3.11
- **Node.js** ≥ 18

---

### ① Backend (FastAPI)

```bash
# 1. Aller dans le dossier backend
cd balligh-plus/backend

# 2. Créer un environnement virtuel
python -m venv venv

# Activer (Linux/Mac)
source venv/bin/activate
# Activer (Windows)
venv\Scripts\activate

# 3. Installer les dépendances
pip install -r requirements.txt

# 4. Lancer le serveur
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ API disponible sur **http://localhost:8000**
📖 Swagger UI sur **http://localhost:8000/docs**

---

### ② Frontend (Vue 3 + Vite)

```bash
# 1. Aller dans le dossier frontend
cd balligh-plus/frontend

# 2. Installer les dépendances npm
npm install

# 3. Lancer le serveur de développement
npm run dev
```

✅ App disponible sur **http://localhost:5173**

---

### ③ Build production

```bash
# Build frontend
cd frontend
npm run build
# Les fichiers sont dans dist/

# Servir les fichiers statiques depuis FastAPI
# Ajouter dans main.py :
# app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")
```

---

## 🔑 Comptes de démonstration

| Rôle      | Email                   | Mot de passe |
|-----------|-------------------------|--------------|
| Citoyen 1 | ahmed@example.com       | citizen1     |
| Citoyen 2 | fatima@example.com      | citizen2     |
| Admin     | *(onglet Admin)*        | admin123     |

---

## 🌐 Pages & Routes

| Route            | Vue                   | Auth       |
|------------------|-----------------------|------------|
| `/`              | HomeView              | Public     |
| `/reports`       | ReportsView           | Public     |
| `/reports/:id`   | ReportDetailView      | Public     |
| `/map`           | MapView               | Public     |
| `/login`         | LoginView             | Public     |
| `/register`      | RegisterView          | Public     |
| `/new-report`    | NewReportView         | 🔒 Citoyen |
| `/my-reports`    | MyReportsView         | 🔒 Citoyen |
| `/profile`       | ProfileView           | 🔒 Citoyen |
| `/admin`         | AdminView             | 🛡️ Admin   |

---

## 🔌 API Endpoints

### Auth
```
POST /api/auth/register       Inscription
POST /api/auth/login          Connexion citoyen
POST /api/auth/admin-login    Connexion admin
```

### Reports
```
GET    /api/reports/          Liste (filtrée)
GET    /api/reports/stats     Statistiques
GET    /api/reports/{id}      Détail
POST   /api/reports/          Créer (multipart/form-data)
POST   /api/reports/{id}/vote Voter
PATCH  /api/reports/{id}/status   Changer statut (admin)
DELETE /api/reports/{id}      Supprimer (admin)
GET    /api/reports/export/csv    Export CSV (admin)
```

### Comments
```
GET    /api/comments/{report_id}  Commentaires d'un signalement
POST   /api/comments/             Ajouter un commentaire
DELETE /api/comments/{id}         Supprimer (admin)
```

### Notifications
```
GET  /api/notifications/          Mes notifications
POST /api/notifications/mark-read Tout marquer lu
GET  /api/notifications/unread-count Compteur
```

### Users
```
GET  /api/users/me                Profil courant
GET  /api/users/my-reports        Mes signalements
POST /api/users/change-password   Changer mot de passe
POST /api/users/{id}/toggle-ban   Bannir/débannir (admin)
DEL  /api/users/{id}              Supprimer (admin)
```

### Admin Dashboard
```
GET  /api/admin/dashboard         Stats + graphiques + listes complètes
```

---

## ✨ Fonctionnalités

- 🌍 **Multilingue** : Arabe (RTL) / Français / Anglais
- 🗺️ **Carte Leaflet** : localisation GPS + carte interactive
- 🖼️ **Upload photos** : drag & drop, preview, lightbox
- 🔔 **Notifications** temps réel (polling 30s)
- 📊 **Dashboard Admin** : KPIs + Chart.js (bar + doughnut)
- 🏛️ **58 wilayas** avec communes complètes
- 🔒 **Auth JWT** avec roles (citizen / admin)
- 📱 **Responsive** mobile-first avec menu hamburger

---

## ⚙️ Variables d'environnement (optionnel)

Créer `backend/.env` :
```env
SECRET_KEY=votre_cle_secrete_jwt
ADMIN_PASSWORD=votre_mot_de_passe_admin
```

Et dans `utils/security.py` et `routers/auth.py`, utiliser `os.getenv(...)`.# balighPlus_spa
