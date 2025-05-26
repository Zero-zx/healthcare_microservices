from django.urls import path
from .views import PatientListCreateView, PatientRetrieveUpdateView

urlpatterns = [
    path('', PatientListCreateView.as_view(), name='patient-list-create'),
    path('<uuid:user_id>/', PatientRetrieveUpdateView.as_view(), name='patient-retrieve-update'),
] 