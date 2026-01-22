from rest_framework import serializers
from .models import Event
from apps.users.serializers import UserSerializer
from django.utils.text import slugify

class EventSerializer(serializers.ModelSerializer):
    """Serializer pour les événements"""
    
    organizer = UserSerializer(read_only=True)
    seats_sold = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'description', 'category', 'status',
            'organizer', 'start_date', 'end_date', 'location', 'address',
            'city', 'country', 'capacity', 'available_seats', 'price',
            'cover_image', 'created_at', 'updated_at', 'seats_sold', 'is_full'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'available_seats']
    
    def create(self, validated_data):
        # Générer le slug automatiquement
        validated_data['slug'] = slugify(validated_data['title'])
        
        # available_seats = capacity au début
        validated_data['available_seats'] = validated_data['capacity']
        
        return super().create(validated_data)


class EventCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer un événement"""
    
    class Meta:
        model = Event
        fields = [
            'title', 'description', 'category', 'start_date', 'end_date',
            'location', 'address', 'city', 'country', 'capacity', 'price',
            'cover_image'
        ]
    
    def validate(self, attrs):
        # Vérifier que la date de fin est après la date de début
        if attrs['end_date'] <= attrs['start_date']:
            raise serializers.ValidationError({
                "end_date": "La date de fin doit être après la date de début."
            })
        return attrs


class EventListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des événements"""
    
    organizer_name = serializers.CharField(source='organizer.username', read_only=True)
    seats_sold = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'category', 'status', 'organizer_name',
            'start_date', 'location', 'city', 'price', 'capacity',
            'available_seats', 'cover_image', 'seats_sold', 'is_full'
        ]