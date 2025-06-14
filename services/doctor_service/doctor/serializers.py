from rest_framework import serializers
from .models import Doctor, Schedule

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ('id', 'day_of_week', 'start_time', 'end_time', 'is_available', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class DoctorSerializer(serializers.ModelSerializer):
    schedules = ScheduleSerializer(many=True, read_only=True)
    languages = serializers.CharField(required=True)

    class Meta:
        model = Doctor
        fields = ('id', 'email', 'name', 'specialization', 'license_number', 
                 'years_of_experience', 'education', 'certifications', 'languages', 
                 'schedules', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
        extra_kwargs = {
            'email': {'required': True},
            'name': {'required': True},
            'specialization': {'required': True},
            'license_number': {'required': True},
            'years_of_experience': {'required': True},
            'education': {'required': True},
            'languages': {'required': True}
        }

    def validate_languages(self, value):
        if isinstance(value, list):
            return ','.join(value)
        return value

    def validate_email(self, value):
        if Doctor.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_name(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        return value

    def validate_specialization(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("Specialization must be at least 2 characters long.")
        return value

    def validate_license_number(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("License number must be at least 2 characters long.")
        return value

    def validate_years_of_experience(self, value):
        if value < 0:
            raise serializers.ValidationError("Years of experience must be a non-negative number.")
        return value

    def validate_education(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("Education must be at least 2 characters long.")
        return value

    def validate_certifications(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Certifications must be a list.")
        return value

    def validate(self, attrs):
        if attrs['years_of_experience'] > 100:
            raise serializers.ValidationError("Years of experience cannot exceed 100.")
        return attrs

    def create(self, validated_data):
        doctor = Doctor.objects.create(**validated_data)
        return doctor

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr != 'email':
                setattr(instance, attr, value)
        instance.save()
        return instance 