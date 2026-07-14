from rest_framework import permissions


class IsPatient(permissions.BasePermission):
    """Permission class for patient-only access"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'profile') and
            request.user.profile.role == 'PATIENT'
        )


class IsDoctor(permissions.BasePermission):
    """Permission class for doctor-only access"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'profile') and
            request.user.profile.role == 'DOCTOR' and
            request.user.profile.is_verified
        )


class IsAdmin(permissions.BasePermission):
    """Permission class for admin-only access"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'profile') and
            request.user.profile.role == 'ADMIN'
        )


class IsPatientOrDoctor(permissions.BasePermission):
    """Permission class for patient or doctor access"""
    
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        if not hasattr(request.user, 'profile'):
            return False
        
        role = request.user.profile.role
        if role == 'PATIENT':
            return True
        elif role == 'DOCTOR':
            return request.user.profile.is_verified
        
        return False


class IsOwner(permissions.BasePermission):
    """Permission class to check if user is the owner of the object"""
    
    def has_object_permission(self, request, view, obj):
        # Check if the object has a user attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user
        # Check if the object is the user itself
        if isinstance(obj, request.user.__class__):
            return obj == request.user
        return False
