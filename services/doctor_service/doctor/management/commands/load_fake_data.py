from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from doctor.models import Doctor, Schedule
import uuid
import json

User = get_user_model()

class Command(BaseCommand):
    help = 'Loads fake data for doctors and their schedules'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        Doctor.objects.all().delete()
        User.objects.filter(role='doctor').delete()

        self.stdout.write('Creating users...')
        doctors_data = [
            {
                'email': 'dr.smith@hospital.com',
                'username': 'drsmith',
                'password': 'doctorpass123',
                'name': 'Dr. John Smith',
                'specialty': 'Cardiology',
                'license': 'MD123456',
                'phone': '+1234567890',
                'email': 'dr.smith@hospital.com',
                'schedule': {
                    'day_of_week': 'Monday',
                    'time_slots': [
                        {'start': '09:00', 'end': '10:00'},
                        {'start': '10:30', 'end': '11:30'},
                        {'start': '14:00', 'end': '15:00'}
                    ]
                }
            },
            {
                'email': 'dr.johnson@hospital.com',
                'username': 'drjohnson',
                'password': 'doctorpass123',
                'name': 'Dr. Sarah Johnson',
                'specialty': 'Pediatrics',
                'license': 'MD789012',
                'phone': '+1234567891',
                'email': 'dr.johnson@hospital.com',
                'schedule': {
                    'day_of_week': 'Tuesday',
                    'time_slots': [
                        {'start': '09:30', 'end': '10:30'},
                        {'start': '11:00', 'end': '12:00'},
                        {'start': '15:00', 'end': '16:00'}
                    ]
                }
            },
            {
                'email': 'dr.williams@hospital.com',
                'username': 'drwilliams',
                'password': 'doctorpass123',
                'name': 'Dr. Michael Williams',
                'specialty': 'Neurology',
                'license': 'MD345678',
                'phone': '+1234567892',
                'email': 'dr.williams@hospital.com',
                'schedule': {
                    'day_of_week': 'Wednesday',
                    'time_slots': [
                        {'start': '10:00', 'end': '11:00'},
                        {'start': '11:30', 'end': '12:30'},
                        {'start': '14:30', 'end': '15:30'}
                    ]
                }
            }
        ]

        for doctor_data in doctors_data:
            # Create user
            user = User.objects.create_user(
                email=doctor_data['email'],
                username=doctor_data['username'],
                password=doctor_data['password'],
                role='doctor'
            )

            # Create doctor
            doctor = Doctor.objects.create(
                user=user,
                name=doctor_data['name'],
                specialty=doctor_data['specialty'],
                license=doctor_data['license'],
                phone=doctor_data['phone'],
                email=doctor_data['email']
            )

            # Create schedule
            schedule_data = doctor_data['schedule']
            Schedule.objects.create(
                doctor=doctor,
                day_of_week=schedule_data['day_of_week'],
                time_slots=schedule_data['time_slots']
            )

        self.stdout.write(self.style.SUCCESS('Successfully loaded fake data')) 