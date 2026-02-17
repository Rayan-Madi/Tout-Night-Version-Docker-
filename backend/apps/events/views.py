from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Event
from .serializers import (
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
        print(f"🔍 User connecté: {self.request.user}")
        print(f"🔍 User ID: {self.request.user.id}")
        print(f"🔍 User authenticated: {self.request.user.is_authenticated}")
        
        # Sauvegarder avec l'organisateur
        event = serializer.save(organizer=self.request.user)
        
        print(f"✅ Event créé avec organizer: {event.organizer}")
        print(f"✅ Event ID: {event.id}")


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détails, mise à jour et suppression d'un événement (par slug OU par ID)"""
    
    queryset = Event.objects.all()
    serializer_class = EventListSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsOrganizerOrReadOnly()]
        return [AllowAny()]
    
    def get_object(self):
        """
        Récupère l'événement par slug OU par ID
        """
        lookup_value = self.kwargs.get('slug')
        
        # Essayer d'abord par slug
        try:
            return Event.objects.get(slug=lookup_value)
        except Event.DoesNotExist:
            pass
        
        # Si ça échoue, essayer par ID
        try:
            event_id = int(lookup_value)
            return Event.objects.get(id=event_id)
        except (ValueError, Event.DoesNotExist):
            pass
        
        # Si aucun ne marche, lever une 404
        from rest_framework.exceptions import NotFound
        raise NotFound("Événement introuvable")


class MyEventsView(generics.ListAPIView):
    serializer_class = EventListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Debug: afficher l'utilisateur effectuant la requête
        try:
            user = self.request.user
            print(f"[MyEventsView] Utilisateur: {user} (id={getattr(user, 'id', None)})")
        except Exception:
            print("[MyEventsView] Impossible de récupérer request.user")

        return Event.objects.filter(organizer=self.request.user).order_by('-created_at')


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
        "event": EventListSerializer(event).data
    })