from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('app.urls')),  # Bỏ prefix api/chatbot/ vì đã được xử lý bởi nginx
] 