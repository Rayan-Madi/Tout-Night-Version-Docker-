# db_patch.py
from django.db.backends.mysql import base

# Désactiver la vérification de version
original_check = base.DatabaseWrapper.check_database_version_supported

def patched_check(self):
    pass  # Ne rien faire, ignorer la vérification

base.DatabaseWrapper.check_database_version_supported = patched_check