import os
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.conf import settings
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer, AppointmentSerializer, MedicalRecordSerializer
from .models import Appointment, UserProfile, MedicalRecord
from .permissions import IsPatient, IsDoctor, IsPatientOrDoctor


# Health check endpoint
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Health check endpoint to verify the API is running.
    """
    return Response({
        'status': 'success',
        'message': 'MedPredictX API is running!',
        'version': '1.0.0'
    })


# API info endpoint
@api_view(['GET'])
@permission_classes([AllowAny])
def api_info(request):
    """
    API information endpoint.
    """
    return Response({
        'name': 'MedPredictX API',
        'description': 'Backend API for MedPredictX disease prediction system',
        'endpoints': {
            '/api/health/': 'Health check endpoint',
            '/api/info/': 'API information',
            '/api/auth/register/': 'User registration',
            '/api/auth/login/': 'User login',
            '/api/auth/user/': 'Get current user info',
            '/api/auth/refresh/': 'Refresh access token',
            '/api/appointments/': 'Appointment management',
            '/api/doctors/': 'List available doctors',
        }
    })


# User Registration View
class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        """Override create to return JWT tokens with user data"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        # Get user profile data
        user_serializer = UserSerializer(user)
        
        return Response({
            'user': user_serializer.data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


# User Login View
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    API endpoint for user login.
    Accepts either username or email in the 'username' field.
    Returns JWT tokens and user information.
    """
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        username_or_email = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        # Support login with email: look up username from email
        if '@' in username_or_email:
            try:
                user_obj = User.objects.get(email=username_or_email)
                username = user_obj.username
            except User.DoesNotExist:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            username = username_or_email
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Serialize user data
            user_serializer = UserSerializer(user)
            
            return Response({
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'user': user_serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Get Current User View
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """
    Get current authenticated user information.
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# Profile View (GET and PUT)
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """
    GET: Retrieve user profile
    PUT: Update user profile including health metrics
    """
    user = request.user
    
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        print('Received profile update:', request.data)  # Debug log
        
        # Update User model fields
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.email = request.data.get('email', user.email)
        user.save()
        
        # Update UserProfile fields
        profile = user.profile
        profile.phone_number = request.data.get('phone_number', profile.phone_number)
        
        # Update health fields - handle empty strings and convert to proper types
        height_val = request.data.get('height', '')
        if height_val and str(height_val).strip():
            try:
                profile.height = float(height_val)
            except (ValueError, TypeError):
                profile.height = None
        elif height_val == '' or height_val is None:
            # Don't change if not provided
            pass
            
        weight_val = request.data.get('weight', '')
        if weight_val and str(weight_val).strip():
            try:
                profile.weight = float(weight_val)
            except (ValueError, TypeError):
                profile.weight = None
        elif weight_val == '' or weight_val is None:
            pass
            
        age_val = request.data.get('age', '')
        if age_val and str(age_val).strip():
            try:
                profile.age = int(age_val)
            except (ValueError, TypeError):
                profile.age = None
        elif age_val == '' or age_val is None:
            pass
            
        gender_val = request.data.get('gender', '')
        if gender_val and str(gender_val).strip():
            profile.gender = gender_val
        elif gender_val == '':
            pass
        
        # Update doctor-specific fields
        if profile.role == 'DOCTOR':
            profile.specialization = request.data.get('specialization', profile.specialization)
            # License number updates should be admin-only, so we don't update it here
        
        profile.save()
        print(f'Saved profile: height={profile.height}, weight={profile.weight}, age={profile.age}, gender={profile.gender}')  # Debug log
        
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Logout View
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout user by blacklisting the refresh token.
    """
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Medical Records ViewSet
class MedicalRecordViewSet(viewsets.ModelViewSet):
    """
    API endpoint for medical records management.
    Patients can view their records, doctors can create records for patients.
    """
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter records based on user role.
        Patients see only their records, doctors see records they created.
        """
        user = self.request.user
        if hasattr(user, 'profile'):
            if user.profile.role == 'PATIENT':
                return MedicalRecord.objects.filter(patient=user)
            elif user.profile.role == 'DOCTOR':
                return MedicalRecord.objects.filter(doctor=user)
            elif user.profile.role == 'ADMIN':
                return MedicalRecord.objects.all()
        return MedicalRecord.objects.filter(patient=user)
    
    def perform_create(self, serializer):
        """
        Set the doctor when creating a record.
        Patient should come from the request data.
        """
        user = self.request.user
        if hasattr(user, 'profile') and user.profile.role == 'DOCTOR':
            # Doctor creates record for a patient - patient comes from request data
            serializer.save(doctor=user)
        else:
            # Patient creates their own record
            serializer.save(patient=user)


# Appointment ViewSet
class AppointmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for appointment management.
    Patients can create and view their appointments.
    Doctors can view and update their appointments.
    """
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated, IsPatientOrDoctor]
    
    def get_queryset(self):
        """
        Filter appointments based on user role.
        Patients see their own appointments.
        Doctors see appointments assigned to them.
        """
        user = self.request.user
        
        if hasattr(user, 'profile'):
            if user.profile.role == 'PATIENT':
                return Appointment.objects.filter(patient=user)
            elif user.profile.role == 'DOCTOR':
                return Appointment.objects.filter(doctor=user)
        
        return Appointment.objects.none()
    
    def perform_create(self, serializer):
        """
        Set the patient to the current user when creating an appointment.
        """
        try:
            print(f"Creating appointment for user: {self.request.user.username}")
            print(f"Request data: {self.request.data}")
            serializer.save(patient=self.request.user)
            print("Appointment created successfully")
        except Exception as e:
            print(f"Error creating appointment: {str(e)}")
            raise


# List Available Doctors
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_doctors(request):
    """
    List all verified doctors for appointment booking.
    """
    doctors = User.objects.filter(
        profile__role='DOCTOR',
        profile__is_verified=True
    ).select_related('profile')
    
    doctors_data = []
    for doctor in doctors:
        doctors_data.append({
            'id': doctor.id,
            'name': f"{doctor.first_name} {doctor.last_name}" if doctor.first_name else doctor.username,
            'username': doctor.username,
            'specialization': doctor.profile.specialization,
            'email': doctor.email
        })
    
    return Response(doctors_data)


# AI Doctor Recommender View
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_doctor_recommender(request):
    """
    AI-powered doctor/specialty recommender using Google Gemini API (free tier).
    Uses the new google-genai SDK with gemini-2.0-flash model.
    Accepts: symptoms (str), age (str), gender (str), existing_conditions (str)
    Returns: recommended specialty, urgency level, reasons, and immediate actions.
    """
    import json
    import re

    symptoms = request.data.get('symptoms', '').strip()
    age = request.data.get('age', '').strip()
    gender = request.data.get('gender', '').strip()
    existing_conditions = request.data.get('existing_conditions', '').strip()

    uploaded_file = request.FILES.get('report_file')
    file_text = ""
    image_b64 = None

    if uploaded_file:
        file_ext = uploaded_file.name.split('.')[-1].lower()
        if file_ext == 'pdf':
            import PyPDF2
            try:
                pdf_reader = PyPDF2.PdfReader(uploaded_file)
                for page in pdf_reader.pages:
                    text = page.extract_text()
                    if text:
                        file_text += text + "\n"
            except Exception as e:
                return Response({'error': f'Failed to parse PDF: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
                
            if not file_text.strip():
                return Response({'error': 'We could not extract any text from this PDF. It might be a scanned image. Please describe your symptoms manually.'}, status=status.HTTP_400_BAD_REQUEST)
        elif file_ext in ['jpg', 'jpeg', 'png']:
            return Response({'error': 'Groq has temporarily disabled their Vision API. Please upload your medical report as a PDF instead.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Unsupported file type. Please upload a PDF, JPG, or PNG.'}, status=status.HTTP_400_BAD_REQUEST)

    if not symptoms and not file_text and not image_b64:
        return Response(
            {'error': 'Please describe your symptoms or upload a medical report.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check if API key is configured
    api_key = os.environ.get('GROQ_API_KEY', '').strip()
    if not api_key or api_key == 'your_groq_api_key_here':
        return Response(
            {'error': 'Groq API key not set. Open backend/.env and set GROQ_API_KEY to your key from https://console.groq.com/keys'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    try:
        from groq import Groq
        
        # Initialize Groq client
        client = Groq(api_key=api_key)

        prompt = f"""You are a professional medical triage assistant helping patients find the right type of doctor.

Analyze the following patient information and provide a structured recommendation.

Patient Information:
- Age: {age if age else 'Not provided'}
- Gender: {gender if gender else 'Not provided'}
- Symptoms: {symptoms}
- Existing Conditions/Medications: {existing_conditions if existing_conditions else 'None reported'}
"""
        if file_text:
            prompt += f"\n- Extracted Medical Report Text:\n{file_text[:3000]}\n"
            
        prompt += """
Based on this information, determine the most appropriate medical specialist for the patient. 
Respond ONLY with a valid JSON object using the exact schema below. Do not include markdown formatting or extra text.

Schema:
{
  "recommended_specialty": "string (e.g., Cardiologist, General Practitioner, ER)",
  "urgency": "string (MUST be exactly one of: Emergency, Urgent, Soon, Routine)",
  "reasons": ["string", "string"],
  "immediate_actions": ["string", "string"],
  "what_to_expect": "string (Brief description of what the doctor might do)",
  "disclaimer": "This is an AI recommendation and not a substitute for professional medical advice."
}
"""

        messages = [
            {
                "role": "system",
                "content": "You are a medical triage assistant. Always respond in valid JSON matching the requested schema."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
        
        model_name = "llama-3.3-70b-versatile"

        # Call the Groq API
        chat_completion = client.chat.completions.create(
            messages=messages,
            model=model_name,
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        
        text = chat_completion.choices[0].message.content.strip()
        
        # Clean up json format if model included markdown blocks
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        
        import json
        result = json.loads(text.strip())
        
        return Response(result, status=status.HTTP_200_OK)

    except ImportError:
        return Response(
            {'error': 'AI library not installed. Please run: pip install groq'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    except json.JSONDecodeError as e:
        return Response(
            {'error': f'Failed to parse AI response. Please try again. Details: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        
        # Check for Groq API quota errors
        err_msg = str(e)
        if '429' in err_msg or 'rate limit' in err_msg.lower():
            return Response(
                {'error': 'The AI service is temporarily at capacity (rate limit exceeded). Please wait a minute and try again.'},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        return Response(
            {'error': f'AI service error: {err_msg}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Disease Prediction View (ML Predictor)
@api_view(['POST'])
@permission_classes([AllowAny])
def predict_disease(request):
    """
    Predicts a disease based on a list of symptoms using a trained ML model.
    Expects JSON: {"symptoms": ["itching", "skin_rash", ...]}
    Returns: {"predicted_disease": "Fungal infection"}
    """
    import os
    import joblib
    import numpy as np
    
    symptoms = request.data.get('symptoms', [])
    if not isinstance(symptoms, list) or len(symptoms) == 0:
        return Response({'error': 'Please provide a list of symptoms in the "symptoms" field.'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.abspath(os.path.join(current_dir, '../ml_model/disease_model.joblib'))
        
        if not os.path.exists(model_path):
            return Response({'error': 'ML model not found on the server.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
        saved_data = joblib.load(model_path)
        model = saved_data.get('model')
        feature_names = saved_data.get('feature_names')
        
        # Create a binary feature vector
        feature_vector = np.zeros(len(feature_names))
        
        for symptom in symptoms:
            # We map string formatting like "Skin rash" back to "skin_rash" if needed
            # The frontend should ideally send exact matching strings, but let's be safe
            formatted_symptom = symptom.lower().replace(' ', '_')
            
            # Find index of this symptom
            if formatted_symptom in feature_names:
                idx = feature_names.index(formatted_symptom)
                feature_vector[idx] = 1
                
        import pandas as pd
        input_data = pd.DataFrame([feature_vector], columns=feature_names)
        
        # Predict
        prediction = model.predict(input_data)[0]
        
        return Response({
            'predicted_disease': prediction
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'error': f'Failed to predict: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
