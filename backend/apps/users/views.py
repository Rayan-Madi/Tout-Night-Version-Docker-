from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    UserUpdateSerializer,
    ChangePasswordSerializer
)

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    """Inscription d'un nouvel utilisateur"""
    
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            "message": "Utilisateur créé avec succès",
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Récupérer et mettre à jour le profil de l'utilisateur connecté"""
    
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        serializer = UserUpdateSerializer(
            self.request.user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            "message": "Profil mis à jour avec succès",
            "user": UserSerializer(self.request.user).data
        })


class ChangePasswordView(generics.UpdateAPIView):
    """Changer le mot de passe"""
    
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)
        
        # Vérifier l'ancien mot de passe
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({
                "error": "Ancien mot de passe incorrect"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Définir le nouveau mot de passe
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            "message": "Mot de passe changé avec succès"
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Récupérer l'utilisateur actuellement connecté"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)