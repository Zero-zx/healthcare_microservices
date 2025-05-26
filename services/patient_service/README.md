# Patient Service

This service manages patient profiles and their medical information for the healthcare system.

## API Endpoints

### Get All Patients
- **URL**: `/api/patients/`
- **Method**: `GET`
- **Response**: List of all patients

### Get Patient by ID
- **URL**: `/api/patients/<uuid:user_id>/`
- **Method**: `GET`
- **Response**: Patient details

### Create New Patient
- **URL**: `/api/patients/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "user_id": "uuid",
    "name": "string",
    "age": "integer",
    "gender": "string (male/female/other)",
    "phone": "string",
    "email": "string",
    "address": "string",
    "medical_history": "string (optional)"
  }
  ```

### Update Patient Profile
- **URL**: `/api/patients/<uuid:user_id>/`
- **Method**: `PUT`
- **Body**: Same as create, but all fields are optional

## API Documentation
- Swagger UI: `/swagger/`
- ReDoc: `/redoc/`

## Development
1. Build and run the service:
   ```bash
   docker-compose up --build
   ```

2. Access the service at: `http://localhost:8000` 