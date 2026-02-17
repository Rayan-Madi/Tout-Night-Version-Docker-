from rest_framework import serializers
from .models import Event
from apps.users.serializers import UserSerializer
from django.utils.text import slugify

class EventCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer un événement"""
    
    class Meta:
        model = Event
        fields = [
            'id',
            'slug',
            'title', 'description', 'category', 'start_date', 'end_date',
            'location', 'address', 'city', 'country', 'capacity', 'price',
            'cover_image'
        ]
        read_only_fields = ['id', 'slug']
    
    def validate(self, attrs):
        if attrs['end_date'] <= attrs['start_date']:
            raise serializers.ValidationError({
                "end_date": "La date de fin doit être après la date de début."
            })
        return attrs

    def create(self, validated_data):
        from django.utils.text import slugify
        from django.db import IntegrityError
        
        # Générer le slug de base
        base_slug = slugify(validated_data.get('title', ''))
        slug = base_slug
        
        # ✅ RENDRE LE SLUG UNIQUE en ajoutant un numéro si nécessaire
        counter = 1
        while Event.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        validated_data['slug'] = slug
        
        # Initialiser available_seats
        if 'capacity' in validated_data and validated_data.get('capacity') is not None:
            validated_data['available_seats'] = validated_data['capacity']
        
        # Status par défaut = published
        if 'status' not in validated_data:
            validated_data['status'] = 'published'
        
        return super().create(validated_data)


class EventListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des événements"""
    
    organizer_name = serializers.CharField(source='organizer.username', read_only=True)
    organizer_id = serializers.IntegerField(source='organizer.id', read_only=True)
    seats_sold = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'category', 'status', 'organizer_name',
            'organizer_id',
            'start_date', 'location', 'city', 'price', 'capacity',
            'available_seats', 'cover_image', 'seats_sold', 'is_full'
        ]