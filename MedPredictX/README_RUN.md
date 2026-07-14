# 🏥 MedPredictX — How to Run (Linux)

Everything you need to get the project running from scratch.

---

## ✅ Prerequisites

Make sure these are installed before starting:

```bash
# Check Python (need 3.12+)
python3 --version

# Check Node.js (need 20+)
node --version
npm --version

# Check PostgreSQL
psql --version
```

If PostgreSQL is not installed:
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## 🗄️ Step 1 — Set Up the Database (First Time Only)

Copy the SQL file to a location postgres can read, then run it:

```bash
cp /home/danu/Desktop/MedPredictX-main/MedPredictX/backend/setup_database.sql /tmp/setup_database.sql
chmod 644 /tmp/setup_database.sql
sudo -u postgres psql -f /tmp/setup_database.sql
```

> **Note:** When prompted for password, enter your **Linux login password** (not PostgreSQL password).

You should see:
```
CREATE DATABASE
CREATE ROLE
ALTER ROLE
ALTER ROLE
ALTER ROLE
GRANT
GRANT
```

---

## ⚙️ Step 2 — Backend Setup (First Time Only)

```bash
cd /home/danu/Desktop/MedPredictX-main/MedPredictX/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Convert requirements file (it's UTF-16 encoded) and install
iconv -f UTF-16 -t UTF-8 requirements.txt | tr -d '\r' > /tmp/requirements_utf8.txt
pip install -r /tmp/requirements_utf8.txt

# Run database migrations
python manage.py migrate
```

---

## 👤 Step 3 — Create Admin User (First Time Only)

```bash
cd /home/danu/Desktop/MedPredictX-main/MedPredictX/backend
source venv/bin/activate
python manage.py createsuperuser
```

Follow the prompts — enter a username, email (optional), and password.

---

## 🚀 Step 4 — Run the Project (Every Time)

You need **two terminal windows** open at the same time.

### Terminal 1 — Start the Backend

```bash
cd /home/danu/Desktop/MedPredictX-main/MedPredictX/backend
source venv/bin/activate
python manage.py runserver 8000
```

Backend runs at: **http://localhost:8000**

> ⚠️ **"That port is already in use"?** The backend is already running — no need to start it again. If you want to restart it fresh, first run: `fuser -k 8000/tcp`

### Terminal 2 — Start the Frontend

```bash
cd /home/danu/Desktop/MedPredictX-main/MedPredictX/frontend
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 🌐 URLs

| Page              | URL                              |
|-------------------|----------------------------------|
| 🏠 App Homepage   | http://localhost:3000            |
| 🔑 Django Admin   | http://localhost:8000/admin/     |
| 📡 API Root       | http://localhost:8000/api/       |
| ❤️ Health Check   | http://localhost:8000/api/health/|

---

## 🗃️ Viewing the Database

### Option 1 — Django Admin (Recommended, Browser-Based)
Go to: **http://localhost:8000/admin/**
Log in with the superuser credentials you created in Step 3.

### Option 2 — psql (Command Line)
```bash
sudo -u postgres psql -d medpredictx
```

Useful psql commands:
```sql
\dt              -- list all tables
\d tablename     -- describe a table
SELECT * FROM api_user;   -- view all users
\q               -- quit
```

### Option 3 — Install pgAdmin (Full GUI)
```bash
sudo apt install pgadmin4
```
Then open **http://localhost/pgadmin4** in your browser.

---

## 🔧 Troubleshooting

### Backend won't start — "connection refused" or DB error
Make sure PostgreSQL is running:
```bash
sudo systemctl start postgresql
sudo systemctl status postgresql
```

### "Module not found" errors
Make sure the virtual environment is activated:
```bash
source venv/bin/activate
```

### Port already in use
```bash
# Kill whatever is using port 8000
sudo fuser -k 8000/tcp

# Kill whatever is using port 3000
sudo fuser -k 3000/tcp
```

### Frontend npm errors
```bash
cd /home/danu/Desktop/MedPredictX-main/MedPredictX/frontend
rm -rf node_modules
npm install
npm run dev
```

---

## 📁 Project Structure

```
MedPredictX/
├── README.md               # General project info
├── README_RUN.md           # ← This file (how to run)
├── backend/                # Django REST API
│   ├── api/                # API endpoints, models, views
│   ├── medpredictx_backend/# Django config (settings, urls)
│   ├── venv/               # Python virtual environment
│   ├── manage.py           # Django management tool
│   └── requirements.txt    # Python dependencies
└── frontend/               # React + Vite app
    ├── src/                # React components
    ├── package.json        # Node dependencies
    └── vite.config.js      # Vite configuration
```

---

## 🗝️ Database Credentials

| Field    | Value             |
|----------|-------------------|
| Host     | localhost         |
| Port     | 5432              |
| Database | medpredictx       |
| User     | medpredictx_user  |
| Password | medpredict2026!   |
