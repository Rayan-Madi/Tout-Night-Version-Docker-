from django.db import models
from django.conf import settings

class Event(models.Model):
    """Modèle pour les événements"""
    
    CATEGORY_CHOICES = [
        ('conference', 'Conférence'),
        ('concert', 'Concert'),
        ('sport', 'Sport'),
        ('workshop', 'Atelier'),
        ('festival', 'Festival'),
        ('other', 'Autre'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('published', 'Publié'),
        ('cancelled', 'Annulé'),
        ('completed', 'Terminé'),
    ]
    
    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(verbose_name="Description")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='organized_events'
    )
    
    # Dates et lieu
    start_date = models.DateTimeField(verbose_name="Date de début")
    end_date = models.DateTimeField(verbose_name="Date de fin")
    location = models.CharField(max_length=300, verbose_name="Lieu")
    address = models.TextField(verbose_name="Adresse complète")
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='France')
    
    # Capacité et prix
    capacity = models.PositiveIntegerField(verbose_name="Capacité totale")
    available_seats = models.PositiveIntegerField(verbose_name="Places disponibles")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Prix")
    
    # Images
    cover_image = models.ImageField(upload_to='events/covers/', blank=True, null=True)
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Événement"
        verbose_name_plural = "Événements"
        ordering = ['-start_date']
    
    def __str__(self):
        return self.title
    
    @property
    def is_full(self):
        """Vérifie si l'événement est complet"""
        return self.available_seats <= 0
    
    @property
    def seats_sold(self):
        """Nombre de places vendues"""
        return self.capacity - self.available_seats