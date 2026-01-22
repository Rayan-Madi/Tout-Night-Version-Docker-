const MessageService = require('../services/message.service');

/**
 * Gère les événements de chat
 */
const handleChatEvents = (socket, io) => {
  // Rejoindre le chat d'un événement
  socket.on('join:event', async (eventId) => {
    socket.join(`event:${eventId}`);
    console.log(`👥 ${socket.username} a rejoint l'événement ${eventId}`);
    
    // Envoyer l'historique des messages
    try {
      const messages = await MessageService.getEventMessages(eventId);
      socket.emit('chat:history', messages);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
    
    // Notifier les autres participants
    socket.to(`event:${eventId}`).emit('user:joined', {
      username: socket.username,
      message: `${socket.username} a rejoint le chat`,
      timestamp: new Date(),
    });
  });

  // Quitter le chat d'un événement
  socket.on('leave:event', (eventId) => {
    socket.leave(`event:${eventId}`);
    console.log(`👋 ${socket.username} a quitté l'événement ${eventId}`);
    
    socket.to(`event:${eventId}`).emit('user:left', {
      username: socket.username,
      message: `${socket.username} a quitté le chat`,
      timestamp: new Date(),
    });
  });

  // Envoyer un message dans un chat
socket.on('message:send', async (data) => {
  const { eventId, message, userId, username } = data;  // ✅ Récupérer aussi userId et username
  
  if (!message || message.trim() === '') {
    return socket.emit('error', { message: 'Message vide' });
  }
  
  // Vérifier que toutes les données sont présentes
  if (!userId || !username) {
    console.error('❌ Données manquantes:', data);
    return socket.emit('error', { message: 'Données utilisateur manquantes' });
  }

    try {
      // Sauvegarder le message dans la DB
      const savedMessage = await MessageService.saveMessage(
        eventId,
        userId,
        username,
        message
      );
      
      const messageData = {
        id: savedMessage.id,
        userId: userId,
        username: username,
        message,
        timestamp: new Date(),
      };
      
      // Envoyer le message à tous les participants
      io.to(`event:${eventId}`).emit('message:received', messageData);
      
      console.log(`💬 Message de ${socket.username} dans l'événement ${eventId}`);
    } catch (error) {
      console.error('Erreur envoi message:', error);
      socket.emit('error', { message: 'Erreur lors de l\'envoi du message' });
    }
  });

  // L'utilisateur tape un message (typing indicator)
  socket.on('typing:start', (eventId) => {
    socket.to(`event:${eventId}`).emit('user:typing', {
      username: socket.username,
      userId: socket.userId,
    });
  });

  socket.on('typing:stop', (eventId) => {
    socket.to(`event:${eventId}`).emit('user:stopped_typing', {
      username: socket.username,
      userId: socket.userId,
    });
  });
};

module.exports = handleChatEvents;