# MedPredictX

A disease prediction system using machine learning with a full-stack architecture.

## Project Structure

```
MedPredictX/
├── frontend/          # React + Vite frontend
│   ├── src/          # React components and logic
│   ├── index.html    # Entry HTML file
│   ├── package.json  # Node dependencies
│   └── vite.config.js # Vite configuration
│
└── backend/          # Django REST API backend
    ├── api/          # API application
    ├── medpredictx_backend/ # Django project config
    ├── venv/         # Python virtual environment
    ├── requirements.txt # Python dependencies
    └── manage.py     # Django management script
```

## Tech Stack

### Frontend
- **React.js** - UI framework
- **TailwindCSS** - Styling
- **Vite** - Build tool and dev server
- **Axios** - API communication

### Backend
- **Django** - Python web framework
- **Django REST Framework** - RESTful API
- **PostgreSQL** - Production database
- **CORS Headers** - Cross-origin support

### ML (Coming Soon)
- **scikit-learn** - Machine learning
- **pandas** - Data processing
- **numpy** - Numerical computing

## Getting Started

### Prerequisites
- Node.js 20+ (LTS)
- Python 3.12+
- Git

### Quick Start

#### 1. Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```
Frontend runs on: **http://localhost:3000**

#### 2. Backend Setup
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```
Backend runs on: **http://localhost:8000**

## API Endpoints

Base URL: `http://localhost:8000/api/`

- `/api/health/` - Health check
- `/api/info/` - API information
- `/admin/` - Django admin panel

## Development

- Frontend development server has hot reload
- Backend requires manual restart after code changes (or use `--reload` flag)
- Database changes require migrations: `python manage.py makemigrations && python manage.py migrate`

## Version Control

Repository includes `.gitignore` files to exclude:
- `node_modules/` (frontend)
- `venv/` (backend)
- `db.sqlite3` (database file)
- `.env` (environment variables)

## Authors

MedPredictX Team
