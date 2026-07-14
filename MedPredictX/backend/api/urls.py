from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    health_check,
    api_info,
    RegisterView,
    login_view,
    current_user_view,
    profile_view,
    logout_view,
    AppointmentViewSet,
    MedicalRecordViewSet,
    list_doctors,
    ai_doctor_recommender,
    predict_disease,
)

# Create router for viewsets
router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'medical-records', MedicalRecordViewSet, basename='medical-record')

urlpatterns = [
    # Health and info endpoints
    path('health/', health_check, name='health_check'),
    path('info/', api_info, name='api_info'),
    
    # Authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', login_view, name='login'),
    path('auth/user/', current_user_view, name='current_user'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile endpoint
    path('profile/', profile_view, name='profile'),
    
    # Doctor listing
    path('doctors/', list_doctors, name='list_doctors'),
    
    # AI Doctor Recommender
    path('ai/recommend/', ai_doctor_recommender, name='ai_recommend'),
    
    # ML Disease Predictor
    path('predict/', predict_disease, name='predict_disease'),
    
    # Include router URLs (appointments)
    path('', include(router.urls)),
]

