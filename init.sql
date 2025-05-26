-- Create databases
CREATE DATABASE IF NOT EXISTS admin_db;
CREATE DATABASE IF NOT EXISTS doctor_db;
CREATE DATABASE IF NOT EXISTS patient_db;
CREATE DATABASE IF NOT EXISTS chatbot_db;

-- Create user if not exists and grant privileges
CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON admin_db.* TO 'user'@'%';
GRANT ALL PRIVILEGES ON doctor_db.* TO 'user'@'%';
GRANT ALL PRIVILEGES ON patient_db.* TO 'user'@'%';
GRANT ALL PRIVILEGES ON chatbot_db.* TO 'user'@'%';
GRANT ALL PRIVILEGES ON user_db.* TO 'user'@'%';

FLUSH PRIVILEGES; 