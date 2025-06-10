from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import requests
import logging

from .models import User
from .serializers import UserSerializer, RegisterSerializer, UserProfileSerializer

logger = logging.getLogger(__name__)

class RegisterView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        try:
            # 1. Create base user
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()

            # 2. Create role-specific profile
            if user.role == 'doctor':
                # Call doctor service to create doctor profile
                doctor_data = {
                    'user_id': str(user.id),
                    'specialization': request.data.get('specialization'),
                    'license_number': request.data.get('license_number'),
                    'years_of_experience': request.data.get('years_of_experience'),
                    'education': request.data.get('education'),
                    'languages': request.data.get('languages')
                }
                try:
                    headers = {
                        'Host': 'localhost',
                        'Content-Type': 'application/json'
                    }
                    response = requests.post('http://doctor_service:8000/api/doctors/', 
                                          json=doctor_data,
                                          headers=headers)
                    if response.status_code != 201:
                        user.delete()
                        raise Exception(f"Failed to create doctor profile: {response.text}")
                    response.raise_for_status()
                except requests.exceptions.RequestException as e:
                    # Rollback user creation if doctor profile creation fails
                    user.delete()
                    raise Exception(f"Failed to create doctor profile: {str(e)}")

            elif user.role == 'patient':
                # Validate required patient fields
                required_fields = ['name', 'age', 'gender', 'phone', 'address']
                missing_fields = [field for field in required_fields if not request.data.get(field)]
                if missing_fields:
                    user.delete()
                    raise Exception(f"Missing required fields for patient: {', '.join(missing_fields)}")

                # Call patient service to create patient profile
                patient_data = {
                    'user_id': str(user.id),
                    'name': request.data.get('name'),
                    'age': request.data.get('age'),
                    'gender': request.data.get('gender'),
                    'phone': request.data.get('phone'),
                    'address': request.data.get('address'),
                }
                try:
                    response = requests.post('http://patient-service:8000/api/patients/', json=patient_data)
                    if response.status_code != 201:
                        user.delete()
                        raise Exception(f"Failed to create patient profile: {response.text}")
                    response.raise_for_status()
                except requests.exceptions.RequestException as e:
                    # Rollback user creation if patient profile creation fails
                    user.delete()
                    raise Exception(f"Failed to create patient profile: {str(e)}")

            return Response({
                'message': 'User registered successfully',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class LoginView(generics.CreateAPIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'error': 'Please provide both email and password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(email=email, password=password)

        if not user:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user 