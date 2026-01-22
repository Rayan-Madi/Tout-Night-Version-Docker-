from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Modèle utilisateur personnalisé"""
    
    ROLE_CHOICES = [
        ('user', 'Utilisateur'),
        ('organizer', 'Organisateur'),
        ('admin', 'Administrateur'),
    ]
    
    email = models.EmailField(unique=True, verbose_name="Email")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    phone = models.CharField(max_length=15, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.username} ({self.email})"