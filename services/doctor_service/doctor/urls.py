from django.urls import path

from .views import (DoctorListCreateView, DoctorRetrieveUpdateView,
                    ScheduleListCreateView)

urlpatterns = [
    path('', DoctorListCreateView.as_view(), name='doctor-list-create'),
    path('<uuid:user_id>/', DoctorRetrieveUpdateView.as_view(), name='doctor-retrieve-update'),
    path('schedules/', ScheduleListCreateView.as_view(), name='schedule-list-create'),
]