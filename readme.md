# Healthcare Microservices

A microservices-based healthcare management system with features for managing doctors, patients, appointments, and more.

## Prerequisites

- Docker and Docker Compose
- Node.js (v14 or higher) for frontend development
- Git

## Project Structure

```
.
├── frontend/           # React frontend application
├── gateway/           # Nginx API Gateway
├── services/          # Backend microservices
│   ├── user_service/
│   ├── doctor_service/
│   ├── patient_service/
│   ├── appointment_service/
│   ├── laboratory_service/
│   └── chatbot_service/
└── docker-compose.yml # Docker configuration
```

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd healthcare_microservices
   ```

2. Start all services using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:8000
   - Individual services:
     - User Service: http://localhost:8001
     - Doctor Service: http://localhost:8002
     - Patient Service: http://localhost:8003
     - Appointment Service: http://localhost:8004
     - Laboratory Service: http://localhost:8005
     - Chatbot Service: http://localhost:8006

> docker exec -it doctor_service python manage.py makemigrations
> docker exec -it patient-service python manage.py makemigrations
## Database Setup

The project uses multiple databases:
- MySQL (for doctor, patient, and chatbot services)
- MongoDB (for appointment service)
- PostgreSQL (for user service)

Database initialization scripts are automatically run when the containers start.

## Development

### Frontend Development

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Backend Development

Each service is containerized and can be developed independently. The services are:
- User Service (Django + PostgreSQL)
- Doctor Service (Django + MySQL)
- Patient Service (Django + MySQL)
- Appointment Service (Django + MongoDB)
- Laboratory Service (Django)
- Chatbot Service (Django + MySQL)

## API Documentation

API documentation is available at:
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

## Environment Variables

The following environment variables are used in the project:

### MySQL Database
- MYSQL_ROOT_PASSWORD: root
- MYSQL_DATABASE: user_db
- MYSQL_USER: user
- MYSQL_PASSWORD: 123456

### PostgreSQL Database
- POSTGRES_DB: user_service
- POSTGRES_USER: postgres
- POSTGRES_PASSWORD: postgres

## Troubleshooting

1. If services fail to start, check the logs:
   ```bash
   docker-compose logs <service-name>
   ```

2. To restart a specific service:
   ```bash
   docker-compose restart <service-name>
   ```

3. To rebuild and restart all services:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.