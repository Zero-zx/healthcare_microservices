USE patient_db;

CREATE TABLE IF NOT EXISTS patients_patient (
    user_id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    medical_history TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
); 

INSERT INTO patients_patient (user_id, name, age, gender, phone, email, address, medical_history, created_at, updated_at) VALUES
('1', 'John Doe', 30, 'Male', '1234567890', 'john.doe@example.com', '123 Main St, Anytown, USA', 'No medical history', NOW(), NOW());

INSERT INTO patients_patient (user_id, name, age, gender, phone, email, address, medical_history, created_at, updated_at) VALUES
('2', 'Jane Smith', 25, 'Female', '9876543210', 'jane.smith@example.com', '456 Oak Ave, Anytown, USA', 'No medical history', NOW(), NOW());

INSERT INTO patients_patient (user_id, name, age, gender, phone, email, address, medical_history, created_at, updated_at) VALUES
('3', 'Michael Brown', 40, 'Male', '5551234567', 'michael.brown@example.com', '789 Maple St, Anytown, USA', 'No medical history', NOW(), NOW());

INSERT INTO patients_patient (user_id, name, age, gender, phone, email, address, medical_history, created_at, updated_at) VALUES
('4', 'Emily Davis', 35, 'Female', '5557890123', 'emily.davis@example.com', '101 Pine St, Anytown, USA', 'No medical history', NOW(), NOW());


