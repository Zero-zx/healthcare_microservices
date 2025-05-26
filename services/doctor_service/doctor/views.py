from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
import logging
import json

from .models import Doctor, Schedule
from .serializers import DoctorSerializer, ScheduleSerializer

logger = logging.getLogger(__name__)

class DoctorListCreateView(generics.ListCreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

    def create(self, request, *args, **kwargs):
        logger.info(f"Creating doctor with data: {json.dumps(request.data, indent=2)}")
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Validation error: {json.dumps(serializer.errors, indent=2)}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            self.perform_create(serializer)
            logger.info(f"Doctor created successfully: {json.dumps(serializer.data, indent=2)}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating doctor: {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DoctorRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    lookup_field = 'user_id'

class ScheduleListCreateView(generics.ListCreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer