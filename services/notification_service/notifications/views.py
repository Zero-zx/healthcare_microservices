from rest_framework import viewsets, status
from rest_framework.response import Response
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
import logging
from .models import Notification
from .serializers import NotificationSerializer

logger = logging.getLogger(__name__)

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            logger.info(f"Attempting to send email to {serializer.validated_data['recipient']}")
            
            # Prepare context for template
            context = {
                'patient_name': request.data.get('patient_name', 'Patient'),
                'doctor_name': request.data.get('doctor_name', 'Doctor'),
                'doctor_specialization': request.data.get('doctor_specialization', 'General Medicine'),
                'appointment_date': request.data.get('appointment_date', ''),
                'appointment_time': request.data.get('appointment_time', ''),
                'location': request.data.get('location', ''),
                'contact_number': request.data.get('contact_number', settings.CONTACT_NUMBER),
                'contact_email': request.data.get('contact_email', settings.EMAIL_HOST_USER),
                'healthcare_system_name': request.data.get('healthcare_system_name', 'Healthcare System'),
                'phone_number': request.data.get('phone_number', settings.CONTACT_NUMBER),
                'email': request.data.get('email', settings.EMAIL_HOST_USER),
                'website_url': request.data.get('website_url', 'http://your-healthcare-system.com'),
                'unsubscribe_link': f'mailto:{settings.EMAIL_HOST_USER}?subject=unsubscribe'
            }
            
            # Render HTML content
            html_content = render_to_string('emails/appointment_confirmation.html', context)
            
            # Create email with proper headers
            email = EmailMessage(
                subject=f"Appointment Confirmation – Dr. {context['doctor_name']}",
                body=html_content,
                from_email=f"{context['healthcare_system_name']} <{settings.EMAIL_HOST_USER}>",
                to=[serializer.validated_data['recipient']],
                headers={
                    'X-Mailer': context['healthcare_system_name'],
                    'X-Priority': '1',
                    'Importance': 'high',
                    'Precedence': 'bulk',
                    'List-Unsubscribe': f'<mailto:{settings.EMAIL_HOST_USER}?subject=unsubscribe>',
                }
            )
            email.content_subtype = 'html'  # Set content type to HTML
            
            # Send email
            email.send(fail_silently=False)
            
            logger.info("Email sent successfully")
            # Save notification with sent status
            notification = serializer.save(status='sent')
            return Response(NotificationSerializer(notification).data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            # Save notification with failed status
            notification = serializer.save(status='failed')
            return Response(
                {'error': str(e), 'notification': NotificationSerializer(notification).data},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 