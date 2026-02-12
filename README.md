# 🎉 ToutNight - Plateforme d'Événements en Temps Réel

Architecture fullstack professionnelle combinant Django REST API, Node.js WebSocket et React, orchestrée avec Docker.

## 📋 Table des matières

- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancement du projet](#lancement-du-projet)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [API Documentation](#api-documentation)
- [Dépannage](#dépannage)

## 🚀 Technologies

### Backend
- **Django 6.x** - Framework web Python
- **Django REST Framework** - API RESTful
- **Simple JWT** - Authentification par tokens
- **MySQL 8.0** - Base de données relationnelle

### Temps Réel
- **Node.js 18** - Runtime JavaScript
- **Express** - Framework web minimaliste
- **Socket.IO** - Communication bidirectionnelle en temps réel
- **MySQL2** - Client MySQL pour Node.js

### Frontend
- **React 18** - Bibliothèque UI
- **Vite** - Build tool ultra-rapide
- **Axios** - Client HTTP
- **Socket.IO Client** - Client WebSocket
- **React Router** - Routing côté client

### Infrastructure
- **Docker & Docker Compose** - Conteneurisation
- **Nginx** - Reverse proxy et serveur web
- **Gunicorn** - Serveur WSGI pour Django

## 📦 Prérequis

- **Docker Desktop** (Windows/Mac) ou **Docker Engine + Docker Compose** (Linux)
- **Git**

C'est tout ! Plus besoin d'installer Python, Node.js ou MySQL séparément.

## 🛠️ Installation

### 1. Cloner le projet
```bash
git clone https://github.com/Rayan-Madi/Tout-Night-
cd event-platform
```

### 2. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :
```env
# Django
SECRET_KEY=votre-cle-secrete-ultra-longue-et-complexe
DEBUG=True

# Base de données MySQL
DB_NAME=toutnight_db
DB_USER=toutnight_user
DB_PASSWORD=VotreMotDePasseSecurise2026
DB_HOST=mysql
DB_PORT=3306

# JWT
JWT_SECRET=votre-cle-jwt-secrete
```

### 3. Construire et lancer les conteneurs
```bash
# Construire les images Docker
docker-compose build

# Lancer tous les services
docker-compose up -d
```

Les services démarrent automatiquement :
- ✅ MySQL (port 3307)
- ✅ Django API (port 8000)
- ✅ Node.js WebSocket (port 4000)
- ✅ Nginx (port 80)

### 4. Initialiser la base de données
```bash
# Créer les tables
docker-compose exec django python manage.py migrate

# Créer un superutilisateur
docker-compose exec django python manage.py createsuperuser

# (Optionnel) Générer des événements factices
docker-compose exec django python seed_events.py
```

### 5. Créer la table de chat
```bash
# Se connecter à MySQL
docker-compose exec mysql mysql -u root -p

# Entrer le mot de passe (celui de DB_PASSWORD dans .env)
# Puis exécuter :
USE toutnight_db;

CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  user_id INT NOT NULL,
  username VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_event_id (event_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

exit;
```

## ▶️ Lancement du projet

### Démarrer tous les services
```bash
docker-compose up -d
```

### Accéder à l'application

- **Frontend** : http://localhost
- **API Django** : http://localhost:8000
- **Admin Django** : http://localhost:8000/admin
- **WebSocket** : http://localhost:4000

### Arrêter les services
```bash
docker-compose down
```

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f django
docker-compose logs -f nodejs
docker-compose logs -f mysql
docker-compose logs -f nginx
```

## 📁 Structure du projet
```
event-platform/
├── backend/                 # API Django
│   ├── apps/
│   │   ├── users/           # Gestion utilisateurs
│   │   ├── events/          # Gestion événements
│   │   ├── tickets/         # Gestion billets
│   │   └── notifications/   # Notifications
│   ├── config/              # Configuration Django
│   └── manage.py
├── realtime/                # Serveur WebSocket Node.js
│   └── src/
│       ├── config/          # Config DB & JWT
│       ├── sockets/         # Gestionnaires Socket.IO
│       ├── services/        # Logique métier
│       └── server.js
├── frontend/                # Application React
│   └── src/
│       ├── api/             # Client Axios
│       ├── components/      # Composants réutilisables
│       ├── contexts/        # Contexts React
│       ├── pages/           # Pages de l'application
│       └── sockets/         # Client Socket.IO
├── docker/                  # Configuration Docker
│   ├── django.Dockerfile
│   ├── node.Dockerfile
│   ├── nginx.Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .env                     # Variables d'environnement
└── README.md
```

## ✨ Fonctionnalités

### Authentification
- ✅ Inscription/Connexion avec JWT
- ✅ Tokens (access + refresh)
- ✅ Profil utilisateur éditable

### Événements
- ✅ Création d'événements par les organisateurs
- ✅ Liste et recherche avancée
- ✅ Filtrage par catégorie, ville, date
- ✅ Gestion automatique des places disponibles
- ✅ Génération de slugs uniques

### Billets
- ✅ Système d'achat de billets
- ✅ Annulation possible
- ✅ Historique complet des achats
- ✅ Numéros de billets uniques

### Temps Réel
- ✅ Chat en direct par événement
- ✅ Notifications instantanées
- ✅ Indicateur "utilisateur en train d'écrire"
- ✅ Synchronisation en temps réel

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
```json
{
  "refresh": "your_refresh_token"
}
```

**POST** `/api/users/register/` - Inscription
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Événements

**GET** `/api/events/` - Liste des événements
- Query params : `search`, `category`, `city`, `ordering`

**GET** `/api/events/{slug}/` - Détails d'un événement

**POST** `/api/events/` - Créer un événement (authentifié, organisateur)
```json
{
  "title": "Concert Rock",
  "description": "Super concert",
  "category": "concert",
  "start_date": "2026-06-15T20:00:00Z",
  "end_date": "2026-06-15T23:00:00Z",
  "location": "Zénith de Paris",
  "address": "211 Avenue Jean Jaurès",
  "city": "Paris",
  "price": "45.00",
  "capacity": 2000
}
```

**GET** `/api/events/my-events/` - Mes événements créés

### Billets

**GET** `/api/tickets/` - Mes billets achetés

**POST** `/api/tickets/` - Acheter un billet
```json
{
  "event": 1,
  "quantity": 2
}
```

**POST** `/api/tickets/{ticket_number}/cancel/` - Annuler un billet

## 🔌 WebSocket Events

### Connexion
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:4000', {
  auth: { token: 'your_jwt_token' }
});
```

### Chat
- **Émettre** `join_event` - Rejoindre le chat d'un événement
```javascript
  socket.emit('join_event', { eventId: 13, userId: 1, username: 'John' });
```
- **Émettre** `send_message` - Envoyer un message
```javascript
  socket.emit('send_message', {
    eventId: 13,
    userId: 1,
    username: 'John',
    message: 'Hello!'
  });
```
- **Recevoir** `new_message` - Nouveau message reçu
- **Recevoir** `previous_messages` - Historique des messages

### Notifications
- **Recevoir** `notification` - Nouvelle notification

## 🛠️ Commandes utiles

### Gestion des conteneurs
```bash
# Voir l'état des conteneurs
docker-compose ps

# Reconstruire après modification du code
docker-compose build
docker-compose up -d

# Redémarrer un service spécifique
docker-compose restart django

# Accéder au shell d'un conteneur
docker-compose exec django bash
docker-compose exec nodejs sh

# Exécuter une commande Django
docker-compose exec django python manage.py makemigrations
docker-compose exec django python manage.py migrate
```

### Base de données
```bash
# Backup de la base de données
docker-compose exec mysql mysqldump -u root -p toutnight_db > backup.sql

# Restore
docker-compose exec -T mysql mysql -u root -p toutnight_db < backup.sql

# Accéder à MySQL
docker-compose exec mysql mysql -u root -p
```

### Nettoyage
```bash
# Arrêter et supprimer les conteneurs
docker-compose down

# Supprimer aussi les volumes (⚠️ efface la base de données)
docker-compose down -v

# Nettoyer les images non utilisées
docker system prune -a
```

## 🐛 Dépannage

### Erreur CORS
Si vous voyez des erreurs CORS dans la console :
- Vérifiez que `corsheaders` est dans `INSTALLED_APPS`
- Vérifiez que `CorsMiddleware` est en haut de `MIDDLEWARE`
- Vérifiez `CORS_ALLOWED_ORIGINS` dans `settings.py`

### Le chat ne fonctionne pas
- Vérifiez que la table `chat_messages` existe
- Vérifiez les logs Node.js : `docker-compose logs nodejs`
- Vérifiez que le fichier `db.js` existe dans `realtime/src/config/`

### Port déjà utilisé
Si un port est déjà utilisé (80, 3307, 4000, 8000) :
- Arrêtez le service qui utilise ce port
- Ou modifiez les ports dans `docker-compose.yml`

### Les migrations ne s'appliquent pas
```bash
docker-compose exec django python manage.py makemigrations
docker-compose exec django python manage.py migrate
docker-compose restart django
```

## 👨‍💻 Auteurs

- **Rayan Madi** - Développement fullstack
- **[Votre nom]** - Contributions

## 📄 Licence

MIT

## 🤝 Contribution

Les pull requests sont les bienvenues ! Pour des changements majeurs, ouvrez d'abord une issue pour discuter de ce que vous aimeriez changer.