from rest_framework import permissions


class IsOrganizerOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée : seul l'organisateur peut modifier/supprimer
    """
    
    def has_object_permission(self, request, view, obj):
        # Lecture autorisée pour tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Écriture uniquement pour l'organisateur
        return obj.organizer == request.user