from rest_framework import serializers
from .models import Ticket
from apps.events.serializers import EventListSerializer
from apps.users.serializers import UserSerializer

class TicketSerializer(serializers.ModelSerializer):
    """Serializer complet pour les billets"""
    
    event = EventListSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'ticket_number', 'event', 'user', 'quantity',
            'total_price', 'status', 'qr_code', 'purchased_at',
            'updated_at', 'used_at'
        ]
        read_only_fields = [
            'id', 'ticket_number', 'purchased_at', 'updated_at'
        ]


class TicketCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer un billet"""
    
    event_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Ticket
        fields = ['event_id', 'quantity']
    
    def validate(self, attrs):
        from apps.events.models import Event
        
        try:
            event = Event.objects.get(id=attrs['event_id'])
        except Event.DoesNotExist:
            raise serializers.ValidationError({
                "event_id": "Événement introuvable."
            })
        
        # Vérifier la disponibilité
        if event.available_seats < attrs['quantity']:
            raise serializers.ValidationError({
                "quantity": f"Seulement {event.available_seats} places disponibles."
            })
        
        # Vérifier que l'événement est publié
        if event.status != 'published':
            raise serializers.ValidationError({
                "event_id": "Cet événement n'est pas disponible à la réservation."
            })
        
        return attrs
    
    def create(self, validated_data):
        from apps.events.models import Event
        
        event_id = validated_data.pop('event_id')
        event = Event.objects.get(id=event_id)
        
        # Calculer le prix total
        total_price = event.price * validated_data['quantity']
        
        # Créer le billet
        ticket = Ticket.objects.create(
            event=event,
            user=self.context['request'].user,
            quantity=validated_data['quantity'],
            total_price=total_price,
            status='confirmed'
        )
        
        # Mettre à jour les places disponibles
        event.available_seats -= validated_data['quantity']
        event.save()
        
        return ticket


class TicketListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des billets"""
    
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_date = serializers.DateTimeField(source='event.start_date', read_only=True)
    event_location = serializers.CharField(source='event.location', read_only=True)
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'ticket_number', 'event_title', 'event_date',
            'event_location', 'quantity', 'total_price', 'status',
            'purchased_at'
        ]