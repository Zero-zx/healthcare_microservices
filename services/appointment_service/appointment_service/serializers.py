from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient_id', 'doctor_id', 'date', 'time',
            'status', 'created_at', 'updated_at', 'notes',
            'service_type', 'duration'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at'] 