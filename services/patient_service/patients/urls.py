from django.urls import path
from .views import (
    PatientListCreateView,
    PatientRetrieveUpdateView
)

urlpatterns = [
    path('', PatientListCreateView.as_view(), name='patient-list-create'),
    path('profile/', PatientRetrieveUpdateView.as_view(), name='patient-profile'),
] 