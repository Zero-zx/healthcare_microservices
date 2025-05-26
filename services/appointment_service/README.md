# Appointment Service

This service manages appointments between patients and doctors in the healthcare system.

## API Endpoints

### Get All Appointments
- **URL**: `/api/appointments/`
- **Method**: `GET`
- **Response**: List of all appointments

### Get Appointment by ID
- **URL**: `/api/appointments/<uuid:id>/`
- **Method**: `GET`
- **Response**: Appointment details

### Create New Appointment
- **URL**: `/api/appointments/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "patient_id": "uuid",
    "doctor_id": "uuid",
    "date": "YYYY-MM-DD",
    "time": "HH:MM:SS",
    "service_type": "string",
    "duration": "integer",
    "notes": "string (optional)"
  }
  ```

### Update Appointment
- **URL**: `/api/appointments/<uuid:id>/`
- **Method**: `PUT`
- **Body**: Same as create, but all fields are optional

### Confirm Appointment
- **URL**: `/api/appointments/<uuid:id>/confirm/`
- **Method**: `POST`
- **Response**: Confirmation status

### Cancel Appointment
- **URL**: `/api/appointments/<uuid:id>/cancel/`
- **Method**: `POST`
- **Response**: Cancellation status

### Complete Appointment
- **URL**: `/api/appointments/<uuid:id>/complete/`
- **Method**: `POST`
- **Response**: Completion status

## API Documentation
- Swagger UI: `/swagger/`
- ReDoc: `/redoc/`

## Development
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. Start the development server:
   ```bash
   python manage.py runserver
   ```

4. Access the service at: `http://localhost:8000` 