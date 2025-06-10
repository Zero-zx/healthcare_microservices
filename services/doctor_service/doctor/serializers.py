from rest_framework import serializers
from .models import Doctor, Schedule, User
from django.contrib.auth.password_validation import validate_password

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ('id', 'day_of_week', 'start_time', 'end_time', 'is_available', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class DoctorSerializer(serializers.ModelSerializer):
    schedules = ScheduleSerializer(many=True, read_only=True)
    languages = serializers.CharField(required=True)
    email = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = ('id', 'user_id', 'name', 'email', 'specialization', 'license_number', 'years_of_experience',
                 'education', 'certifications', 'languages', 'schedules', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user_id', 'email', 'created_at', 'updated_at')
        extra_kwargs = {
            'specialization': {'required': True},
            'license_number': {'required': True},
            'years_of_experience': {'required': True, 'min_value': 0},
            'education': {'required': True},
            'languages': {'required': True}
        }

    def get_email(self, obj):
        try:
            user = User.objects.get(id=obj.user_id)
            return user.email
        except User.DoesNotExist:
            return None

    def validate_languages(self, value):
        if isinstance(value, list):
            return ', '.join(value)
        return value

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    specialization = serializers.CharField(required=True)
    license_number = serializers.CharField(required=True)
    years_of_experience = serializers.IntegerField(required=True)
    education = serializers.CharField(required=True)
    languages = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'username', 'role', 'specialization', 
                 'license_number', 'years_of_experience', 'education', 'languages')
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'default': 'doctor'}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role='doctor'
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True) 