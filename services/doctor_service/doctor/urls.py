from django.urls import path

from .views import (
    DoctorListCreateView,
    DoctorRetrieveUpdateView,
    ScheduleListCreateView,
    ScheduleRetrieveUpdateView,
)

urlpatterns = [
    path('', DoctorListCreateView.as_view(), name='doctor-list-create'),
    path('<str:pk>/', DoctorRetrieveUpdateView.as_view(), name='doctor-retrieve-update'),
    path('schedules/', ScheduleListCreateView.as_view(), name='schedule-list-create'),
    path('schedules/<str:pk>/', ScheduleRetrieveUpdateView.as_view(), name='schedule-retrieve-update'),
]