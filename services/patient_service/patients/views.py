from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.http import Http404
from .models import Patient
from .serializers import PatientSerializer
import requests
import logging

logger = logging.getLogger(__name__)

class RegisterView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = PatientSerializer

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            patient = serializer.save()
            
            return Response({
                'message': 'Patient registered successfully',
                'patient': {
                    'id': str(patient.id),
                    'email': patient.email,
                    'name': patient.name
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class LoginView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = PatientSerializer

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            patient = serializer.validated_data['patient']
            refresh = RefreshToken.for_user(patient)
            
            return Response({
                'patient': {
                    'id': str(patient.id),
                    'email': patient.email,
                    'name': patient.name
                },
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PatientSerializer

    def get_object(self):
        return self.request.user

class PatientListCreateView(generics.ListCreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = (AllowAny,)

    def perform_create(self, serializer):
        try:
            # Create patient profile
            serializer.save()
        except Exception as e:
            logger.error(f"Error creating patient profile: {str(e)}")
            raise

class PatientRetrieveUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        return self.request.user 