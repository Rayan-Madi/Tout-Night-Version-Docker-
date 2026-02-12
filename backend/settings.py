


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME', 'tout_night_db'),  # CORRIGÉ: tout_night_db au lieu de toutnight_db
        'USER': os.getenv('DB_USER', 'root'),  # CORRIGÉ: 'root' pour XAMPP
        'PASSWORD': os.getenv('DB_PASSWORD', ''),  # CORRIGÉ: vide pour XAMPP
        'HOST': os.getenv('DB_HOST', '127.0.0.1'),  # CORRIGÉ: 127.0.0.1 au lieu de 'mysql'
        'PORT': os.getenv('DB_PORT', '3306'),
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}