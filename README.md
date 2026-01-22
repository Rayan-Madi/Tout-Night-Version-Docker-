# 🎉 Event Platform - Plateforme d'Événements en Temps Réel

Architecture fullstack professionnelle combinant Django REST API, Node.js WebSocket et React.

## 📋 Table des matières

- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancement du projet](#lancement-du-projet)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [API Documentation](#api-documentation)

## 🚀 Technologies

### Backend
- **Django 5.x** - Framework web Python
- **Django REST Framework** - API RESTful
- **Simple JWT** - Authentification par tokens
- **MySQL** - Base de données relationnelle

### Temps Réel
- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimaliste
- **Socket.IO** - Communication bidirectionnelle en temps réel
- **MySQL2** - Client MySQL pour Node.js

### Frontend
- **React 18** - Bibliothèque UI
- **Vite** - Build tool ultra-rapide
- **Axios** - Client HTTP
- **Socket.IO Client** - Client WebSocket
- **React Router** - Routing côté client

## 📦 Prérequis

- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- Git

## 🛠️ Installation

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd event-platform
```

### 2. Backend Django

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

Créer `.env` dans `backend/` :

```env
SECRET_KEY=votre-cle-secrete
DEBUG=True
DB_ENGINE=django.db.backends.mysql
DB_NAME=event_platform_db
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_HOST=127.0.0.1
DB_PORT=3306
REALTIME_SERVICE_URL=http://localhost:4000
```

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 3. Serveur temps réel Node.js

```bash
cd realtime
npm install
```

Créer `.env` dans `realtime/` :

```env
PORT=4000
JWT_SECRET=votre-cle-secrete
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=event_platform_db
DB_PORT=3306
```

Créer les tables MySQL :

```bash
mysql -u root -p event_platform_db < database.sql
```

### 4. Frontend React

```bash
cd frontend
npm install
```

Créer `.env` dans `frontend/` :

```env
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:4000
```

## ▶️ Lancement du projet

Ouvrir 3 terminaux :

**Terminal 1 - Django** :
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```
➡️ API accessible sur `http://localhost:8000`

**Terminal 2 - Node.js** :
```bash
cd realtime
npm run dev
```
➡️ WebSocket accessible sur `http://localhost:4000`

**Terminal 3 - React** :
```bash
cd frontend
npm run dev
```
➡️ Interface accessible sur `http://localhost:5173`

## 📁 Structure du projet

```
event-platform/
├── backend/                 # API Django
│   ├── apps/
│   │   ├── users/           # Gestion utilisateurs
│   │   ├── events/          # Gestion événements
│   │   ├── tickets/         # Gestion billets
│   │   └── notifications/   # Client Node.js
│   ├── config/              # Configuration Django
│   └── manage.py
├── realtime/                # Serveur WebSocket
│   └── src/
│       ├── config/          # Config DB & JWT
│       ├── sockets/         # Gestionnaires Socket.IO
│       ├── routes/          # Routes HTTP
│       └── services/        # Logique métier
├── frontend/                # Application React
│   └── src/
│       ├── api/             # Axios
│       ├── components/      # Composants
│       ├── contexts/        # Contexts React
│       ├── pages/           # Pages
│       └── sockets/         # Socket.IO client
└── README.md
```

## ✨ Fonctionnalités

### Authentification
- ✅ Inscription/Connexion
- ✅ JWT tokens (access + refresh)
- ✅ Profil utilisateur

### Événements
- ✅ Création d'événements
- ✅ Liste et recherche
- ✅ Filtrage par catégorie
- ✅ Gestion des places disponibles

### Billets
- ✅ Achat de billets
- ✅ Annulation
- ✅ Historique des achats

### Temps Réel
- ✅ Chat en direct par événement
- ✅ Notifications instantanées
- ✅ Indicateur "en train d'écrire"

## 📡 API Documentation

### Authentification

**POST** `/api/token/` - Obtenir un token JWT
```json
{
  "username": "user",
  "password": "password"
}
```

**POST** `/api/token/refresh/` - Rafraîchir le token

**POST** `/api/users/register/` - Inscription

### Événements

**GET** `/api/events/` - Liste des événements
- Query params : `search`, `category`, `city`

**GET** `/api/events/{slug}/` - Détails d'un événement

**POST** `/api/events/` - Créer un événement (authentifié)

**GET** `/api/events/my-events/` - Mes événements

### Billets

**GET** `/api/tickets/` - Mes billets

**POST** `/api/tickets/` - Acheter un billet
```json
{
  "event_id": 1,
  "quantity": 2
}
```

**POST** `/api/tickets/{ticket_number}/cancel/` - Annuler un billet

## 🔌 WebSocket Events

### Connexion
```javascript
socket = io('http://localhost:4000', {
  auth: { token: 'your_jwt_token' }
});
```

### Chat
- `join:event` - Rejoindre un chat
- `leave:event` - Quitter un chat
- `message:send` - Envoyer un message
- `message:received` - Recevoir un message

### Notifications
- `notifications:get` - Récupérer les notifications
- `notification:received` - Nouvelle notification

## 👨‍💻 Auteur

Votre nom - Event Platform

## 📄 Licence

MIT