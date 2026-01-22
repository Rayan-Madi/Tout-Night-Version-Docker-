from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from .serializers import (
    TicketSerializer,
    TicketCreateSerializer,
    TicketListSerializer
)


class TicketListCreateView(generics.ListCreateAPIView):
    """Liste des billets de l'utilisateur et achat de nouveaux billets"""
    
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TicketCreateSerializer
        return TicketListSerializer
    
    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user).order_by('-purchased_at')
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticket = serializer.save()
        
        # TODO: Envoyer une notification via Node.js
        # TODO: Générer le QR code
        
        return Response({
            "message": "Billet acheté avec succès",
            "ticket": TicketSerializer(ticket).data
        }, status=status.HTTP_201_CREATED)


class TicketDetailView(generics.RetrieveAPIView):
    """Détails d'un billet"""
    
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'ticket_number'
    
    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_ticket(request, ticket_number):
    """Annuler un billet"""
    
    try:
        ticket = Ticket.objects.get(
            ticket_number=ticket_number,
            user=request.user
        )
    except Ticket.DoesNotExist:
        return Response({
            "error": "Billet introuvable"
        }, status=status.HTTP_404_NOT_FOUND)
    
    if ticket.status == 'cancelled':
        return Response({
            "error": "Ce billet est déjà annulé"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if ticket.status == 'used':
        return Response({
            "error": "Ce billet a déjà été utilisé"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Annuler le billet
    ticket.status = 'cancelled'
    ticket.save()
    
    # Remettre les places disponibles
    event = ticket.event
    event.available_seats += ticket.quantity
    event.save()
    
    return Response({
        "message": "Billet annulé avec succès",
        "ticket": TicketSerializer(ticket).data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def event_tickets(request, event_id):
    """Liste des billets pour un événement spécifique (pour l'organisateur)"""
    
    from apps.events.models import Event
    
    try:
        event = Event.objects.get(id=event_id, organizer=request.user)
    except Event.DoesNotExist:
        return Response({
            "error": "Événement introuvable ou vous n'êtes pas l'organisateur"
        }, status=status.HTTP_404_NOT_FOUND)
    
    tickets = Ticket.objects.filter(event=event).exclude(status='cancelled')
    serializer = TicketSerializer(tickets, many=True)
    
    return Response({
        "event": event.title,
        "total_tickets": tickets.count(),
        "tickets": serializer.data
    })