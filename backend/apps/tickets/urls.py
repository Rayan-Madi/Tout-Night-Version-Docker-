from django.urls import path
from . import views

urlpatterns = [
    # Liste des billets et achat
    path('', views.TicketListCreateView.as_view(), name='ticket-list-create'),
    
    # Détails d'un billet
    path('<uuid:ticket_number>/', views.TicketDetailView.as_view(), name='ticket-detail'),
    
    # Annuler un billet
    path('<uuid:ticket_number>/cancel/', views.cancel_ticket, name='ticket-cancel'),
    
    # Billets d'un événement (pour l'organisateur)
    path('event/<int:event_id>/', views.event_tickets, name='event-tickets'),
]