from django.urls import path
from . import views

urlpatterns = [
    # Liste et création d'événements
    path('', views.EventListCreateView.as_view(), name='event-list-create'),
    
    # Mes événements
    path('my-events/', views.MyEventsView.as_view(), name='my-events'),
    
    # Détails d'un événement
    path('<slug:slug>/', views.EventDetailView.as_view(), name='event-detail'),
    
    # Mettre à jour le statut
    path('<slug:slug>/status/', views.update_event_status, name='event-status'),
]