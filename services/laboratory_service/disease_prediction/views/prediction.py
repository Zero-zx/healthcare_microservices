from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from disease_prediction.serializers.prediction import DiseasePredictionSerializer
from disease_prediction.models.prediction import DiseasePrediction
from disease_prediction.ai_models.predictor import DiseasePredictor
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class DiseasePredictionView(APIView):
    @swagger_auto_schema(
        operation_description="Predict disease based on patient data",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['patient_id', 'age', 'gender'],
            properties={
                'patient_id': openapi.Schema(type=openapi.TYPE_STRING, description='Patient ID'),
                'age': openapi.Schema(type=openapi.TYPE_INTEGER, description='Patient age'),
                'gender': openapi.Schema(type=openapi.TYPE_STRING, description='Patient gender (male/female)'),
                'symptoms': openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'fever': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Has fever'),
                        'cough': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Has cough'),
                        'fatigue': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Has fatigue'),
                        'headache': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Has headache'),
                        'sore_throat': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Has sore throat'),
                        'runny_nose': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Has runny nose'),
                        'body_ache': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Has body ache'),
                        'nausea': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Has nausea'),
                        'vomiting': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Has vomiting'),
                        'diarrhea': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Has diarrhea'),
                        'shortness_breath': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Has shortness of breath'),
                        'chest_pain': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Has chest pain'),
                        'rash': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Has rash'),
                        'joint_pain': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Has joint pain'),
                    }
                ),
                'lab_results': openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'wbc_count': openapi.Schema(type=openapi.TYPE_NUMBER, description='White blood cell count'),
                        'rbc_count': openapi.Schema(type=openapi.TYPE_NUMBER, description='Red blood cell count'),
                        'hemoglobin': openapi.Schema(type=openapi.TYPE_NUMBER, description='Hemoglobin level'),
                    }
                ),
            },
        ),
        responses={
            201: DiseasePredictionSerializer,
            400: 'Bad Request - Missing required fields',
        }
    )
    def post(self, request):
        # Get data from request
        patient_id = request.data.get('patient_id')
        age = request.data.get('age')
        gender = request.data.get('gender')
        symptoms = request.data.get('symptoms', {})
        lab_results = request.data.get('lab_results', {})

        # Validate required fields
        if not all([patient_id, age, gender]):
            return Response(
                {'error': 'Missing required fields: patient_id, age, gender'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get prediction from AI model
        predictor = DiseasePredictor()
        predicted_disease, confidence_score = predictor.predict(age, gender, symptoms, lab_results)

        # Create prediction record
        prediction = DiseasePrediction.objects.create(
            patient_id=patient_id,
            age=age,
            gender=gender,
            symptoms=symptoms,
            lab_results=lab_results,
            predicted_disease=predicted_disease,
            confidence_score=confidence_score
        )

        # Serialize and return response
        serializer = DiseasePredictionSerializer(prediction)
        return Response(serializer.data, status=status.HTTP_201_CREATED) 