const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification Socket.IO
 */
const socketAuthMiddleware = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.warn('⚠️ Connexion sans token, utilisateur invité');
      socket.userId = null;
      socket.username = 'Invité';
      return next();
    }

    // ✅ Vérifier et décoder le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.SECRET_KEY);
    
    console.log('🔍 Token décodé complet:', JSON.stringify(decoded, null, 2));
    
    // ✅ Extraire les bonnes clés (adapter selon votre token)
    socket.userId = decoded.user_id || decoded.id || decoded.sub;
    socket.username = decoded.username || decoded.name || decoded.email?.split('@')[0] || 'Utilisateur';

    console.log(`🔐 Authentification réussie: ${socket.username} (ID: ${socket.userId})`);
    next();
  } catch (error) {
    console.error('❌ Erreur authentification Socket:', error.message);
    
    // ✅ Mode invité en cas d'erreur
    socket.userId = null;
    socket.username = 'Invité';
    next();
  }
};

module.exports = socketAuthMiddleware;