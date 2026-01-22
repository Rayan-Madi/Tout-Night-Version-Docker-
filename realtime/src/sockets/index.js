const { Server } = require('socket.io');
const { socketAuth } = require('../middlewares/auth.middleware');
const handleChatEvents = require('./chat.socket');
const handleEventSocket = require('./event.socket');

/**
 * Initialise Socket.IO avec authentification
 */
const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // React dev server
      credentials: true,
    },
  });
  
  // Middleware d'authentification
  io.use(socketAuth);
  
  // Gestion des connexions
  io.on('connection', (socket) => {
    console.log(`✅ Utilisateur connecté: ${socket.username} (ID: ${socket.userId})`);
    
    // Rejoindre une room personnelle (pour les notifications)
    socket.join(`user:${socket.userId}`);
    
    // Enregistrer les gestionnaires d'événements
    handleChatEvents(socket, io);
    handleEventSocket(socket, io);
    
    // Déconnexion
    socket.on('disconnect', () => {
      console.log(`❌ Utilisateur déconnecté: ${socket.username}`);
    });
  });
  
  return io;
};

module.exports = { initializeSocket };