"""
Quick script to verify a doctor account
Run this with: python verify_doctor_quick.py
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import UserProfile

def verify_doctor(username):
    try:
        profile = UserProfile.objects.get(user__username=username, role='DOCTOR')
        profile.is_verified = True
        profile.save()
        print(f'✅ Successfully verified doctor: {username}')
        print(f'   Name: {profile.user.first_name} {profile.user.last_name}')
        print(f'   Specialization: {profile.specialization}')
        print(f'   License: {profile.license_number}')
    except UserProfile.DoesNotExist:
        print(f'❌ Doctor with username "{username}" not found')
        print('\nAvailable doctors:')
        doctors = UserProfile.objects.filter(role='DOCTOR')
        if doctors:
            for doc in doctors:
                status = '✓ Verified' if doc.is_verified else '✗ Not Verified'
                print(f'   - {doc.user.username} ({status})')
        else:
            print('   No doctors registered yet')

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1:
        username = sys.argv[1]
        verify_doctor(username)
    else:
        print('Usage: python verify_doctor_quick.py <username>')
        print('\nOr just run the script and it will show all doctors:')
        print()
        doctors = UserProfile.objects.filter(role='DOCTOR')
        if doctors:
            print('Registered doctors:')
            for doc in doctors:
                status = '✓ Verified' if doc.is_verified else '✗ Not Verified'
                print(f'   - {doc.user.username} ({status})')
            print('\nTo verify a doctor, run:')
            print('python verify_doctor_quick.py <username>')
        else:
            print('No doctors registered yet')
