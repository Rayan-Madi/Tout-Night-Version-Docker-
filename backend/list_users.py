import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("\n" + "="*60)
print("📋 LISTE DES UTILISATEURS")
print("="*60 + "\n")

# Tous les utilisateurs
all_users = User.objects.all()
print(f"Total utilisateurs : {all_users.count()}\n")

for user in all_users:
    status = "🔑 SUPERADMIN" if user.is_superuser else "👤 Utilisateur"
    print(f"{status} | {user.username} | {user.email} | Role: {user.role}")

# Statistiques
superusers_count = User.objects.filter(is_superuser=True).count()
organizers_count = User.objects.filter(role='organizer').count()
users_count = User.objects.filter(role='user').count()

print("\n" + "="*60)
print("📊 STATISTIQUES")
print("="*60)
print(f"Superadmins : {superusers_count}")
print(f"Organisateurs : {organizers_count}")
print(f"Utilisateurs : {users_count}")
print("="*60 + "\n")