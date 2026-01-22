from django.contrib import admin
from .models import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = [
        'ticket_number', 'event', 'user', 'quantity',
        'total_price', 'status', 'purchased_at'
    ]
    list_filter = ['status', 'purchased_at', 'event__category']
    search_fields = [
        'ticket_number', 'user__username', 'user__email',
        'event__title'
    ]
    date_hierarchy = 'purchased_at'
    ordering = ['-purchased_at']
    
    fieldsets = (
        ('Informations du billet', {
            'fields': ('ticket_number', 'event', 'user')
        }),
        ('Détails de la commande', {
            'fields': ('quantity', 'total_price', 'status')
        }),
        ('QR Code', {
            'fields': ('qr_code',)
        }),
        ('Dates', {
            'fields': ('purchased_at', 'used_at')
        }),
    )
    
    readonly_fields = ['ticket_number', 'purchased_at', 'updated_at']