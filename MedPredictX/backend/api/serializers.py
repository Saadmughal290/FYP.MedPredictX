from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile, Appointment, MedicalRecord


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    class Meta:
        model = UserProfile
        fields = ('role', 'phone_number', 'date_of_birth', 'address', 
                  'specialization', 'license_number', 'is_verified',
                  'height', 'weight', 'age', 'gender')
        read_only_fields = ('is_verified',)


class RegisterSerializer(serializers.Serializer):
    """Serializer for user registration with role"""
    # User model fields
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    
    # Profile fields
    role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES, required=True, write_only=True)
    phone_number = serializers.CharField(max_length=15, required=False, allow_blank=True, write_only=True)
    specialization = serializers.CharField(max_length=100, required=False, allow_blank=True, write_only=True)
    license_number = serializers.CharField(max_length=50, required=False, allow_blank=True, write_only=True)
    
    # Health fields (for patients)
    height = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True, write_only=True)
    weight = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True, write_only=True)
    age = serializers.IntegerField(required=False, allow_null=True, write_only=True)
    gender = serializers.ChoiceField(choices=UserProfile.GENDER_CHOICES, required=False, allow_blank=True, allow_null=True, write_only=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email already exists."})
        
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "Username already exists."})
        
        # Validate doctor-specific fields
        if attrs.get('role') == 'DOCTOR':
            if not attrs.get('specialization'):
                raise serializers.ValidationError({"specialization": "Specialization is required for doctors."})
            if not attrs.get('license_number'):
                raise serializers.ValidationError({"license_number": "License number is required for doctors."})
        
        return attrs

    def create(self, validated_data):
        # Extract profile-specific fields
        role = validated_data.pop('role')
        phone_number = validated_data.pop('phone_number', '')
        specialization = validated_data.pop('specialization', '')
        license_number = validated_data.pop('license_number', '')
        
        # Extract health fields
        height = validated_data.pop('height', None)
        weight = validated_data.pop('weight', None)
        age = validated_data.pop('age', None)
        gender = validated_data.pop('gender', None)
        
        validated_data.pop('password2')
        
        # Create user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        # Create profile
        UserProfile.objects.create(
            user=user,
            role=role,
            phone_number=phone_number,
            specialization=specialization,
            license_number=license_number if role == 'DOCTOR' else None,
            is_verified=False if role == 'DOCTOR' else True,  # Doctors need verification
            height=height,
            weight=weight,
            age=age,
            gender=gender
        )
        
        return user
    
    def to_representation(self, instance):
        """Only return User model fields in response"""
        return {
            'id': instance.id,
            'username': instance.username,
            'email': instance.email,
            'first_name': instance.first_name,
            'last_name': instance.last_name,
        }


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data with profile"""
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'profile')
        read_only_fields = ('id', 'date_joined')


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for Appointment model"""
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    doctor_specialization = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'doctor', 'patient_name', 'doctor_name', 
            'doctor_specialization', 'appointment_date', 'symptoms', 
            'diagnosis', 'prescription', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['patient', 'created_at', 'updated_at']
    
    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}" if obj.patient.first_name else obj.patient.username
    
    def get_doctor_name(self, obj):
        return f"{obj.doctor.first_name} {obj.doctor.last_name}" if obj.doctor.first_name else obj.doctor.username
    
    def get_doctor_specialization(self, obj):
        return obj.doctor.profile.specialization if hasattr(obj.doctor, 'profile') else None


class MedicalRecordSerializer(serializers.ModelSerializer):
    """Serializer for Medical Records"""
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicalRecord
        fields = [
            'id', 'patient', 'doctor', 'patient_name', 'doctor_name',
            'record_type', 'title', 'description', 'record_date',
            'attachment', 'created_at', 'updated_at',
            'blood_pressure_systolic', 'blood_pressure_diastolic',
            'glucose_level', 'glucose_measurement_type'
        ]
        read_only_fields = ['doctor', 'created_at', 'updated_at']
    
    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}" if obj.patient.first_name else obj.patient.username
    
    def get_doctor_name(self, obj):
        if obj.doctor:
            return f"{obj.doctor.first_name} {obj.doctor.last_name}" if obj.doctor.first_name else obj.doctor.username
        return None
