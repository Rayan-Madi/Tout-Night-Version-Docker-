from .client import send_notification


class NotificationService:
    """Service pour gérer les notifications"""
    
    @staticmethod
    def send(user_id, message, notification_type='info'):
        """Envoie une notification simple"""
        return send_notification(user_id, message, notification_type)
    
    @staticmethod
    def notify_welcome(user):
        """Notification de bienvenue"""
        message = f"Bienvenue sur Event Platform, {user.first_name or user.username} !"
        send_notification(user.id, message, 'success')
    
    @staticmethod
    def notify_ticket_confirmed(user, event):
        """Notification de confirmation de billet"""
        message = f"Votre billet pour '{event.title}' a été confirmé !"
        send_notification(user.id, message, 'success')
    
    @staticmethod
    def notify_ticket_cancelled(user, event):
        """Notification d'annulation de billet"""
        message = f"Votre billet pour '{event.title}' a été annulé."
        send_notification(user.id, message, 'info')
    
    @staticmethod
    def notify_event_reminder(user, event):
        """Rappel d'événement"""
        message = f"Rappel : '{event.title}' commence bientôt !"
        send_notification(user.id, message, 'warning')