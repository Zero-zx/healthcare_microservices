from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
import requests
from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def list(self, request, *args, **kwargs):
        # Get all appointments
        appointments = self.get_queryset()
        serializer = self.get_serializer(appointments, many=True)
        data = serializer.data

        # Fetch patient and doctor data for each appointment
        for appointment in data:
            try:
                # Fetch patient data
                patient_response = requests.get(
                    f'http://patient-service:8000/api/patients/{appointment["patient_id"]}/',
                    timeout=5
                )
                if patient_response.status_code == 200:
                    appointment['patient_data'] = patient_response.json()
                else:
                    appointment['patient_data'] = None

                # Fetch doctor data
                doctor_response = requests.get(
                    f'http://doctor-service:8000/api/doctors/{appointment["doctor_id"]}/',
                    timeout=5
                )
                if doctor_response.status_code == 200:
                    appointment['doctor_data'] = doctor_response.json()
                else:
                    appointment['doctor_data'] = None

            except requests.RequestException:
                appointment['patient_data'] = None
                appointment['doctor_data'] = None

        return Response(data)

    def retrieve(self, request, *args, **kwargs):
        # Get single appointment
        appointment = self.get_object()
        serializer = self.get_serializer(appointment)
        data = serializer.data

        try:
            # Fetch patient data
            patient_response = requests.get(
                f'http://patient-service:8000/api/patients/{data["patient_id"]}/',
                timeout=5
            )
            if patient_response.status_code == 200:
                data['patient_data'] = patient_response.json()
            else:
                data['patient_data'] = None

            # Fetch doctor data
            doctor_response = requests.get(
                f'http://doctor-service:8000/api/doctors/{data["doctor_id"]}/',
                timeout=5
            )
            if doctor_response.status_code == 200:
                data['doctor_data'] = doctor_response.json()
            else:
                data['doctor_data'] = None

        except requests.RequestException:
            data['patient_data'] = None
            data['doctor_data'] = None

        return Response(data)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'confirmed'
        appointment.save()
        return Response({'status': 'appointment confirmed'})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'cancelled'
        appointment.save()
        return Response({'status': 'appointment cancelled'})

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'completed'
        appointment.save()
        return Response({'status': 'appointment completed'}) 