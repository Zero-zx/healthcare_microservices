from rest_framework import serializers
from django.core.validators import EmailValidator, MinLengthValidator
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from .models import Doctor, Schedule

User = get_user_model()

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

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=[('patient', 'Patient'), ('doctor', 'Doctor')], required=True)
    username = serializers.CharField(required=True, min_length=3)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2', 'role')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        if attrs['role'] != 'doctor':
            raise serializers.ValidationError({"role": "Only doctor registration is allowed in this service."})
        return attrs

    def create(self, validated_data):
        password2 = validated_data.pop('password2')
        role = validated_data.pop('role')
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=role
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    role = serializers.ChoiceField(choices=['patient', 'doctor'], required=True)

    def validate(self, attrs):
        if attrs['role'] != 'doctor':
            raise serializers.ValidationError({"role": "Only doctor login is allowed in this service."})
        return attrs