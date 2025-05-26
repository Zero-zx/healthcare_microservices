from rest_framework import serializers
from django.core.validators import EmailValidator, MinLengthValidator

from .models import Doctor, Schedule


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'
        read_only_fields = ('user_id',)
        extra_kwargs = {
            'name': {'required': True, 'min_length': 1},
            'specialty': {'required': True, 'min_length': 1},
            'license': {'required': True, 'min_length': 1},
            'phone': {'required': True, 'min_length': 1},
            'email': {'required': True, 'validators': [EmailValidator()]},
        }

    def validate_phone(self, value):
        if not value.replace('+', '').replace('-', '').replace(' ', '').isdigit():
            raise serializers.ValidationError("Phone number must contain only digits, spaces, hyphens, and plus sign")
        return value

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'