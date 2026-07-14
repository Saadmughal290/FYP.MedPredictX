-- Create database for MedPredictX
CREATE DATABASE medpredictx;

-- Create user for the application
CREATE USER medpredictx_user WITH PASSWORD 'medpredict2026!';

-- Configure user settings
ALTER ROLE medpredictx_user SET client_encoding TO 'utf8';
ALTER ROLE medpredictx_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE medpredictx_user SET timezone TO 'UTC';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE medpredictx TO medpredictx_user;

-- For PostgreSQL 15+, also need to grant schema privileges
\c medpredictx
GRANT ALL ON SCHEMA public TO medpredictx_user;
