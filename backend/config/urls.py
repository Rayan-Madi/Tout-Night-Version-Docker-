from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def api_root(request):
    """Vue racine de l'API qui liste les endpoints disponibles"""
    return JsonResponse({
        'message': 'Bienvenue sur l\'API',
        'endpoints': {
            'admin': '/admin/',
            'authentication': {
                'obtain_token': '/api/token/',
                'refresh_token': '/api/token/refresh/',
            },
            'resources': {
                'users': '/api/users/',
                'events': '/api/events/',
                'tickets': '/api/tickets/',
            }
        }
    })

urlpatterns = [
    # Page d'accueil de l'API
    path('', api_root, name='api-root'),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API endpoints
    path('api/users/', include('apps.users.urls')),
    path('api/events/', include('apps.events.urls')),
    path('api/tickets/', include('apps.tickets.urls')),
]

# Servir les fichiers media en développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)