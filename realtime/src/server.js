const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const { initializeSocket } = require('./sockets');
const notifyRoutes = require('./routes/notify.routes');
require('./config/db'); // Initialiser la connexion DB

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8000'],
  credentials: true,
}));
app.use(express.json());

// Initialiser Socket.IO
const io = initializeSocket(server);
app.set('io', io); // Rendre io accessible dans les routes

// Routes HTTP
app.use('/api', notifyRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'Serveur temps réel opérationnel',
    version: '1.0.0'
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur Node.js démarré sur http://localhost:${PORT}`);
  console.log(`🔌 WebSocket prêt pour les connexions`);
});

module.exports = { app, server, io };