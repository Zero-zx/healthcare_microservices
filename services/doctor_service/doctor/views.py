from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import logging
import json
import requests
from django.http import Http404

from .models import Doctor, Schedule
from .serializers import DoctorSerializer, ScheduleSerializer, RegisterSerializer, LoginSerializer

logger = logging.getLogger(__name__)

class RegisterView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            return Response({
                'message': 'Doctor registered successfully',
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'role': user.role
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
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            user = authenticate(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            
            if user and user.role == 'doctor':
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': {
                        'id': str(user.id),
                        'email': user.email,
                        'role': user.role
                    },
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            return Response(
                {'error': 'Invalid credentials or not a doctor'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class DoctorListCreateView(generics.ListCreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = (AllowAny,)

    def perform_create(self, serializer):
        # Simply save the doctor profile with the provided user_id
        serializer.save(user_id=self.request.data['user_id'])

class DoctorRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        # Get user info from user service
        try:
            user_response = requests.get(
                f'http://user_service:8000/api/profile/',
                headers={'Authorization': f'Bearer {self.request.auth}'}
            )
            user_response.raise_for_status()
            user_data = user_response.json()
            
            # Get doctor profile
            return Doctor.objects.get(user_id=user_data['id'])
        except requests.exceptions.RequestException as e:
            logger.error(f"Error getting user info: {str(e)}")
            raise
        except Doctor.DoesNotExist:
            raise Http404("Doctor profile not found")

class ScheduleListCreateView(generics.ListCreateAPIView):
    serializer_class = ScheduleSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        try:
            user_response = requests.get(
                f'http://user_service:8000/api/profile/',
                headers={'Authorization': f'Bearer {self.request.auth}'}
            )
            user_response.raise_for_status()
            user_data = user_response.json()
            
            doctor = Doctor.objects.get(user_id=user_data['id'])
            return Schedule.objects.filter(doctor=doctor)
        except (requests.exceptions.RequestException, Doctor.DoesNotExist) as e:
            logger.error(f"Error getting schedules: {str(e)}")
            raise

    def perform_create(self, serializer):
        try:
            user_response = requests.get(
                f'http://user_service:8000/api/profile/',
                headers={'Authorization': f'Bearer {self.request.auth}'}
            )
            user_response.raise_for_status()
            user_data = user_response.json()
            
            doctor = Doctor.objects.get(user_id=user_data['id'])
            serializer.save(doctor=doctor)
        except (requests.exceptions.RequestException, Doctor.DoesNotExist) as e:
            logger.error(f"Error creating schedule: {str(e)}")
            raise

class ScheduleRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ScheduleSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        try:
            user_response = requests.get(
                f'http://user_service:8000/api/profile/',
                headers={'Authorization': f'Bearer {self.request.auth}'}
            )
            user_response.raise_for_status()
            user_data = user_response.json()
            
            doctor = Doctor.objects.get(user_id=user_data['id'])
            return Schedule.objects.filter(doctor=doctor)
        except (requests.exceptions.RequestException, Doctor.DoesNotExist) as e:
            logger.error(f"Error getting schedule: {str(e)}")
            raise