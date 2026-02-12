const db = require('../config/db');

class MessageService {
  /**
   * Récupérer les messages d'un événement
   */
  async getEventMessages(eventId, limit = 50) {
    try {
      // ✅ Convertir en nombre et inverser l'ordre des paramètres
      const numericEventId = parseInt(eventId, 10);
      const numericLimit = parseInt(limit, 10);
      
      console.log(`📥 Récupération messages: event=${numericEventId}, limit=${numericLimit}`);
      
      const [rows] = await db.execute(
        `SELECT id, event_id, user_id, username, message, created_at
         FROM chat_messages
         WHERE event_id = ?
         ORDER BY created_at ASC
         LIMIT ?`,
        [numericEventId, numericLimit]  // ✅ Ordre correct
      );
      
      console.log(`✅ ${rows.length} messages récupérés`);
      return rows;
    } catch (error) {
      console.error('Erreur getEventMessages:', error);
      return []; // ✅ Retourner tableau vide en cas d'erreur
    }
  }

  /**
   * Créer un nouveau message
   */
  async createMessage(eventId, userId, username, message) {
    try {
      const numericEventId = parseInt(eventId, 10);
      const numericUserId = userId ? parseInt(userId, 10) : null;
      
      console.log(`💾 Sauvegarde message: event=${numericEventId}, user=${numericUserId}, username=${username}`);
      
      const [result] = await db.execute(
        `INSERT INTO chat_messages (event_id, user_id, username, message, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [numericEventId, numericUserId, username, message]
      );

      console.log(`✅ Message créé avec l'ID ${result.insertId}`);

      // Retourner le message créé avec timestamp
      return {
        id: result.insertId,
        event_id: numericEventId,
        user_id: numericUserId,
        username: username,
        message: message,
        created_at: new Date()
      };
    } catch (error) {
      console.error('Erreur createMessage:', error);
      throw error;
    }
  }

  /**
   * Supprimer un message
   */
  async deleteMessage(messageId, userId) {
    try {
      const numericMessageId = parseInt(messageId, 10);
      const numericUserId = parseInt(userId, 10);
      
      const [result] = await db.execute(
        'DELETE FROM chat_messages WHERE id = ? AND user_id = ?',
        [numericMessageId, numericUserId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur deleteMessage:', error);
      return false;
    }
  }
}

module.exports = new MessageService();