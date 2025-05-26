-- Clear existing data
DELETE FROM patients_patient;
DELETE FROM patients_user;

-- Insert Users (Patients and Doctors)
INSERT INTO patients_user (id, email, password, role, is_active, created_at, updated_at)
VALUES
    -- Admin user
    ('11111111-1111-1111-1111-111111111111', 'admin@healthcare.com', 'pbkdf2_sha256$600000$hashed_password', 'admin', true, NOW(), NOW()),
    
    -- Doctor users
    ('22222222-2222-2222-2222-222222222222', 'dr.smith@healthcare.com', 'pbkdf2_sha256$600000$hashed_password', 'doctor', true, NOW(), NOW()),
    ('33333333-3333-3333-3333-333333333333', 'dr.johnson@healthcare.com', 'pbkdf2_sha256$600000$hashed_password', 'doctor', true, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444444', 'dr.williams@healthcare.com', 'pbkdf2_sha256$600000$hashed_password', 'doctor', true, NOW(), NOW()),
    
    -- Patient users
    ('55555555-5555-5555-5555-555555555555', 'john.doe@email.com', 'pbkdf2_sha256$600000$hashed_password', 'patient', true, NOW(), NOW()),
    ('66666666-6666-6666-6666-666666666666', 'jane.smith@email.com', 'pbkdf2_sha256$600000$hashed_password', 'patient', true, NOW(), NOW()),
    ('77777777-7777-7777-7777-777777777777', 'mike.johnson@email.com', 'pbkdf2_sha256$600000$hashed_password', 'patient', true, NOW(), NOW()),
    ('88888888-8888-8888-8888-888888888888', 'sarah.williams@email.com', 'pbkdf2_sha256$600000$hashed_password', 'patient', true, NOW(), NOW()),
    ('99999999-9999-9999-9999-999999999999', 'david.brown@email.com', 'pbkdf2_sha256$600000$hashed_password', 'patient', true, NOW(), NOW());

-- Insert Patient Profiles
INSERT INTO patients_patient (user_id, name, age, gender, phone, address, medical_history, patient_type, preferred_contact_method, timezone, created_at, updated_at)
VALUES
    ('55555555-5555-5555-5555-555555555555', 'John Doe', 35, 'male', '+1234567890', '123 Main St, City', 'Hypertension, Allergies', 'remote', 'email', 'America/New_York', NOW(), NOW()),
    ('66666666-6666-6666-6666-666666666666', 'Jane Smith', 28, 'female', '+1234567891', '456 Oak Ave, Town', 'Asthma', 'offline', 'phone', 'America/Chicago', NOW(), NOW()),
    ('77777777-7777-7777-7777-777777777777', 'Mike Johnson', 42, 'male', '+1234567892', '789 Pine Rd, Village', 'Diabetes Type 2', 'remote', 'video', 'America/Los_Angeles', NOW(), NOW()),
    ('88888888-8888-8888-8888-888888888888', 'Sarah Williams', 31, 'female', '+1234567893', '321 Elm St, City', 'None', 'guest', 'email', 'America/New_York', NOW(), NOW()),
    ('99999999-9999-9999-9999-999999999999', 'David Brown', 45, 'male', '+1234567894', '654 Maple Dr, Town', 'Arthritis', 'offline', 'phone', 'America/Chicago', NOW(), NOW());

-- Insert Appointments (if you have an appointments table)
-- Note: Adjust the table name and fields according to your actual appointments model
INSERT INTO appointments_appointment (patient_id, doctor_id, appointment_date, status, notes, created_at, updated_at)
VALUES
    ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', NOW() + INTERVAL '1 day', 'scheduled', 'Regular checkup', NOW(), NOW()),
    ('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', NOW() + INTERVAL '2 days', 'scheduled', 'Follow-up consultation', NOW(), NOW()),
    ('77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', NOW() + INTERVAL '3 days', 'scheduled', 'Initial consultation', NOW(), NOW());

-- Insert Lab Results (if you have a lab results table)
-- Note: Adjust the table name and fields according to your actual lab results model
INSERT INTO lab_results_labresult (patient_id, test_name, result, test_date, notes, created_at, updated_at)
VALUES
    ('55555555-5555-5555-5555-555555555555', 'Blood Test', 'Normal', NOW() - INTERVAL '7 days', 'Regular checkup results', NOW(), NOW()),
    ('66666666-6666-6666-6666-666666666666', 'X-Ray', 'Clear', NOW() - INTERVAL '14 days', 'Chest X-Ray results', NOW(), NOW()),
    ('77777777-7777-7777-7777-777777777777', 'MRI', 'Normal', NOW() - INTERVAL '21 days', 'Brain MRI results', NOW(), NOW());

-- Insert Medical Records (if you have a medical records table)
-- Note: Adjust the table name and fields according to your actual medical records model
INSERT INTO medical_records_medicalrecord (patient_id, doctor_id, diagnosis, prescription, notes, created_at, updated_at)
VALUES
    ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Hypertension', 'Lisinopril 10mg', 'Regular checkup', NOW(), NOW()),
    ('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'Asthma', 'Albuterol inhaler', 'Follow-up', NOW(), NOW()),
    ('77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 'Diabetes Type 2', 'Metformin 500mg', 'Initial diagnosis', NOW(), NOW()); 