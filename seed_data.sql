-- Use the appropriate databases
USE patient_db;
USE doctor_db;

-- Seed data for doctors
INSERT INTO doctors (first_name, last_name, email, phone_number, specialization, license_number, years_of_experience, department, created_at, updated_at)
VALUES
    ('John', 'Smith', 'john.smith@hospital.com', '+1234567890', 'Cardiology', 'MD123456', 10, 'Cardiology', NOW(), NOW()),
    ('Sarah', 'Johnson', 'sarah.johnson@hospital.com', '+1234567891', 'Neurology', 'MD123457', 8, 'Neurology', NOW(), NOW()),
    ('Michael', 'Chen', 'michael.chen@hospital.com', '+1234567892', 'Pediatrics', 'MD123458', 12, 'Pediatrics', NOW(), NOW()),
    ('Emily', 'Davis', 'emily.davis@hospital.com', '+1234567893', 'Orthopedics', 'MD123459', 15, 'Orthopedics', NOW(), NOW()),
    ('David', 'Wilson', 'david.wilson@hospital.com', '+1234567894', 'Dermatology', 'MD123460', 7, 'Dermatology', NOW(), NOW());

-- Seed data for patients
INSERT INTO patients (first_name, last_name, email, phone_number, date_of_birth, gender, address, medical_history, created_at, updated_at)
VALUES
    ('Alice', 'Brown', 'alice.brown@email.com', '+1987654321', '1990-05-15', 'FEMALE', '123 Main St, City', 'No significant medical history', NOW(), NOW()),
    ('Robert', 'Taylor', 'robert.taylor@email.com', '+1987654322', '1985-08-22', 'MALE', '456 Oak Ave, Town', 'Hypertension', NOW(), NOW()),
    ('Maria', 'Garcia', 'maria.garcia@email.com', '+1987654323', '1995-03-10', 'FEMALE', '789 Pine Rd, Village', 'Asthma', NOW(), NOW()),
    ('James', 'Anderson', 'james.anderson@email.com', '+1987654324', '1978-11-30', 'MALE', '321 Elm St, City', 'Type 2 Diabetes', NOW(), NOW()),
    ('Lisa', 'Martinez', 'lisa.martinez@email.com', '+1987654325', '1992-07-18', 'FEMALE', '654 Maple Dr, Town', 'No significant medical history', NOW(), NOW()),
    ('William', 'Thompson', 'william.thompson@email.com', '+1987654326', '1982-04-25', 'MALE', '987 Cedar Ln, Village', 'Arthritis', NOW(), NOW()),
    ('Emma', 'White', 'emma.white@email.com', '+1987654327', '1998-09-12', 'FEMALE', '147 Birch St, City', 'No significant medical history', NOW(), NOW()),
    ('Daniel', 'Lee', 'daniel.lee@email.com', '+1987654328', '1975-12-05', 'MALE', '258 Spruce Ave, Town', 'Heart Disease', NOW(), NOW()),
    ('Sophia', 'Clark', 'sophia.clark@email.com', '+1987654329', '1993-06-28', 'FEMALE', '369 Willow Rd, Village', 'Migraine', NOW(), NOW()),
    ('Matthew', 'Rodriguez', 'matthew.rodriguez@email.com', '+1987654330', '1988-02-14', 'MALE', '741 Ash St, City', 'No significant medical history', NOW(), NOW()); 