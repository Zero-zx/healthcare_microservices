from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ('id', 'email', 'name', 'age', 'gender', 'phone', 'address', 
                 'medical_history', 'patient_type', 'preferred_contact_method', 
                 'timezone', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at') 