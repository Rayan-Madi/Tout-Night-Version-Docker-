from django.db import models
from django.conf import settings
import uuid

class Ticket(models.Model):
    """Modèle pour les billets"""
    
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmé'),
        ('cancelled', 'Annulé'),
        ('used', 'Utilisé'),
    ]
    
    # Identifiant unique
    ticket_number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    # Relations
    event = models.ForeignKey(
        'events.Event',
        on_delete=models.CASCADE,
        related_name='tickets'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tickets'
    )
    
    # Informations du billet
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # QR Code pour validation
    qr_code = models.ImageField(upload_to='tickets/qr/', blank=True, null=True)
    
    # Métadonnées
    purchased_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    used_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        verbose_name = "Billet"
        verbose_name_plural = "Billets"
        ordering = ['-purchased_at']
    
    def __str__(self):
        return f"Billet #{self.ticket_number} - {self.event.title}"