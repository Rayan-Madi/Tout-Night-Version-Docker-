from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'category', 'status', 'organizer',
        'start_date', 'city', 'price', 'seats_sold', 'created_at'
    ]
    list_filter = ['category', 'status', 'city', 'created_at']
    search_fields = ['title', 'description', 'location', 'organizer__username']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'start_date'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('title', 'slug', 'description', 'category', 'status', 'organizer')
        }),
        ('Date et lieu', {
            'fields': ('start_date', 'end_date', 'location', 'address', 'city', 'country')
        }),
        ('Capacité et tarification', {
            'fields': ('capacity', 'available_seats', 'price')
        }),
        ('Médias', {
            'fields': ('cover_image',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']