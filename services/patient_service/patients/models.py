from django.db import models
import uuid

class Patient(models.Model):
    PATIENT_TYPES = [
        ('normal', 'Normal Patient'),
        ('remote', 'Remote Patient'),
        ('vip', 'VIP Patient')
    ]

    id = models.CharField(primary_key=True, max_length=64, default=uuid.uuid4)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10, choices=[
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    ])
    phone = models.CharField(max_length=15)
    address = models.TextField()
    medical_history = models.TextField(blank=True, null=True)
    patient_type = models.CharField(max_length=20, choices=PATIENT_TYPES, default='normal')
    # Fields specific to remote patients
    preferred_contact_method = models.CharField(
        max_length=20,
        choices=[
            ('phone', 'Phone'),
            ('email', 'Email'),
            ('video', 'Video Call')
        ],
        null=True,
        blank=True
    )
    timezone = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.get_patient_type_display()}" 