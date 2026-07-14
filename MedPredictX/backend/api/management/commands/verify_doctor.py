from django.core.management.base import BaseCommand
from api.models import UserProfile

class Command(BaseCommand):
    help = 'Verify a doctor by username'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username of the doctor to verify')

    def handle(self, *args, **options):
        username = options['username']
        
        try:
            profile = UserProfile.objects.get(user__username=username, role='DOCTOR')
            profile.is_verified = True
            profile.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully verified doctor: {username}'))
        except UserProfile.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Doctor with username "{username}" not found'))
