from django.urls import path
from . import views

urlpatterns = [
    # Inscription
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    
    # Profil utilisateur
    path('me/', views.current_user, name='current-user'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    
    # Changer le mot de passe
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
]