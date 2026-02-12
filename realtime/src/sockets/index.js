const { Server } = require('socket.io');
const handleChatEvents = require('./chat.socket');
const handleEventSocket = require('./event.socket');
const socketAuthMiddleware = require('../middlewares/auth.middleware');

/**
 * Initialise Socket.IO avec authentification
 */
const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost",
        "http://localhost:5173",
        "http://localhost:8000"
      ],
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  // ✅ AJOUTER LE MIDDLEWARE D'AUTHENTIFICATION
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log(
      `✅ Utilisateur connecté: ${socket.username} (ID: ${socket.userId})`
    );

    // Rejoindre la room personnelle de l'utilisateur
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    handleChatEvents(socket, io);
    handleEventSocket(socket, io);

    socket.on("disconnect", () => {
      console.log(`❌ Utilisateur déconnecté: ${socket.username}`);
    });
  });

  return io;
};

module.exports = { initializeSocket };