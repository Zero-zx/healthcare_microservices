# Generated by Django 3.2.23 on 2025-06-10 07:31

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.CharField(max_length=64, primary_key=True, serialize=False)),
                ('patient_id', models.CharField(max_length=64)),
                ('doctor_id', models.CharField(max_length=64)),
                ('date', models.DateField()),
                ('time', models.TimeField()),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('cancelled', 'Cancelled'), ('completed', 'Completed')], default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('notes', models.TextField(blank=True, null=True)),
                ('service_type', models.CharField(max_length=100)),
                ('duration', models.IntegerField(default=30, validators=[django.core.validators.MinValueValidator(15), django.core.validators.MaxValueValidator(240)])),
            ],
            options={
                'ordering': ['date', 'time'],
            },
        ),
        migrations.AddIndex(
            model_name='appointment',
            index=models.Index(fields=['patient_id'], name='appointment_patient_06997f_idx'),
        ),
        migrations.AddIndex(
            model_name='appointment',
            index=models.Index(fields=['doctor_id'], name='appointment_doctor__422124_idx'),
        ),
        migrations.AddIndex(
            model_name='appointment',
            index=models.Index(fields=['date', 'time'], name='appointment_date_f01182_idx'),
        ),
        migrations.AddIndex(
            model_name='appointment',
            index=models.Index(fields=['status'], name='appointment_status_e5f18c_idx'),
        ),
    ]
