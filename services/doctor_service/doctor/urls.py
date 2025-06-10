from django.urls import path

from .views import (
    DoctorListCreateView,
    DoctorRetrieveUpdateView,
    ScheduleListCreateView,
    ScheduleRetrieveUpdateView,
)

urlpatterns = [
    path('', DoctorListCreateView.as_view(), name='doctor-list-create'),
    path('profile/', DoctorRetrieveUpdateView.as_view(), name='doctor-profile'),
    path('schedules/', ScheduleListCreateView.as_view(), name='schedule-list-create'),
    path('schedules/<uuid:pk>/', ScheduleRetrieveUpdateView.as_view(), name='schedule-detail'),
]