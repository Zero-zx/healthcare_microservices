from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed')
    ]

    id = models.CharField(primary_key=True, max_length=64)
    patient_id = models.CharField(max_length=64)  # References patient-service
    doctor_id = models.CharField(max_length=64)   # References doctor-service
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True, null=True)
    service_type = models.CharField(max_length=100)  # Type of medical service
    duration = models.IntegerField(  # Duration in minutes
        validators=[MinValueValidator(15), MaxValueValidator(240)],
        default=30
    )

    class Meta:
        indexes = [
            models.Index(fields=['patient_id']),
            models.Index(fields=['doctor_id']),
            models.Index(fields=['date', 'time']),
            models.Index(fields=['status'])
        ]
        ordering = ['date', 'time']

    def __str__(self):
        return f"Appointment {self.id} - {self.patient_id} with {self.doctor_id} on {self.date} at {self.time}" 