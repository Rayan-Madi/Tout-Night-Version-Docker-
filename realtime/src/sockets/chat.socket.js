const messageService = require('../services/message.service');

/**
 * Branche tous les événements de chat sur un socket déjà connecté
 * @param {Socket} socket - Le socket de l'utilisateur
 * @param {Server} io - L'instance Socket.IO
 */
module.exports = (socket, io) => {
  console.log('🔥 chat.socket branché pour', socket.id);

  // Rejoindre une room d'événement
  socket.on('join_event', async (eventId) => {
    try {
      console.log(`📥 ${socket.id} rejoint l'événement ${eventId}`);

      // Quitter toutes les autres rooms d'événements
      const rooms = Array.from(socket.rooms);
      rooms.forEach((room) => {
        if (room.startsWith('event_')) {
          socket.leave(room);
        }
      });

      // Rejoindre la nouvelle room
      const roomName = `event_${eventId}`;
      socket.join(roomName);

      // Récupérer les messages existants
      const messages = await messageService.getEventMessages(eventId, 50);
      socket.emit('previous_messages', messages);

      // Notifier les autres utilisateurs
      socket.to(roomName).emit('user_joined', {
        userId: socket.userId || null,
        username: socket.username || 'Invité',
        eventId,
      });
    } catch (error) {
      console.error('Erreur join_event:', error);
      socket.emit('error', { message: 'Erreur lors de la connexion au chat' });
    }
  });

  // Quitter une room d'événement
  socket.on('leave_event', (eventId) => {
    const roomName = `event_${eventId}`;
    console.log(`👋 ${socket.username || socket.id} quitte l'événement ${eventId}`);

    socket.to(roomName).emit('user_left', {
      userId: socket.userId || null,
      username: socket.username || 'Invité',
      eventId,
    });

    socket.leave(roomName);
  });

  // Envoyer un message
  socket.on('send_message', async (data) => {
    try {
      const { eventId, message } = data;

      if (!eventId || !message) {
        socket.emit('error', { message: 'Données manquantes' });
        return;
      }

      console.log(`💬 Message de ${socket.username || 'Invité'} dans événement ${eventId}:`, message);

      // Sauvegarder le message en base de données
      const savedMessage = await messageService.createMessage(
        eventId,
        socket.userId || null,
        socket.username || 'Invité',
        message
      );

      // Envoyer le message à tous les utilisateurs dans la room
      const roomName = `event_${eventId}`;
      io.to(roomName).emit('new_message', savedMessage);
    } catch (error) {
      console.error('Erreur send_message:', error);
      socket.emit('error', { message: 'Erreur lors de l\'envoi du message' });
    }
  });

  // Supprimer un message
  socket.on('delete_message', async (data) => {
    try {
      const { messageId, eventId } = data;

      if (!messageId || !eventId) {
        socket.emit('error', { message: 'Données manquantes' });
        return;
      }

      const deleted = await messageService.deleteMessage(messageId, socket.userId || null);

      if (deleted) {
        const roomName = `event_${eventId}`;
        io.to(roomName).emit('message_deleted', { messageId });
      } else {
        socket.emit('error', { message: 'Impossible de supprimer le message' });
      }
    } catch (error) {
      console.error('Erreur delete_message:', error);
      socket.emit('error', { message: 'Erreur lors de la suppression du message' });
    }
  });

  // Utilisateur en train de taper
  socket.on('typing', (data) => {
    const { eventId } = data;
    if (eventId) {
      const roomName = `event_${eventId}`;
      socket.to(roomName).emit('user_typing', { username: socket.username || 'Invité' });
    }
  });

  // Utilisateur a arrêté de taper
  socket.on('stop_typing', (data) => {
    const { eventId } = data;
    if (eventId) {
      const roomName = `event_${eventId}`;
      socket.to(roomName).emit('user_stop_typing', { username: socket.username || 'Invité' });
    }
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('❌ Déconnexion socket:', socket.id);

    const rooms = Array.from(socket.rooms);
    rooms.forEach((room) => {
      if (room.startsWith('event_')) {
        socket.to(room).emit('user_left', {
          userId: socket.userId || null,
          username: socket.username || 'Invité',
        });
      }
    });
  });
};
