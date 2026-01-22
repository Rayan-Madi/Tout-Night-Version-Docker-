const express = require('express');
const router = express.Router();

/**
 * Route appelée par Django pour envoyer des notifications
 * POST /api/notify
 */
router.post('/notify', (req, res) => {
  const { user_id, message, type } = req.body;
  
  if (!user_id || !message) {
    return res.status(400).json({ error: 'user_id et message requis' });
  }
  
  // Récupérer l'instance Socket.IO depuis l'app
  const io = req.app.get('io');
  
  // Envoyer la notification via WebSocket
  io.to(`user:${user_id}`).emit('notification:received', {
    type: type || 'info',
    message,
    timestamp: new Date(),
  });
  
  console.log(`📢 Notification envoyée à l'utilisateur ${user_id}`);
  
  res.json({ success: true, message: 'Notification envoyée' });
});

module.exports = router;