from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'subject', 'message', 'sent_at', 'status']
        read_only_fields = ['sent_at', 'status'] 