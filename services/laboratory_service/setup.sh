#!/bin/bash

# Create Django project
django-admin startproject laboratory_service .

# Create app
python manage.py startapp disease_prediction

# Create necessary directories
mkdir -p disease_prediction/models
mkdir -p disease_prediction/serializers
mkdir -p disease_prediction/views
mkdir -p disease_prediction/ai_models 