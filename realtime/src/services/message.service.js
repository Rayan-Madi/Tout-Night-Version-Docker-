const pool = require('../config/db');

class MessageService {
  /**
   * Sauvegarder un message dans la base de données
   */
  static async saveMessage(eventId, userId, username, message) {
    try {
      const query = `
        INSERT INTO chat_messages (event_id, user_id, username, message, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `;
      
      const [result] = await pool.execute(query, [eventId, userId, username, message]);
      
      return {
        id: result.insertId,
        eventId,
        userId,
        username,
        message,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Erreur sauvegarde message:', error);
      throw error;
    }
  }

  /**
   * Récupérer l'historique des messages d'un événement
   */
  static async getEventMessages(eventId, limit = 50) {
    try {
      const query = `
        SELECT id, event_id, user_id, username, message, created_at
        FROM chat_messages
        WHERE event_id = ?
        ORDER BY created_at DESC
        LIMIT ?
      `;
      
      const [rows] = await pool.execute(query, [eventId, limit]);
      
      return rows.reverse(); // Ordre chronologique
    } catch (error) {
      console.error('Erreur récupération messages:', error);
      return [];
    }
  }

  /**
   * Supprimer les anciens messages (nettoyage)
   */
  static async cleanOldMessages(daysOld = 30) {
    try {
      const query = `
        DELETE FROM chat_messages
        WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
      `;
      
      const [result] = await pool.execute(query, [daysOld]);
      
      console.log(`${result.affectedRows} anciens messages supprimés`);
      return result.affectedRows;
    } catch (error) {
      console.error('Erreur nettoyage messages:', error);
      throw error;
    }
  }
}

module.exports = MessageService;