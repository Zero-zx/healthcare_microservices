"""
ASGI config for appointment_service project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'appointment_service.settings')

application = get_asgi_application() 