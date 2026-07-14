# PostgreSQL Database Setup Instructions

## Quick Setup Steps

Please run these commands in your terminal to create the database:

### Step 1: Run the SQL Setup Script

```powershell
cd backend
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -f setup_database.sql
```

When prompted for password, enter the postgres password you set during installation.

### Step 2: Run Django Migrations

After the database is created, run:

```powershell
.\venv\Scripts\activate
python manage.py migrate
```

### Step 3: Create Admin User

```powershell
python manage.py createsuperuser
```

### Step 4: Start the Server

```powershell
python manage.py runserver 8000
```

---

## If you get errors:

**Connection refused**: Make sure PostgreSQL service is running:
```powershell
Get-Service postgresql*
```

**Authentication failed**: Double-check the password in `backend\.env` file

**Database does not exist**: Run Step 1 again to create the database
