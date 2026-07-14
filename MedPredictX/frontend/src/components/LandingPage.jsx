import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-200 px-6 py-4"
        style={{ flexShrink: 0 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">MedPredictX</span>
            <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V14M2 8H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <nav className="flex items-center gap-8">
            <button onClick={() => navigate("/services")} className="text-gray-600 hover:text-teal-500 transition-colors font-medium">
              Services
            </button>
            <button onClick={() => navigate("/about")} className="text-gray-600 hover:text-teal-500 transition-colors font-medium">
              About Us
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors font-medium"
            >
              Login
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main style={{ flex: 1, width: '100%', maxWidth: '80rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Healthcare,
              <br />
              <span className="text-teal-500">Simplified</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Experience optimal health with AI-powered predictions, expert consultations,
              and comprehensive health tracking - all in one place!
            </p>
            <motion.div
              className="flex items-center gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                onClick={() => navigate("/register")}
                className="bg-teal-500 text-white px-8 py-4 text-lg hover:bg-teal-600 transition-all duration-300 hover:scale-105 rounded-lg"
              >
                Get Started →
              </Button>
              <Button
                onClick={() => navigate("/login")}
                className="bg-white border-2 border-teal-500 text-teal-500 px-8 py-4 text-lg hover:bg-teal-50 transition-all duration-300 hover:scale-105 rounded-lg"
              >
                Sign In
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            className="relative"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative w-full h-96 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-blue-100 rounded-3xl transform rotate-6"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-12 w-full transform hover:scale-105 transition-transform duration-300">
                <div className="text-9xl mb-6 text-center">🏥</div>
                <h3 className="text-3xl font-bold text-gray-900 text-center mb-3">Healthcare Excellence</h3>
                <p className="text-gray-600 text-center text-lg">Powered by AI & Expert Care</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Features */}
        <motion.div
          className="mt-32 grid grid-cols-1 md:grid-cols-4 gap-6"
          style={{ marginBottom: '4rem' }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center p-8 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🔮</div>
            <h3 className="font-bold text-gray-900 mb-2">AI Predictions</h3>
            <p className="text-gray-600 text-sm">ML-powered health insights</p>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">👨‍⚕️</div>
            <h3 className="font-bold text-gray-900 mb-2">Expert Doctors</h3>
            <p className="text-gray-600 text-sm">Verified specialists</p>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-gray-900 mb-2">Health Tracking</h3>
            <p className="text-gray-600 text-sm">BMI, BP, Glucose</p>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="font-bold text-gray-900 mb-2">Digital Records</h3>
            <p className="text-gray-600 text-sm">Secure & accessible 24/7</p>
          </div>
        </motion.div>
      </main>

      {/* Footer - always at bottom */}
      <footer style={{ backgroundColor: '#111827', color: 'white', padding: '3rem 0', flexShrink: 0, marginTop: 'auto' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#9CA3AF' }}>© 2024 MedPredictX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}