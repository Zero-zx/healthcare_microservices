1. Ensure Docker Desktop is up and running
2. In terminal call
`cd services`
`django-admin startproject <service_name>`
3. In new folder you just created, make a new Dockerfile
```
FROM python:3.11.9

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install -r requirements.txt
RUN mkdir -p /app/staticfiles

COPY . /app/
```

4. Update in [docker-compose.yml](../docker-compose.yml), for example
```
  example_service:
    build: ./services/example_service
    container_name: example_service
    command: bash -c "python3 manage.py migrate --noinput && python3 manage.py collectstatic --noinput && python manage.py runserver 0.0.0.0:8000"
    volumes:
      - ./services/example_service:/app
    ports:
      - "8003:8000"
    depends_on:
      mysql_db:
        condition: service_healthy
```
5. Add requirements.txt to the folder, theses packages is essential
```
Django>=4.2,<5.0
djangorestframework>=3.14.0
mysqlclient>=2.1.0
django-environ>=0.10.0
drf-yasg==1.21.5
pyyaml>=6.0
uritemplate>=4.1.1
```

6. In settings.py, add
```
import os // In the top
...
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'drf_yasg',
]
...
// Incase use mysql database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'user_db',
        'USER': 'user',
        'PASSWORD': '123456',
        'HOST': 'mysql_db',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
        },
    }
}
...
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles') // Add this at last line
```

7. In urls.py, this is the template you can copy
```
from django.contrib import admin
from django.urls import path, re_path
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Example service Docs",
        default_version='v1',
        description="API documentation",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # DRF Yasg URLs
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    // More API on future developments
]
```

8. After that, simply run
`
docker-compose up --build
` and you good to go.