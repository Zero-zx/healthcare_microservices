from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from patients.models import Patient
from django.utils import timezone
import uuid

User = get_user_model()

class Command(BaseCommand):
    help = 'Loads fake data for testing'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        Patient.objects.all().delete()
        User.objects.all().delete()

        self.stdout.write('Creating users...')
        # Create admin user
        admin = User.objects.create_superuser(
            email='admin@healthcare.com',
            password='admin123',
            role='admin'
        )

        # Create doctors
        doctors = [
            User.objects.create_user(
                email='dr.smith@healthcare.com',
                password='doctor123',
                role='doctor'
            ),
            User.objects.create_user(
                email='dr.johnson@healthcare.com',
                password='doctor123',
                role='doctor'
            ),
            User.objects.create_user(
                email='dr.williams@healthcare.com',
                password='doctor123',
                role='doctor'
            ),
        ]

        # Create patients
        patients = [
            User.objects.create_user(
                email='john.doe@email.com',
                password='patient123',
                role='patient'
            ),
            User.objects.create_user(
                email='jane.smith@email.com',
                password='patient123',
                role='patient'
            ),
            User.objects.create_user(
                email='mike.johnson@email.com',
                password='patient123',
                role='patient'
            ),
            User.objects.create_user(
                email='sarah.williams@email.com',
                password='patient123',
                role='patient'
            ),
            User.objects.create_user(
                email='david.brown@email.com',
                password='patient123',
                role='patient'
            ),
        ]

        self.stdout.write('Creating patient profiles...')
        # Create patient profiles
        Patient.objects.create(
            user=patients[0],
            name='John Doe',
            age=35,
            gender='male',
            phone='+1234567890',
            address='123 Main St, City',
            medical_history='Hypertension, Allergies',
            patient_type='remote',
            preferred_contact_method='email',
            timezone='America/New_York'
        )

        Patient.objects.create(
            user=patients[1],
            name='Jane Smith',
            age=28,
            gender='female',
            phone='+1234567891',
            address='456 Oak Ave, Town',
            medical_history='Asthma',
            patient_type='offline',
            preferred_contact_method='phone',
            timezone='America/Chicago'
        )

        Patient.objects.create(
            user=patients[2],
            name='Mike Johnson',
            age=42,
            gender='male',
            phone='+1234567892',
            address='789 Pine Rd, Village',
            medical_history='Diabetes Type 2',
            patient_type='remote',
            preferred_contact_method='video',
            timezone='America/Los_Angeles'
        )

        Patient.objects.create(
            user=patients[3],
            name='Sarah Williams',
            age=31,
            gender='female',
            phone='+1234567893',
            address='321 Elm St, City',
            medical_history='None',
            patient_type='guest',
            preferred_contact_method='email',
            timezone='America/New_York'
        )

        Patient.objects.create(
            user=patients[4],
            name='David Brown',
            age=45,
            gender='male',
            phone='+1234567894',
            address='654 Maple Dr, Town',
            medical_history='Arthritis',
            patient_type='offline',
            preferred_contact_method='phone',
            timezone='America/Chicago'
        )

        self.stdout.write(self.style.SUCCESS('Successfully loaded fake data')) 