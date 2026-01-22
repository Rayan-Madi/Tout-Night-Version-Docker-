const pool = require('../config/db');

class NotificationService {
  /**
   * Sauvegarder une notification dans la base de données
   */
  static async saveNotification(userId, message, type = 'info') {
    try {
      const query = `
        INSERT INTO notifications (user_id, message, type, is_read, created_at)
        VALUES (?, ?, ?, false, NOW())
      `;
      
      const [result] = await pool.execute(query, [userId, message, type]);
      
      return {
        id: result.insertId,
        userId,
        message,
        type,
        isRead: false,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Erreur sauvegarde notification:', error);
      throw error;
    }
  }

  /**
   * Récupérer les notifications d'un utilisateur
   */
  static async getUserNotifications(userId, limit = 20) {
    try {
      const query = `
        SELECT id, user_id, message, type, is_read, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
      `;
      
      const [rows] = await pool.execute(query, [userId, limit]);
      
      return rows;
    } catch (error) {
      console.error('Erreur récupération notifications:', error);
      return [];
    }
  }

  /**
   * Marquer une notification comme lue
   */
  static async markAsRead(notificationId, userId) {
    try {
      const query = `
        UPDATE notifications
        SET is_read = true
        WHERE id = ? AND user_id = ?
      `;
      
      const [result] = await pool.execute(query, [notificationId, userId]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur marquage notification:', error);
      return false;
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  static async markAllAsRead(userId) {
    try {
      const query = `
        UPDATE notifications
        SET is_read = true
        WHERE user_id = ? AND is_read = false
      `;
      
      const [result] = await pool.execute(query, [userId]);
      
      return result.affectedRows;
    } catch (error) {
      console.error('Erreur marquage toutes notifications:', error);
      return 0;
    }
  }
}

module.exports = NotificationService;