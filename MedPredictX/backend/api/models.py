from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    """Extended user profile with role-based information"""
    
    ROLE_CHOICES = [
        ('PATIENT', 'Patient'),
        ('DOCTOR', 'Doctor'),
        ('ADMIN', 'Admin'),
    ]
    
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='PATIENT')
    
    # Common fields
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    # Health metrics (for patients)
    height = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, help_text="Height in cm")
    weight = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, help_text="Weight in kg")
    age = models.IntegerField(blank=True, null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, null=True)
    
    # Doctor-specific fields
    specialization = models.CharField(max_length=100, blank=True, null=True)
    license_number = models.CharField(max_length=50, blank=True, null=True, unique=True)
    is_verified = models.BooleanField(default=False)  # For doctor verification
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"
    
    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'


class Appointment(models.Model):
    """Appointment model for patient-doctor consultations"""
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointments')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_appointments')
    
    appointment_date = models.DateTimeField()
    symptoms = models.TextField(blank=True, null=True)
    diagnosis = models.TextField(blank=True, null=True)
    prescription = models.TextField(blank=True, null=True)
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.patient.username} - {self.doctor.username} - {self.appointment_date}"
    
    class Meta:
        ordering = ['-appointment_date']


class MedicalRecord(models.Model):
    """Model for storing patient medical records"""
    RECORD_TYPE_CHOICES = [
        ('DIAGNOSIS', 'Diagnosis'),
        ('LAB_RESULT', 'Lab Result'),
        ('PRESCRIPTION', 'Prescription'),
        ('IMAGING', 'Imaging'),
        ('CONSULTATION', 'Consultation Notes'),
        ('OTHER', 'Other'),
    ]
    
    GLUCOSE_TYPE_CHOICES = [
        ('FASTING', 'Fasting'),
        ('RANDOM', 'Random'),
        ('POST_MEAL', 'Post Meal'),
    ]
    
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medical_records')
    doctor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_records')
    record_type = models.CharField(max_length=20, choices=RECORD_TYPE_CHOICES, default='OTHER')
    title = models.CharField(max_length=200)
    description = models.TextField()
    record_date = models.DateField()
    attachment = models.FileField(upload_to='medical_records/', null=True, blank=True)
    
    # Vital signs (optional)
    blood_pressure_systolic = models.IntegerField(blank=True, null=True, help_text="Systolic BP (mmHg)")
    blood_pressure_diastolic = models.IntegerField(blank=True, null=True, help_text="Diastolic BP (mmHg)")
    glucose_level = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, help_text="Glucose in mg/dL")
    glucose_measurement_type = models.CharField(max_length=10, choices=GLUCOSE_TYPE_CHOICES, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-record_date', '-created_at']
    
    def __str__(self):
        return f"{self.patient.username} - {self.record_type} - {self.record_date}"
