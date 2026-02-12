import os
import django
import sys
from pathlib import Path

# Configuration Django
sys.path.append(str(Path(__file__).resolve().parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.events.models import Event
from apps.users.models import User
from django.utils import timezone
from datetime import timedelta

def create_events():
    """Créer des événements factices"""
    
    # Vérifier si l'utilisateur admin existe
    try:
        organizer = User.objects.get(username='admin')
    except User.DoesNotExist:
        print("❌ L'utilisateur 'admin' n'existe pas. Créez-le d'abord avec createsuperuser")
        return
    
    # Liste d'événements factices
    events_data = [
        {
            'title': '🎸 Festival Rock en Seine 2026',
            'description': 'Le plus grand festival de rock de France ! 3 jours de concerts non-stop avec les plus grandes stars internationales.',
            'category': 'concert',
            'location': 'Domaine National',
            'address': '1 Route de Sèvres',
            'city': 'Saint-Cloud',
            'country': 'France',
            'start_date': timezone.now() + timedelta(days=45),
            'end_date': timezone.now() + timedelta(days=47),
            'price': 89.00,
            'capacity': 5000,
            'available_seats': 5000,
            'organizer': organizer,
            'status': 'published'
        },
        {
            'title': '🎭 Soirée Théâtre - Molière Revisité',
            'description': 'Une mise en scène moderne et audacieuse des classiques de Molière. Rires garantis !',
            'category': 'theatre',
            'location': 'Théâtre des Célestins',
            'address': '4 Rue Charles Dullin',
            'city': 'Lyon',
            'country': 'France',
            'start_date': timezone.now() + timedelta(days=15),
            'end_date': timezone.now() + timedelta(days=15),
            'price': 35.00,
            'capacity': 300,
            'available_seats': 300,
            'organizer': organizer,
            'status': 'published'
        },
        {
            'title': '🎨 Exposition Art Contemporain',
            'description': 'Découvrez les œuvres des artistes émergents de la scène contemporaine française.',
            'category': 'exposition',
            'location': 'MuCEM',
            'address': '7 Promenade Robert Laffont',
            'city': 'Marseille',
            'country': 'France',
            'start_date': timezone.now() + timedelta(days=7),
            'end_date': timezone.now() + timedelta(days=37),
            'price': 12.00,
            'capacity': 200,
            'available_seats': 150,
            'organizer': organizer,
            'status': 'published'
        },
        {
            'title': '🎵 Concert Jazz sous les Étoiles',
            'description': 'Une soirée magique avec les meilleurs musiciens de jazz français dans un cadre exceptionnel.',
            'category': 'concert',
            'location': 'Jardin Albert 1er',
            'address': '2 Avenue de Verdun',
            'city': 'Nice',
            'country': 'France',
            'start_date': timezone.now() + timedelta(days=30),
            'end_date': timezone.now() + timedelta(days=30),
            'price': 45.00,
            'capacity': 800,
            'available_seats': 650,
            'organizer': organizer,
            'status': 'published'
        },
        {
            'title': '🎪 Cirque du Soleil - Nouvelle Création',
            'description': 'Le célèbre Cirque du Soleil présente son dernier spectacle : un voyage onirique.',
            'category': 'spectacle',
            'location': 'Parc des Expositions',
            'address': 'Cours Charles Bricaud',
            'city': 'Bordeaux',
            'country': 'France',
            'start_date': timezone.now() + timedelta(days=60),
            'end_date': timezone.now() + timedelta(days=90),
            'price': 125.00,
            'capacity': 2500,
            'available_seats': 2500,
            'organizer': organizer,
            'status': 'published'
        },
        {
            'title': '📚 Salon du Livre de Paris 2026',
            'description': 'Rencontrez vos auteurs préférés, assistez à des conférences.',
            'category': 'salon',
            'location': 'Porte de Versailles',
            'address': '1 Place de la Porte de Versailles',
            'city': 'Paris',
            'country': 'France',
            'start_date': timezone.now() + timedelta(days=20),
            'end_date': timezone.now() + timedelta(days=23),
            'price': 8.00,
            'capacity': 10000,
            'available_seats': 8500,
            'organizer': organizer,
            'status': 'published'
        },
        {
            'title': '🏃 Marathon de Paris 2026',
            'description': 'Participez au plus grand marathon de France ! 42km à travers les monuments parisiens.',
            'category': 'sport',
            'location': 'Champs-Élysées',
            'address': 'Avenue des Champs-Élysées',
            'city': 'Paris',
            'country': 'France',
            'start_date': timezone.now() + timedelta(days=90),
            'end_date': timezone.now() + timedelta(days=90),
            'price': 75.00,
            'capacity': 50000,
            'available_seats': 35000,
            'organizer': organizer,
            'status': 'published'
        },
        {
            'title': '🍷 Dégustation Vins et Fromages',
            'description': 'Découvrez les meilleurs vins et fromages de nos régions.',
            'category': 'gastronomie',
            'location': 'Caves de la Cloche',
            'address': '14 Place de la Libération',
            'city': 'Dijon',
            'country': 'France',
            'start_date': timezone.now() + timedelta(days=12),
            'end_date': timezone.now() + timedelta(days=12),
            'price': 28.00,
            'capacity': 50,
            'available_seats': 15,
            'organizer': organizer,
            'status': 'published'
        },
        {
            'title': '🎬 Avant-Première Cinéma',
            'description': 'Soyez parmi les premiers à découvrir le nouveau film en présence du réalisateur.',
            'category': 'cinema',
            'location': 'Palais des Festivals',
            'address': '1 Boulevard de la Croisette',
            'city': 'Cannes',
            'country': 'France',
            'start_date': timezone.now() + timedelta(days=5),
            'end_date': timezone.now() + timedelta(days=5),
            'price': 65.00,
            'capacity': 1200,
            'available_seats': 1200,
            'organizer': organizer,
            'status': 'published'
        },
        {
            'title': '🎤 Stand-Up Comedy Night',
            'description': 'Une soirée hilarante avec les meilleurs humoristes du moment.',
            'category': 'humour',
            'location': 'Zénith',
            'address': '11 Avenue Raymond Badiou',
            'city': 'Toulouse',
            'country': 'France',
            'start_date': timezone.now() + timedelta(days=25),
            'end_date': timezone.now() + timedelta(days=25),
            'price': 38.00,
            'capacity': 4000,
            'available_seats': 2800,
            'organizer': organizer,
            'status': 'published'
        },
    ]
    
    # Créer les événements
    created_count = 0
    for event_data in events_data:
        # Vérifier si l'événement existe déjà (par titre)
        if not Event.objects.filter(title=event_data['title']).exists():
            Event.objects.create(**event_data)
            created_count += 1
            print(f"✅ Créé: {event_data['title']}")
        else:
            print(f"⏭️  Existe déjà: {event_data['title']}")
    
    print(f"\n🎉 {created_count} événements créés avec succès !")
    print(f"📊 Total d'événements dans la base: {Event.objects.count()}")

if __name__ == '__main__':
    print("🚀 Génération d'événements factices...\n")
    create_events()