-- Create doctor database and table
CREATE DATABASE IF NOT EXISTS doctor_db;
USE doctor_db;

CREATE TABLE IF NOT EXISTS doctor_doctor (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    years_of_experience INT NOT NULL,
    education TEXT NOT NULL,
    certifications TEXT,
    languages VARCHAR(200) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- Create patient database and table
CREATE DATABASE IF NOT EXISTS patient_db;
USE patient_db;

CREATE TABLE IF NOT EXISTS patients_patient (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    medical_history TEXT,
    patient_type VARCHAR(20) NOT NULL,
    preferred_contact_method VARCHAR(20),
    timezone VARCHAR(50),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- Seed data for doctors
USE doctor_db;
-- Update the seed data with role-based specializations
INSERT INTO doctor_doctor (id, email, name, specialization, license_number, years_of_experience, education, certifications, languages, created_at, updated_at)
VALUES
    -- General Practitioners (GPs)
    ('1', 'dr.smith@hospital.com', 'Dr. John Smith', 'General Practitioner', 'MD323456', 10, 'Harvard Medical School', 'Board Certified in Family Medicine', 'English, Spanish', NOW(), NOW()),
    ('2', 'dr.doe@hospital.com', 'Dr. Jane Doe', 'General Practitioner', 'MD123457', 8, 'Johns Hopkins University', 'Board Certified in Primary Care', 'English, French', NOW(), NOW()),
    
    -- Specialists
    ('3', 'dr.johnson@hospital.com', 'Dr. Alice Johnson', 'Pediatrics Specialist', 'MD123458', 12, 'Stanford Medical School', 'Board Certified in Pediatrics', 'English, Mandarin', NOW(), NOW()),
    ('4', 'dr.wilson@hospital.com', 'Dr. Bob Wilson', 'Orthopedics Specialist', 'MD123459', 15, 'Mayo Clinic School of Medicine', 'Board Certified in Orthopedics', 'English, German', NOW(), NOW()),
    ('5', 'dr.brown@hospital.com', 'Dr. Carol Brown', 'Dermatology Specialist', 'MD123460', 7, 'Yale School of Medicine', 'Board Certified in Dermatology', 'English, Italian', NOW(), NOW()),
    ('6', 'dr.lee@hospital.com', 'Dr. David Lee', 'Psychiatry Specialist', 'MD123461', 9, 'Columbia University', 'Board Certified in Psychiatry', 'English, Russian', NOW(), NOW()),
    
    -- Surgeons
    ('7', 'dr.davis@hospital.com', 'Dr. Eve Davis', 'Ophthalmology Surgeon', 'MD123462', 11, 'UCLA Medical School', 'Board Certified in Ophthalmology', 'English, Japanese', NOW(), NOW()),
    ('8', 'dr.miller@hospital.com', 'Dr. Frank Miller', 'Gynecology Surgeon', 'MD123463', 13, 'Duke University', 'Board Certified in Gynecology', 'English, Portuguese', NOW(), NOW()),
    ('9', 'dr.taylor@hospital.com', 'Dr. Grace Taylor', 'Urology Surgeon', 'MD123464', 6, 'University of Michigan', 'Board Certified in Urology', 'English, Arabic', NOW(), NOW()),
    ('10', 'dr.clark@hospital.com', 'Dr. Henry Clark', 'Endocrinology Specialist', 'MD123465', 14, 'University of Pennsylvania', 'Board Certified in Endocrinology', 'English, Korean', NOW(), NOW());
-- Seed data for patients
USE patient_db;
INSERT INTO patients_patient (id, email, name, age, gender, phone, address, medical_history, patient_type, preferred_contact_method, timezone, created_at, updated_at)
VALUES
    ('1', 'alice.brown@email.com', 'Alice Brown', 32, 'female', '+1987654321', '123 Main St, Boston, MA', 'No significant medical history', 'normal', 'email', 'America/New_York', NOW(), NOW()),
    ('2', 'robert.taylor@email.com', 'Robert Taylor', 37, 'male', '+1987654322', '456 Oak Ave, Chicago, IL', 'Hypertension', 'normal', 'phone', 'America/Chicago', NOW(), NOW()),
    ('3', 'maria.garcia@email.com', 'Maria Garcia', 27, 'female', '+1987654323', '789 Pine Rd, Miami, FL', 'Asthma', 'remote', 'video', 'America/New_York', NOW(), NOW()),
    ('4', 'james.anderson@email.com', 'James Anderson', 44, 'male', '+1987654324', '321 Elm St, Seattle, WA', 'Type 2 Diabetes', 'vip', 'email', 'America/Los_Angeles', NOW(), NOW()),
    ('5', 'lisa.martinez@email.com', 'Lisa Martinez', 30, 'female', '+1987654325', '654 Maple Dr, Denver, CO', 'No significant medical history', 'normal', 'phone', 'America/Denver', NOW(), NOW()),
    ('6', 'william.thompson@email.com', 'William Thompson', 40, 'male', '+1987654326', '987 Cedar Ln, Phoenix, AZ', 'Arthritis', 'vip', 'video', 'America/Phoenix', NOW(), NOW()),
    ('7', 'emma.white@email.com', 'Emma White', 24, 'female', '+1987654327', '147 Birch St, Portland, OR', 'No significant medical history', 'normal', 'email', 'America/Los_Angeles', NOW(), NOW()), 
    ('8', 'daniel.lee@email.com', 'Daniel Lee', 47, 'male', '+1987654328', '258 Spruce Ave, Houston, TX', 'Heart Disease', 'remote', 'phone', 'America/Chicago', NOW(), NOW()),
    ('9', 'sophia.clark@email.com', 'Sophia Clark', 29, 'female', '+1987654329', '369 Willow Rd, Atlanta, GA', 'Migraine', 'vip', 'video', 'America/New_York', NOW(), NOW()),
    ('10', 'matthew.rodriguez@email.com', 'Matthew Rodriguez', 34, 'male', '+1987654330', '741 Ash St, San Diego, CA', 'No significant medical history', 'normal', 'email', 'America/Los_Angeles', NOW(), NOW()),
    ('11', 'olivia.wilson@email.com', 'Olivia Wilson', 31, 'female', '+1987654331', '852 Oak St, Austin, TX', 'Anxiety', 'normal', 'phone', 'America/Chicago', NOW(), NOW()),
    ('12', 'ethan.moore@email.com', 'Ethan Moore', 38, 'male', '+1987654332', '963 Pine Ave, Nashville, TN', 'High Cholesterol', 'vip', 'email', 'America/Chicago', NOW(), NOW()),
    ('13', 'ava.jackson@email.com', 'Ava Jackson', 26, 'female', '+1987654333', '159 Maple Rd, Las Vegas, NV', 'No significant medical history', 'normal', 'email', 'America/Los_Angeles', NOW(), NOW()),
    ('14', 'noah.martin@email.com', 'Noah Martin', 42, 'male', '+1987654334', '357 Cedar St, Philadelphia, PA', 'Sleep Apnea', 'remote', 'phone', 'America/New_York', NOW(), NOW()),
    ('15', 'isabella.thompson@email.com', 'Isabella Thompson', 28, 'female', '+1987654335', '486 Birch Ave, San Francisco, CA', 'No significant medical history', 'normal', 'video', 'America/Los_Angeles', NOW(), NOW()),
    ('16', 'liam.davis@email.com', 'Liam Davis', 45, 'male', '+1987654336', '753 Willow St, Washington, DC', 'Hypertension', 'vip', 'email', 'America/New_York', NOW(), NOW()),
    ('17', 'mia.anderson@email.com', 'Mia Anderson', 33, 'female', '+1987654337', '951 Elm Rd, Dallas, TX', 'No significant medical history', 'remote', 'phone', 'America/Chicago', NOW(), NOW()),
    ('18', 'lucas.wilson@email.com', 'Lucas Wilson', 39, 'male', '+1987654338', '264 Spruce Ave, Minneapolis, MN', 'Type 1 Diabetes', 'normal', 'video', 'America/Chicago', NOW(), NOW()),
    ('19', 'charlotte.brown@email.com', 'Charlotte Brown', 25, 'female', '+1987654339', '852 Oak St, Portland, ME', 'No significant medical history', 'normal', 'email', 'America/New_York', NOW(), NOW()),
    ('20', 'mason.taylor@email.com', 'Mason Taylor', 36, 'male', '+1987654340', '963 Pine Rd, Salt Lake City, UT', 'Asthma', 'vip', 'phone', 'America/Denver', NOW(), NOW());