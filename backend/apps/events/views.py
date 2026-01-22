from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Event
from .serializers import (
    EventSerializer,
    EventCreateSerializer,
    EventListSerializer
)
from .permissions import IsOrganizerOrReadOnly


class EventListCreateView(generics.ListCreateAPIView):
    """Liste tous les événements et permet d'en créer"""
    
    queryset = Event.objects.filter(status='published')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'city', 'status']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['start_date', 'price', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EventCreateSerializer
        return EventListSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détails, mise à jour et suppression d'un événement"""
    
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsOrganizerOrReadOnly()]
        return [AllowAny()]


class MyEventsView(generics.ListAPIView):
    """Liste des événements créés par l'utilisateur connecté"""
    
    serializer_class = EventListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_event_status(request, slug):
    """Mettre à jour le statut d'un événement"""
    
    try:
        event = Event.objects.get(slug=slug, organizer=request.user)
    except Event.DoesNotExist:
        return Response({
            "error": "Événement introuvable ou vous n'êtes pas l'organisateur"
        }, status=status.HTTP_404_NOT_FOUND)
    
    new_status = request.data.get('status')
    
    if new_status not in dict(Event.STATUS_CHOICES):
        return Response({
            "error": "Statut invalide"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    event.status = new_status
    event.save()
    
    return Response({
        "message": "Statut mis à jour avec succès",
        "event": EventSerializer(event).data
    })