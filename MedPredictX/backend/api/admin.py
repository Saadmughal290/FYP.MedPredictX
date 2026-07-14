from django.contrib import admin
from .models import UserProfile, Appointment, MedicalRecord

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'specialization', 'is_verified']
    list_filter = ['role', 'is_verified']
    search_fields = ['user__username', 'user__email', 'specialization']
    list_editable = ['is_verified']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'role')
        }),
        ('Contact Information', {
            'fields': ('phone_number', 'date_of_birth', 'address')
        }),
        ('Doctor Information', {
            'fields': ('specialization', 'license_number', 'is_verified'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'appointment_date', 'status', 'created_at']
    list_filter = ['status', 'appointment_date']
    search_fields = ['patient__username', 'doctor__username', 'symptoms']
    date_hierarchy = 'appointment_date'
    
    fieldsets = (
        ('Appointment Details', {
            'fields': ('patient', 'doctor', 'appointment_date', 'status')
        }),
        ('Medical Information', {
            'fields': ('symptoms', 'diagnosis', 'prescription')
        }),
    )

@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'record_type', 'title', 'record_date', 'created_at']
    list_filter = ['record_type', 'record_date']
    search_fields = ['patient__username', 'doctor__username', 'title', 'description']
    date_hierarchy = 'record_date'
    
    fieldsets = (
        ('Record Information', {
            'fields': ('patient', 'doctor', 'record_type', 'title', 'record_date')
        }),
        ('Details', {
            'fields': ('description', 'attachment')
        }),
    )
