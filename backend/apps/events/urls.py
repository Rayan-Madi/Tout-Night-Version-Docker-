from django.urls import path
from . import views

urlpatterns = [
    path('', views.EventListCreateView.as_view(), name='event-list-create'),
    path('my-events/', views.MyEventsView.as_view(), name='my-events'),
    path('<slug:slug>/', views.EventDetailView.as_view(), name='event-detail'),
    path('<slug:slug>/status/', views.update_event_status, name='event-status'),
]