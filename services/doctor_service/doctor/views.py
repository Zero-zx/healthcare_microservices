from rest_framework import generics, serializers
from rest_framework.permissions import AllowAny
from .models import Doctor, Schedule
from .serializers import DoctorSerializer, ScheduleSerializer

class DoctorListCreateView(generics.ListCreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = (AllowAny,)

class DoctorRetrieveUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = (AllowAny,)

class ScheduleListCreateView(generics.ListCreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = (AllowAny,)

    def perform_create(self, serializer):
        doctor_id = self.request.data.get('doctor')
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            serializer.save(doctor=doctor)
        except Doctor.DoesNotExist:
            raise serializers.ValidationError({"doctor": "Doctor not found"})

class ScheduleRetrieveUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = (AllowAny,)