import { io } from "socket.io-client";

// Instance Socket.IO
let socket = null;

/**
 * Initialise la connexion Socket.IO avec authentification
 * @param {string|null} token - Token JWT stocké côté client (localStorage)
 * @returns {Socket|null}
 */
export const initSocket = (token = null) => {
  if (socket) {
    console.warn("⚠️ Socket déjà initialisé");
    return socket;
  }

  // Récupérer token depuis localStorage si pas fourni
  if (!token) {
    token = localStorage.getItem("access_token");
  }

  if (!token) {
    console.warn("⚠️ Pas de token, connexion Socket.IO impossible");
    return null;
  }

  // Options de connexion
  const options = {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    transports: ["websocket", "polling"], // stable sous Docker
  };

  socket = io(import.meta.env.VITE_SOCKET_URL, options);

  // Connexion réussie
  socket.on("connect", () => {
    console.log("✅ Connecté au serveur temps réel :", socket.id);
  });

  // Déconnexion
  socket.on("disconnect", (reason) => {
    console.log("❌ Déconnecté du serveur temps réel. Raison :", reason);
  });

  // Erreur de connexion
  socket.on("connect_error", (error) => {
    console.error("❌ Erreur de connexion Socket.IO :", error.message);
  });

  // Erreurs envoyées par le serveur
  socket.on("error", (data) => {
    console.error("⚠️ Erreur Socket du serveur :", data?.message || data);
  });

  return socket;
};

/**
 * Récupère l'instance Socket.IO
 * @returns {Socket|null}
 */
export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

/**
 * Rejoint une room d'événement
 * @param {string} eventId - ID de l'événement
 */
export const joinEvent = (eventId) => {
  const socket = getSocket();
  if (!socket) return;

  socket.emit("join_event", eventId);

  // Écoute des messages de la room
  socket.on("previous_messages", (messages) => {
    console.log("📜 Messages précédents :", messages);
  });

  socket.on("new_message", (msg) => {
    console.log("💬 Nouveau message :", msg);
  });

  socket.on("user_joined", (data) => {
    console.log("👥 Utilisateur rejoint :", data);
  });

  socket.on("user_left", (data) => {
    console.log("👋 Utilisateur quitté :", data);
  });
};

/**
 * Envoie un message dans une room
 * @param {Object} params
 * @param {string} params.eventId
 * @param {string} params.userId
 * @param {string} params.username
 * @param {string} params.message
 */
export const sendMessage = ({ eventId, userId, username, message }) => {
  const socket = getSocket();
  if (!socket) return;

  if (!eventId || !userId || !username || !message) {
    console.warn("⚠️ Données manquantes pour send_message");
    return;
  }

  socket.emit("send_message", { eventId, userId, username, message });
};

/**
 * Déconnecte le socket et réinitialise l'instance
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🛑 Socket déconnecté et réinitialisé");
  }
};

// Export par défaut
export default { initSocket, getSocket, joinEvent, sendMessage, disconnectSocket };
