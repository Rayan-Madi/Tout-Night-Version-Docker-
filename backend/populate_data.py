import os
import django
from datetime import datetime, timedelta
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.events.models import Event
from django.utils.text import slugify

User = get_user_model()

def create_users():
    """Créer des utilisateurs organisateurs"""
    users_data = [
        {
            'username': 'festival_org',
            'email': 'festival@example.com',
            'first_name': 'Festival',
            'last_name': 'Productions',
            'role': 'organizer',
            'password': 'password123'
        },
        {
            'username': 'concert_manager',
            'email': 'concerts@example.com',
            'first_name': 'Concert',
            'last_name': 'Manager',
            'role': 'organizer',
            'password': 'password123'
        },
        {
            'username': 'tech_events',
            'email': 'tech@example.com',
            'first_name': 'Tech',
            'last_name': 'Events',
            'role': 'organizer',
            'password': 'password123'
        },
        {
            'username': 'sport_org',
            'email': 'sport@example.com',
            'first_name': 'Sport',
            'last_name': 'Organizer',
            'role': 'organizer',
            'password': 'password123'
        },
    ]
    
    created_users = []
    for user_data in users_data:
        user, created = User.objects.get_or_create(
            username=user_data['username'],
            defaults=user_data
        )
        if created:
            user.set_password(user_data['password'])
            user.save()
            print(f"✅ Utilisateur créé: {user.username}")
        else:
            print(f"ℹ️  Utilisateur existant: {user.username}")
        created_users.append(user)
    
    return created_users


def create_events(users):
    """Créer des événements variés"""
    
    events_data = [
        # Concerts
        {
            'title': 'Nuit Électro Paris 2026',
            'description': 'Une soirée électro inoubliable avec les meilleurs DJs européens. Venez vibrer sur les meilleurs sons techno, house et trance dans une ambiance exceptionnelle.',
            'category': 'concert',
            'organizer': users[1],
            'start_date': datetime.now() + timedelta(days=30),
            'end_date': datetime.now() + timedelta(days=30, hours=8),
            'location': 'Zenith Paris',
            'address': '211 Avenue Jean Jaurès, 75019 Paris',
            'city': 'Paris',
            'capacity': 5000,
            'price': Decimal('45.00'),
        },
        {
            'title': 'Rock Legends Festival',
            'description': 'Les plus grandes légendes du rock réunies pour une soirée mémorable.',
            'category': 'concert',
            'organizer': users[1],
            'start_date': datetime.now() + timedelta(days=45),
            'end_date': datetime.now() + timedelta(days=45, hours=6),
            'location': 'Stade de France',
            'address': 'Saint-Denis',
            'city': 'Paris',
            'capacity': 80000,
            'price': Decimal('89.00'),
        },
        {
            'title': 'Jazz à Montmartre',
            'description': 'Soirée jazz intimiste dans le quartier bohème de Paris.',
            'category': 'concert',
            'organizer': users[1],
            'start_date': datetime.now() + timedelta(days=15),
            'end_date': datetime.now() + timedelta(days=15, hours=4),
            'location': 'Le Bouquet du Nord',
            'address': 'Montmartre, Paris',
            'city': 'Paris',
            'capacity': 200,
            'price': Decimal('25.00'),
        },
        
        # Conférences
        {
            'title': 'Tech Summit 2026',
            'description': 'La plus grande conférence tech de l\'année. IA, blockchain, Web3 et bien plus encore.',
            'category': 'conference',
            'organizer': users[2],
            'start_date': datetime.now() + timedelta(days=60),
            'end_date': datetime.now() + timedelta(days=62),
            'location': 'Palais des Congrès',
            'address': '2 Place de la Porte Maillot, 75017 Paris',
            'city': 'Paris',
            'capacity': 2000,
            'price': Decimal('150.00'),
        },
        {
            'title': 'Startup Weekend Paris',
            'description': '54 heures pour créer votre startup. Pitch, networking et mentoring.',
            'category': 'conference',
            'organizer': users[2],
            'start_date': datetime.now() + timedelta(days=25),
            'end_date': datetime.now() + timedelta(days=27),
            'location': 'Station F',
            'address': '5 Parvis Alan Turing, 75013 Paris',
            'city': 'Paris',
            'capacity': 500,
            'price': Decimal('49.00'),
        },
        
        # Festivals
        {
            'title': 'Summer Beats Festival',
            'description': '3 jours de musique en plein air avec plus de 50 artistes internationaux.',
            'category': 'festival',
            'organizer': users[0],
            'start_date': datetime.now() + timedelta(days=90),
            'end_date': datetime.now() + timedelta(days=93),
            'location': 'Parc de la Villette',
            'address': '211 Avenue Jean Jaurès, 75019 Paris',
            'city': 'Paris',
            'capacity': 15000,
            'price': Decimal('120.00'),
        },
        {
            'title': 'Gastronomie & Vins',
            'description': 'Festival culinaire avec les plus grands chefs étoilés.',
            'category': 'festival',
            'organizer': users[0],
            'start_date': datetime.now() + timedelta(days=50),
            'end_date': datetime.now() + timedelta(days=52),
            'location': 'Grand Palais Éphémère',
            'address': 'Champ de Mars, Paris',
            'city': 'Paris',
            'capacity': 3000,
            'price': Decimal('75.00'),
        },
        
        # Sport
        {
            'title': 'Marathon de Paris 2026',
            'description': 'Courez les 42km à travers les plus beaux monuments de Paris.',
            'category': 'sport',
            'organizer': users[3],
            'start_date': datetime.now() + timedelta(days=70),
            'end_date': datetime.now() + timedelta(days=70, hours=6),
            'location': 'Champs-Élysées',
            'address': 'Départ: Avenue des Champs-Élysées',
            'city': 'Paris',
            'capacity': 50000,
            'price': Decimal('35.00'),
        },
        {
            'title': 'Tournoi de Tennis Open',
            'description': 'Tournoi international de tennis avec les meilleurs joueurs mondiaux.',
            'category': 'sport',
            'organizer': users[3],
            'start_date': datetime.now() + timedelta(days=40),
            'end_date': datetime.now() + timedelta(days=47),
            'location': 'Roland-Garros',
            'address': '2 Avenue Gordon Bennett, 75016 Paris',
            'city': 'Paris',
            'capacity': 15000,
            'price': Decimal('65.00'),
        },
        
        # Ateliers
        {
            'title': 'Atelier Photographie Urbaine',
            'description': 'Apprenez les techniques de photographie de rue avec un pro.',
            'category': 'workshop',
            'organizer': users[2],
            'start_date': datetime.now() + timedelta(days=20),
            'end_date': datetime.now() + timedelta(days=20, hours=4),
            'location': 'Quartier du Marais',
            'address': 'Point de rendez-vous: Place des Vosges',
            'city': 'Paris',
            'capacity': 15,
            'price': Decimal('80.00'),
        },
        {
            'title': 'Workshop Développement Web',
            'description': 'De zéro à héros en React.js en un weekend.',
            'category': 'workshop',
            'organizer': users[2],
            'start_date': datetime.now() + timedelta(days=35),
            'end_date': datetime.now() + timedelta(days=37),
            'location': 'Le Wagon Paris',
            'address': '16 Villa Gaudelet, 75011 Paris',
            'city': 'Paris',
            'capacity': 25,
            'price': Decimal('199.00'),
        },
        
        # Événements de Lyon
        {
            'title': 'Fête des Lumières Lyon',
            'description': 'Le plus grand festival de lumières en Europe.',
            'category': 'festival',
            'organizer': users[0],
            'start_date': datetime.now() + timedelta(days=100),
            'end_date': datetime.now() + timedelta(days=104),
            'location': 'Centre-ville de Lyon',
            'address': 'Place Bellecour',
            'city': 'Lyon',
            'capacity': 100000,
            'price': Decimal('0.00'),
        },
        
        # Événements de Marseille
        {
            'title': 'Marseille Electronic Festival',
            'description': 'Festival de musique électronique sur le Vieux-Port.',
            'category': 'concert',
            'organizer': users[1],
            'start_date': datetime.now() + timedelta(days=80),
            'end_date': datetime.now() + timedelta(days=82),
            'location': 'Vieux-Port',
            'address': 'Quai du Port, Marseille',
            'city': 'Marseille',
            'capacity': 20000,
            'price': Decimal('55.00'),
        },
    ]
    
    created_events = []
    for event_data in events_data:
        # Générer le slug
        event_data['slug'] = slugify(event_data['title'])
        
        # Calculer available_seats
        event_data['available_seats'] = event_data['capacity'] - int(event_data['capacity'] * 0.15)
        
        event, created = Event.objects.get_or_create(
            slug=event_data['slug'],
            defaults=event_data
        )
        
        if created:
            # Publier l'événement
            event.status = 'published'
            event.save()
            print(f"✅ Événement créé: {event.title}")
        else:
            print(f"ℹ️  Événement existant: {event.title}")
        
        created_events.append(event)
    
    return created_events


def main():
    print("🚀 Génération des données de test...")
    print("-" * 50)
    
    # Créer les utilisateurs
    print("\n👥 Création des utilisateurs...")
    users = create_users()
    
    # Créer les événements
    print("\n🎉 Création des événements...")
    events = create_events(users)
    
    print("-" * 50)
    print(f"✅ {len(users)} utilisateurs créés")
    print(f"✅ {len(events)} événements créés")
    print("\n🎉 Données de test générées avec succès!")
    print("\n📝 Vous pouvez maintenant:")
    print("   - Accéder à l'admin: http://localhost:8000/admin")
    print("   - Voir les événements: http://localhost:5173/events")


if __name__ == '__main__':
    main()