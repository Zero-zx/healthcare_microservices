from django.urls import path
from .views import (
    PatientListCreateView,
    PatientRetrieveUpdateView,
    RegisterView,
    LoginView,
    UserProfileView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('patients/', PatientListCreateView.as_view(), name='patient-list-create'),
    path('patients/<uuid:pk>/', PatientRetrieveUpdateView.as_view(), name='patient-retrieve-update'),
] 