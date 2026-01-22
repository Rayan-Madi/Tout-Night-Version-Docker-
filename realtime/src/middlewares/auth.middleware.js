const { verifyToken } = require('../config/jwt');

/**
 * Middleware Socket.IO pour vérifier l'authentification
 */
const socketAuth = (socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Token manquant'));
  }
  
  const result = verifyToken(token);
  
  if (!result.valid) {
    return next(new Error('Token invalide'));
  }
  
  // Attacher les infos utilisateur au socket
  socket.userId = result.user.user_id;
  socket.username = result.user.username;
  
  next();
};

module.exports = { socketAuth };