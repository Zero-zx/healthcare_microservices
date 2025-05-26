from rest_framework import serializers
from disease_prediction.models.prediction import DiseasePrediction

class DiseasePredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiseasePrediction
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at') 