from django.db import models
import uuid

class Address(models.Model):
    street = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.street}, {self.city}, {self.state}"

class FullName(models.Model):
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100)

    def __str__(self):
        if self.middle_name:
            return f"{self.first_name} {self.middle_name} {self.last_name}"
        return f"{self.first_name} {self.last_name}"

class Patient(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=uuid.uuid4)
    email = models.EmailField(unique=True)
    # name = models.CharField(max_length=100)
    full_name = models.OneToOneField(FullName, on_delete=models.CASCADE)
    age = models.IntegerField()
    gender = models.CharField(max_length=10, choices=[
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    ])
    phone = models.CharField(max_length=15)
    # address = models.TextField()
    address = models.OneToOneField(Address, on_delete=models.CASCADE)
    medical_history = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.name} - {self.get_patient_type_display()}"
        #return f"{self.full_name} - {self.get_patient_type_display()}"

class NormalPatient(Patient):
    insurance_provider = models.CharField(max_length=100, blank=True, null=True)
    insurance_number = models.CharField(max_length=50, blank=True, null=True)
    preferred_pharmacy = models.CharField(max_length=200, blank=True, null=True)
    emergency_contact = models.CharField(max_length=100)
    emergency_contact_phone = models.CharField(max_length=15)

class RemotePatient(Patient):
    preferred_contact_method = models.CharField(
        max_length=20,
        choices=[
            ('phone', 'Phone'),
            ('email', 'Email'),
            ('video', 'Video Call')
        ]
    )
    timezone = models.CharField(max_length=50)
    internet_connection_quality = models.CharField(
        max_length=20,
        choices=[
            ('good', 'Good'),
            ('fair', 'Fair'),
            ('poor', 'Poor')
        ]
    )
    device_type = models.CharField(
        max_length=20,
        choices=[
            ('mobile', 'Mobile'),
            ('tablet', 'Tablet'),
            ('computer', 'Computer')
        ]
    )
    remote_monitoring_consent = models.BooleanField(default=False)

class VIPPatient(Patient):
    concierge_service = models.BooleanField(default=True)
    private_room_preference = models.BooleanField(default=True)
    special_dietary_requirements = models.TextField(blank=True, null=True)
    personal_assistant_contact = models.CharField(max_length=100, blank=True, null=True)
    personal_assistant_phone = models.CharField(max_length=15, blank=True, null=True)
    preferred_doctors = models.TextField(blank=True, null=True)  # Comma-separated list of doctor IDs
    priority_appointment = models.BooleanField(default=True) 