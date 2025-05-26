import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

class DiseasePredictor:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model_path = os.path.join(os.path.dirname(__file__), 'disease_model.joblib')
        
        # Load model if it exists, otherwise create a new one
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
        else:
            # Initialize with training data for multiple diseases
            # Features: [age, gender, fever, cough, fatigue, headache, sore_throat, 
            #           runny_nose, body_ache, nausea, vomiting, diarrhea, 
            #           shortness_breath, chest_pain, rash, joint_pain]
            X = np.array([
                # Flu cases
                [25, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                [30, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                
                # COVID-19 cases
                [35, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
                [40, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
                
                # Common Cold cases
                [20, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [45, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                
                # Dengue Fever cases
                [28, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1],
                [32, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1],
                
                # Malaria cases
                [38, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
                [42, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
                
                # Typhoid cases
                [22, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
                [27, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
                
                # Pneumonia cases
                [50, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
                [55, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
                
                # Bronchitis cases
                [33, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
                [37, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
                
                # Gastroenteritis cases
                [29, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
                [31, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
                
                # Arthritis cases
                [60, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [65, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
            ])
            
            y = np.array([
                'Flu', 'Flu',
                'COVID-19', 'COVID-19',
                'Common Cold', 'Common Cold',
                'Dengue Fever', 'Dengue Fever',
                'Malaria', 'Malaria',
                'Typhoid', 'Typhoid',
                'Pneumonia', 'Pneumonia',
                'Bronchitis', 'Bronchitis',
                'Gastroenteritis', 'Gastroenteritis',
                'Arthritis', 'Arthritis'
            ])
            
            self.model.fit(X, y)
            joblib.dump(self.model, self.model_path)

    def predict(self, age, gender, symptoms, lab_results):
        # Convert gender to numeric (1 for male, 0 for female)
        gender_numeric = 1 if gender.lower() == 'male' else 0
        
        # Convert symptoms to numeric features, ensuring all 16 features are present
        features = [
            age,
            gender_numeric,
            symptoms.get('fever', 0),
            symptoms.get('cough', 0),
            symptoms.get('fatigue', 0),
            symptoms.get('headache', 0),
            symptoms.get('sore_throat', 0),
            symptoms.get('runny_nose', 0),
            symptoms.get('body_ache', 0),
            symptoms.get('nausea', 0),
            symptoms.get('vomiting', 0),
            symptoms.get('diarrhea', 0),
            symptoms.get('shortness_breath', 0),
            symptoms.get('chest_pain', 0),
            symptoms.get('rash', 0),
            symptoms.get('joint_pain', 0)
        ]
        
        # Make prediction
        prediction = self.model.predict([features])[0]
        confidence = np.max(self.model.predict_proba([features])[0])
        
        return prediction, confidence 