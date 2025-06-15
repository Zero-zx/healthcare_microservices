import torch
import json
import numpy as np
from train_model import DiseaseCNN, DiseaseDataset
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_model(model_path, kb_path):
    """Load the trained model and its configuration"""
    # Load checkpoint
    checkpoint = torch.load(model_path, map_location=torch.device('cpu'))
    
    # Load knowledge base
    with open(kb_path, 'r', encoding='utf-8') as f:
        diseases = json.load(f)
    
    # Create dataset to get the same symptom classes
    dataset = DiseaseDataset(kb_path)
    
    # Initialize model with correct number of classes
    model = DiseaseCNN(dataset.num_classes)
    model.load_state_dict(checkpoint['model_state_dict'])
    model.eval()
    
    return model, dataset.mlb.classes_, diseases

def predict_symptoms(model, image, symptom_classes, threshold=0.5):
    """Predict symptoms from an image"""
    with torch.no_grad():
        outputs = model(image)
        # Convert probabilities to binary predictions using threshold
        predictions = (outputs > threshold).cpu().numpy()[0]
        
        # Get predicted symptoms
        predicted_symptoms = [symptom for symptom, pred in zip(symptom_classes, predictions) if pred]
        
        # Get probabilities for each symptom
        probabilities = outputs.cpu().numpy()[0]
        
        return predicted_symptoms, probabilities

def suggest_diseases(predicted_symptoms, diseases):
    """Suggest possible diseases based on predicted symptoms"""
    disease_scores = []
    
    for disease_id, info in diseases.items():
        # Calculate how many predicted symptoms match the disease
        matching_symptoms = set(predicted_symptoms) & set(info['symptoms'])
        score = len(matching_symptoms) / len(info['symptoms'])
        
        disease_scores.append({
            'disease_id': disease_id,
            'name': info['name'],
            'score': score,
            'matching_symptoms': list(matching_symptoms),
            'missing_symptoms': list(set(info['symptoms']) - set(predicted_symptoms))
        })
    
    # Sort by score in descending order
    disease_scores.sort(key=lambda x: x['score'], reverse=True)
    return disease_scores

def main():
    # Setup paths
    model_path = 'best_model.pth'
    kb_path = '../kb/diseases.json'
    
    # Load model and data
    logger.info("Loading model and knowledge base...")
    model, symptom_classes, diseases = load_model(model_path, kb_path)
    
    # Example: Create a test image (similar to training data)
    test_image = torch.randn(1, 3, 224, 224)  # Batch size of 1
    
    # Make prediction
    logger.info("Making prediction...")
    predicted_symptoms, probabilities = predict_symptoms(model, test_image, symptom_classes)
    
    # Print predicted symptoms with probabilities
    logger.info("\nPredicted Symptoms:")
    for symptom, prob in zip(symptom_classes, probabilities):
        if prob > 0.5:  # Only show symptoms with probability > 0.5
            logger.info(f"- {symptom}: {prob:.2%}")
    
    # Suggest possible diseases
    logger.info("\nPossible Diseases:")
    disease_suggestions = suggest_diseases(predicted_symptoms, diseases)
    
    for disease in disease_suggestions[:3]:  # Show top 3 matches
        logger.info(f"\nDisease: {disease['name']} (Score: {disease['score']:.2%})")
        logger.info("Matching symptoms:")
        for symptom in disease['matching_symptoms']:
            logger.info(f"- {symptom}")
        if disease['missing_symptoms']:
            logger.info("Missing symptoms:")
            for symptom in disease['missing_symptoms']:
                logger.info(f"- {symptom}")

if __name__ == "__main__":
    main() 