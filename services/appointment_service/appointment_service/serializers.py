from rest_framework import serializers
from .models import Appointment
import uuid

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient_id', 'doctor_id', 'date', 'time',
            'status', 'created_at', 'updated_at', 'notes',
            'service_type', 'duration'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_patient_id(self, value):
        # Accept any string value
        return str(value)

    def validate_doctor_id(self, value):
        # Accept any string value
        return str(value)

    def create(self, validated_data):
        # Generate a unique ID for new appointments
        validated_data['id'] = str(uuid.uuid4())
        return super().create(validated_data) 