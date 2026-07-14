import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PatientDashboard from './components/patient/Dashboard';
import DoctorDashboard from './components/doctor/Dashboard';
import AdminDashboard from './components/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { LandingPage } from './components/LandingPage';
import { Services } from './components/Services';
import { AboutUs } from './components/AboutUs';
import { TriageHub } from './components/TriageHub';
import { Consult } from './components/Consult';
import { Settings } from './components/Settings';
import MedicalRecords from './components/MedicalRecords';
import { Toaster } from './components/ui/sonner';

// Role-based dashboard router
function DashboardRouter() {
  const { user } = useAuth();

  if (!user || !user.profile) {
    return <Navigate to="/login" replace />;
  }

  const role = user.profile.role;

  // Route to appropriate dashboard based on role
  if (role === 'PATIENT') {
    return <PatientDashboard />;
  } else if (role === 'DOCTOR') {
    return <DoctorDashboard />;
  } else if (role === 'ADMIN') {
    return <AdminDashboard />;
  }

  // Fallback to patient dashboard
  return <PatientDashboard />;
}


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/triage"
            element={
              <ProtectedRoute>
                <TriageHub />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consult"
            element={
              <ProtectedRoute>
                <Consult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/records"
            element={
              <ProtectedRoute>
                <MedicalRecords />
              </ProtectedRoute>
            }
          />


          {/* Redirect unknown routes to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}