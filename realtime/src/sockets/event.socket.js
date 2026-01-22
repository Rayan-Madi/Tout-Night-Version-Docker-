const NotificationService = require('../services/notification.service');

/**
 * Gère les événements et notifications en temps réel
 */
const handleEventSocket = (socket, io) => {
  // Récupérer les notifications de l'utilisateur
  socket.on('notifications:get', async () => {
    try {
      const notifications = await NotificationService.getUserNotifications(socket.userId);
      socket.emit('notifications:list', notifications);
    } catch (error) {
      console.error('Erreur récupération notifications:', error);
      socket.emit('error', { message: 'Erreur de récupération des notifications' });
    }
  });

  // Marquer une notification comme lue
  socket.on('notification:read', async (notificationId) => {
    try {
      const success = await NotificationService.markAsRead(notificationId, socket.userId);
      if (success) {
        socket.emit('notification:marked_read', { id: notificationId });
      }
    } catch (error) {
      console.error('Erreur marquage notification:', error);
    }
  });

  // Marquer toutes les notifications comme lues
  socket.on('notifications:read_all', async () => {
    try {
      const count = await NotificationService.markAllAsRead(socket.userId);
      socket.emit('notifications:all_read', { count });
    } catch (error) {
      console.error('Erreur marquage toutes notifications:', error);
    }
  });

  // Événement personnalisé : mise à jour d'un événement
  socket.on('event:update', (data) => {
    const { eventId, update } = data;
    
    // Diffuser la mise à jour à tous les participants de l'événement
    io.to(`event:${eventId}`).emit('event:updated', {
      eventId,
      update,
      timestamp: new Date(),
    });
    
    console.log(`📢 Mise à jour de l'événement ${eventId}:`, update);
  });
};

module.exports = handleEventSocket;