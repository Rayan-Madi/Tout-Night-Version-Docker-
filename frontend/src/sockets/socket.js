import { io } from 'socket.io-client';

let socket = null;

/**
 * Initialise la connexion Socket.IO avec authentification
 */
export const initSocket = () => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    console.warn('⚠️  Pas de token, connexion Socket.IO impossible');
    return null;
  }
  
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });
  
  socket.on('connect', () => {
    console.log('✅ Connecté au serveur temps réel');
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Déconnecté du serveur temps réel');
  });
  
  socket.on('connect_error', (error) => {
    console.error('❌ Erreur de connexion Socket.IO:', error.message);
  });
  
  return socket;
};

/**
 * Récupère l'instance Socket.IO
 */
export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

/**
 * Déconnecte le socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default { initSocket, getSocket, disconnectSocket };