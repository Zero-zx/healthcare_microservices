# Notification Service

This service handles sending notifications (primarily email) for the healthcare system.

## Features

- Send email notifications
- Track notification status (pending, sent, failed)
- REST API for sending notifications
- RabbitMQ integration for async notifications

## API Endpoints

### Send Notification
- **URL**: `/api/notifications/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "recipient": "string (email)",
    "subject": "string",
    "message": "string"
  }
  ```

### Get Notifications
- **URL**: `/api/notifications/`
- **Method**: `GET`
- **Response**: List of all notifications

### Get Notification by ID
- **URL**: `/api/notifications/<id>/`
- **Method**: `GET`
- **Response**: Notification details

## Environment Variables

- `EMAIL_HOST`: SMTP server host (default: smtp.gmail.com)
- `EMAIL_PORT`: SMTP server port (default: 587)
- `EMAIL_HOST_USER`: SMTP username
- `EMAIL_HOST_PASSWORD`: SMTP password
- `RABBITMQ_HOST`: RabbitMQ host (default: rabbitmq)
- `RABBITMQ_PORT`: RabbitMQ port (default: 5672)
- `RABBITMQ_USER`: RabbitMQ username (default: guest)
- `RABBITMQ_PASSWORD`: RabbitMQ password (default: guest)

## Development

1. Build and run the service:
   ```bash
   docker-compose up --build
   ```

2. Access the service at: `http://localhost:8006`

3. Access RabbitMQ management interface at: `http://localhost:15672`
   - Username: guest
   - Password: guest 