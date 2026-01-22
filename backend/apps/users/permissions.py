from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée : seul le propriétaire peut modifier son profil
    """
    
    def has_object_permission(self, request, view, obj):
        # Lecture autorisée pour tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Écriture uniquement pour le propriétaire
        return obj == request.user