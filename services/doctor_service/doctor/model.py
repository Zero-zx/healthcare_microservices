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

class Doctor(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=uuid.uuid4)
    email = models.EmailField(unique=True)
    # name = models.CharField(max_length=100)
    full_name = models.OneToOneField(FullName, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, unique=True)
    years_of_experience = models.IntegerField()
    education = models.TextField()
    certifications = models.TextField(blank=True, null=True)
    languages = models.CharField(max_length=200)  # Comma-separated list of languages
    address = models.OneToOneField(Address, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self):
        #return f"Dr. {self.name} - {self.specialization}"
        return f"Dr. {self.full_name} - {self.specialization}"

class GeneralDoctor(Doctor):
    max_patients_per_day = models.IntegerField(default=20)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2)
    accepts_insurance = models.BooleanField(default=True)
    emergency_availability = models.BooleanField(default=True)

class SpecialistDoctor(Doctor):
    sub_specialization = models.CharField(max_length=100)
    research_publications = models.TextField(blank=True, null=True)
    fellowship_training = models.TextField(blank=True, null=True)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2)
    accepts_insurance = models.BooleanField(default=True)

class SurgeonDoctor(Doctor):
    surgery_types = models.TextField()  # Comma-separated list of surgery types
    operating_room_availability = models.BooleanField(default=True)
    surgery_fee = models.DecimalField(max_digits=10, decimal_places=2)
    accepts_insurance = models.BooleanField(default=True)
    emergency_surgery_availability = models.BooleanField(default=True)

class Schedule(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.IntegerField(choices=[
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday')
    ])
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('doctor', 'day_of_week')

    def __str__(self):
        return f"{self.doctor} - {self.get_day_of_week_display()} ({self.start_time} - {self.end_time})"