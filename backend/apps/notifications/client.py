import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_notification(user_id, message, notification_type='info'):
    """
    Envoie une notification en temps réel via le serveur Node.js
    
    Args:
        user_id (int): ID de l'utilisateur destinataire
        message (str): Message de la notification
        notification_type (str): Type de notification (info, success, warning, error)
    
    Returns:
        dict: Réponse du serveur Node.js ou None en cas d'erreur
    """
    url = f"{settings.REALTIME_SERVICE_URL}/api/notify"
    
    payload = {
        'user_id': user_id,
        'message': message,
        'type': notification_type,
    }
    
    try:
        response = requests.post(url, json=payload, timeout=5)
        response.raise_for_status()
        logger.info(f"Notification envoyée à l'utilisateur {user_id}")
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Erreur lors de l'envoi de la notification: {e}")
        return None


def notify_ticket_purchase(user, event, ticket):
    """
    Notifie l'utilisateur après l'achat d'un billet
    """
    message = f"Votre billet pour '{event.title}' a été confirmé !"
    send_notification(user.id, message, 'success')


def notify_event_update(event, message):
    """
    Notifie tous les participants d'un événement
    """
    from apps.tickets.models import Ticket
    
    # Récupérer tous les utilisateurs ayant un billet pour cet événement
    tickets = Ticket.objects.filter(
        event=event,
        status='confirmed'
    ).select_related('user')
    
    user_ids = set(ticket.user.id for ticket in tickets)
    
    for user_id in user_ids:
        send_notification(user_id, message, 'info')


def notify_event_cancellation(event):
    """
    Notifie tous les participants de l'annulation d'un événement
    """
    message = f"L'événement '{event.title}' a été annulé. Vous serez remboursé."
    notify_event_update(event, message)