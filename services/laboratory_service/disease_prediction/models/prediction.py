from django.db import models

class DiseasePrediction(models.Model):
    patient_id = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    symptoms = models.JSONField()
    lab_results = models.JSONField()
    predicted_disease = models.CharField(max_length=100)
    confidence_score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'disease_predictions' 