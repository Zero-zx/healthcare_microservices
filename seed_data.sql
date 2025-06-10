-- Use the appropriate databases

-- USE doctor_db;-- 

-- -- Seed data for doctors and patients

-- -- Insert doctors
-- INSERT INTO doctor_doctor (id, user_id, specialization, license_number, years_of_experience, education, certifications, languages, created_at, updated_at)
-- VALUES
--     (1, 1, 'Cardiology', 'MD323456', 10, 'Harvard Medical School', 'Board Certified in Cardiology', 'English, Spanish', NOW(), NOW()),
--     (2, 2, 'Neurology', 'MD123457', 8, 'Johns Hopkins University', 'Board Certified in Neurology', 'English, French', NOW(), NOW()),
--     (3, 3, 'Pediatrics', 'MD123458', 12, 'Stanford Medical School', 'Board Certified in Pediatrics', 'English, Mandarin', NOW(), NOW()),
--     (4, 4, 'Orthopedics', 'MD123459', 15, 'Mayo Clinic School of Medicine', 'Board Certified in Orthopedics', 'English, German', NOW(), NOW()),
--     (5, 5, 'Dermatology', 'MD123460', 7, 'Yale School of Medicine', 'Board Certified in Dermatology', 'English, Italian', NOW(), NOW()),
--     (6, 6, 'Psychiatry', 'MD123461', 9, 'Columbia University', 'Board Certified in Psychiatry', 'English, Russian', NOW(), NOW()),
--     (7, 7, 'Ophthalmology', 'MD123462', 11, 'UCLA Medical School', 'Board Certified in Ophthalmology', 'English, Japanese', NOW(), NOW()),
--     (8, 8, 'Gynecology', 'MD123463', 13, 'Duke University', 'Board Certified in Gynecology', 'English, Portuguese', NOW(), NOW()),
--     (9, 9, 'Urology', 'MD123464', 6, 'University of Michigan', 'Board Certified in Urology', 'English, Arabic', NOW(), NOW()),
--     (10, 10, 'Endocrinology', 'MD123465', 14, 'University of Pennsylvania', 'Board Certified in Endocrinology', 'English, Korean', NOW(), NOW());

USE doctor_db;
-- Seed data for doctors
INSERT INTO doctor_doctor (id, user_id, name, specialization, license_number, years_of_experience, education, certifications, languages, created_at, updated_at)
VALUES
    ('1', '1', 'Dr. John Smith', 'Cardiology', 'MD323456', 10, 'Harvard Medical School', 'Board Certified in Cardiology', 'English, Spanish', NOW(), NOW()),
    ('2', '2', 'Dr. Jane Doe', 'Neurology', 'MD123457', 8, 'Johns Hopkins University', 'Board Certified in Neurology', 'English, French', NOW(), NOW()),
    ('3', '3', 'Dr. Alice Johnson', 'Pediatrics', 'MD123458', 12, 'Stanford Medical School', 'Board Certified in Pediatrics', 'English, Mandarin', NOW(), NOW()),
    ('4', '4', 'Dr. Bob Wilson', 'Orthopedics', 'MD123459', 15, 'Mayo Clinic School of Medicine', 'Board Certified in Orthopedics', 'English, German', NOW(), NOW()),
    ('5', '5', 'Dr. Carol Brown', 'Dermatology', 'MD123460', 7, 'Yale School of Medicine', 'Board Certified in Dermatology', 'English, Italian', NOW(), NOW()),
    ('6', '6', 'Dr. David Lee', 'Psychiatry', 'MD123461', 9, 'Columbia University', 'Board Certified in Psychiatry', 'English, Russian', NOW(), NOW()),
    ('7', '7', 'Dr. Eve Davis', 'Ophthalmology', 'MD123462', 11, 'UCLA Medical School', 'Board Certified in Ophthalmology', 'English, Japanese', NOW(), NOW()),
    ('8', '8', 'Dr. Frank Miller', 'Gynecology', 'MD123463', 13, 'Duke University', 'Board Certified in Gynecology', 'English, Portuguese', NOW(), NOW()),
    ('9', '9', 'Dr. Grace Taylor', 'Urology', 'MD123464', 6, 'University of Michigan', 'Board Certified in Urology', 'English, Arabic', NOW(), NOW()),
    ('10', '10', 'Dr. Henry Clark', 'Endocrinology', 'MD123465', 14, 'University of Pennsylvania', 'Board Certified in Endocrinology', 'English, Korean', NOW(), NOW());

USE patient_db;
-- Seed data for patients
INSERT INTO patients_patient (id, user_id, name, age, gender, phone, address, medical_history, patient_type, preferred_contact_method, timezone, created_at, updated_at)
VALUES
    ('1', '11', 'Alice Brown', 32, 'FEMALE', '+1987654321', '123 Main St, Boston, MA', 'No significant medical history', 'CURRENT', 'EMAIL', 'America/New_York', NOW(), NOW()),
    ('2', '12', 'Robert Taylor', 37, 'MALE', '+1987654322', '456 Oak Ave, Chicago, IL', 'Hypertension', 'CHRONIC', 'PHONE', 'America/Chicago', NOW(), NOW()),
    ('3', '13', 'Maria Garcia', 27, 'FEMALE', '+1987654323', '789 Pine Rd, Miami, FL', 'Asthma', 'REMOTE', 'SMS', 'America/New_York', NOW(), NOW()),
    ('4', '14', 'James Anderson', 44, 'MALE', '+1987654324', '321 Elm St, Seattle, WA', 'Type 2 Diabetes', 'EMERGENCY', 'EMAIL', 'America/Los_Angeles', NOW(), NOW()),
    ('5', '15', 'Lisa Martinez', 30, 'FEMALE', '+1987654325', '654 Maple Dr, Denver, CO', 'No significant medical history', 'PREVENTIVE', 'PHONE', 'America/Denver', NOW(), NOW()),
    ('6', '16', 'William Thompson', 40, 'MALE', '+1987654326', '987 Cedar Ln, Phoenix, AZ', 'Arthritis', 'REFERRAL', 'SMS', 'America/Phoenix', NOW(), NOW()),
    ('7', '17', 'Emma White', 24, 'FEMALE', '+1987654327', '147 Birch St, Portland, OR', 'No significant medical history', 'CURRENT', 'EMAIL', 'America/Los_Angeles', NOW(), NOW()), 
    ('8', '18', 'Daniel Lee', 47, 'MALE', '+1987654328', '258 Spruce Ave, Houston, TX', 'Heart Disease', 'REMOTE', 'PHONE', 'America/Chicago', NOW(), NOW()),
    ('9', '19', 'Sophia Clark', 29, 'FEMALE', '+1987654329', '369 Willow Rd, Atlanta, GA', 'Migraine', 'EMERGENCY', 'SMS', 'America/New_York', NOW(), NOW()),
    ('10', '20', 'Matthew Rodriguez', 34, 'MALE', '+1987654330', '741 Ash St, San Diego, CA', 'No significant medical history', 'PREVENTIVE', 'EMAIL', 'America/Los_Angeles', NOW(), NOW()),
    ('11', '21', 'Olivia Wilson', 31, 'FEMALE', '+1987654331', '852 Oak St, Austin, TX', 'Anxiety', 'CURRENT', 'PHONE', 'America/Chicago', NOW(), NOW()),
    ('12', '22', 'Ethan Moore', 38, 'MALE', '+1987654332', '963 Pine Ave, Nashville, TN', 'High Cholesterol', 'REFERRAL', 'EMAIL', 'America/Chicago', NOW(), NOW()),
    ('13', '23', 'Ava Jackson', 26, 'FEMALE', '+1987654333', '159 Maple Rd, Las Vegas, NV', 'No significant medical history', 'EMERGENCY', 'EMAIL', 'America/Los_Angeles', NOW(), NOW()),
    ('14', '24', 'Noah Martin', 42, 'MALE', '+1987654334', '357 Cedar St, Philadelphia, PA', 'Sleep Apnea', 'REFERRAL', 'PHONE', 'America/New_York', NOW(), NOW()),
    ('15', '25', 'Isabella Thompson', 28, 'FEMALE', '+1987654335', '486 Birch Ave, San Francisco, CA', 'No significant medical history', 'PREVENTIVE', 'SMS', 'America/Los_Angeles', NOW(), NOW()),
    ('16', '26', 'Liam Davis', 45, 'MALE', '+1987654336', '753 Willow St, Washington, DC', 'Hypertension', 'CHRONIC', 'EMAIL', 'America/New_York', NOW(), NOW()),
    ('17', '27', 'Mia Anderson', 33, 'FEMALE', '+1987654337', '951 Elm Rd, Dallas, TX', 'No significant medical history', 'REMOTE', 'PHONE', 'America/Chicago', NOW(), NOW()),
    ('18', '28', 'Lucas Wilson', 39, 'MALE', '+1987654338', '264 Spruce Ave, Minneapolis, MN', 'Type 1 Diabetes', 'CHRONIC', 'SMS', 'America/Chicago', NOW(), NOW()),
    ('19', '29', 'Charlotte Brown', 25, 'FEMALE', '+1987654339', '852 Oak St, Portland, ME', 'No significant medical history', 'PREVENTIVE', 'EMAIL', 'America/New_York', NOW(), NOW()),
    ('20', '30', 'Mason Taylor', 36, 'MALE', '+1987654340', '963 Pine Rd, Salt Lake City, UT', 'Asthma', 'EMERGENCY', 'PHONE', 'America/Denver', NOW(), NOW());