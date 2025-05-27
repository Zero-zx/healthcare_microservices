from django.urls import path

from .views import (DoctorListCreateView, DoctorRetrieveUpdateView,
                    ScheduleListCreateView, RegisterView, LoginView)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('', DoctorListCreateView.as_view(), name='doctor-list-create'),
    path('doctors/<uuid:user_id>/', DoctorRetrieveUpdateView.as_view(), name='doctor-retrieve-update'),
    path('schedules/', ScheduleListCreateView.as_view(), name='schedule-list-create'),
]