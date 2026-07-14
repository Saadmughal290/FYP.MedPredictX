import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function AboutUs() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                        <span className="text-2xl font-bold text-gray-900">MedPredictX</span>
                        <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 2V14M2 8H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                    <nav className="flex items-center gap-8">
                        <button onClick={() => navigate("/")} className="text-gray-600 hover:text-teal-500 transition-colors font-medium">
                            Home
                        </button>
                        <button onClick={() => navigate("/services")} className="text-gray-600 hover:text-teal-500 transition-colors font-medium">
                            Services
                        </button>
                        <button onClick={() => navigate("/about")} className="text-teal-500 font-bold">
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
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-teal-500 to-blue-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.h1
                        className="text-5xl font-bold mb-6"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        About MedPredictX
                    </motion.h1>
                    <motion.p
                        className="text-xl max-w-3xl mx-auto"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Revolutionizing healthcare through artificial intelligence and personalized medical care
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-2xl p-10 shadow-lg"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            At <strong className="text-teal-600">MedPredictX</strong>, our mission is to make quality healthcare
                            accessible, predictive, and proactive for everyone.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            We leverage cutting-edge artificial intelligence and machine learning to help you understand your
                            health better, predict potential issues before they become serious, and connect you with the right
                            medical professionals at the right time.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-10"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Vision</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            To transform healthcare delivery worldwide by combining the power of artificial intelligence
                            with compassionate human medical expertise.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            We envision a future where everyone has access to personalized, predictive healthcare that
                            empowers them to take control of their health journey.
                        </p>
                    </motion.div>
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-24"
                >
                    <div className="bg-white rounded-xl p-10 text-center shadow-lg hover:shadow-xl transition-shadow">
                        <div className="text-5xl font-bold text-teal-500 mb-5">AI-Powered</div>
                        <p className="text-gray-700 text-lg font-semibold mb-4">Disease Prediction</p>
                        <p className="text-gray-600 leading-relaxed">Advanced machine learning algorithms for accurate health predictions</p>
                    </div>
                    <div className="bg-white rounded-xl p-10 text-center shadow-lg hover:shadow-xl transition-shadow">
                        <div className="text-5xl font-bold text-teal-500 mb-5">24/7</div>
                        <p className="text-gray-700 text-lg font-semibold mb-4">Access to Records</p>
                        <p className="text-gray-600 leading-relaxed">Your medical history accessible anytime, anywhere</p>
                    </div>
                    <div className="bg-white rounded-xl p-10 text-center shadow-lg hover:shadow-xl transition-shadow">
                        <div className="text-5xl font-bold text-teal-500 mb-5">Verified</div>
                        <p className="text-gray-700 text-lg font-semibold mb-4">Medical Professionals</p>
                        <p className="text-gray-600 leading-relaxed">Connect with licensed and verified healthcare specialists</p>
                    </div>
                </motion.div>

                {/* Why Choose Us */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl p-8 md:p-12 shadow-xl"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose MedPredictX?</h2>
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="flex gap-4 items-start">
                            <div className="text-4xl flex-shrink-0">🎯</div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Accuracy & Precision</h3>
                                <p className="text-gray-600 leading-relaxed">Our AI models are trained on millions of medical cases for maximum accuracy</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="text-4xl flex-shrink-0">🔒</div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Security & Privacy</h3>
                                <p className="text-gray-600 leading-relaxed">Bank-level encryption ensures your medical data stays private and secure</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="text-4xl flex-shrink-0">⚡</div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Fast & Efficient</h3>
                                <p className="text-gray-600 leading-relaxed">Get instant predictions and quick access to healthcare professionals</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="text-4xl flex-shrink-0">💡</div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">User-Friendly</h3>
                                <p className="text-gray-600 leading-relaxed">Intuitive interface designed for seamless health management</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="mt-20 text-center bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-12"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Thousands of Happy Users</h2>
                    <p className="text-xl text-gray-600 mb-8">Start your journey to better health today with MedPredictX</p>
                    <button
                        onClick={() => navigate("/register")}
                        className="bg-teal-500 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-teal-600 transition-all duration-300 hover:scale-105"
                    >
                        Get Started Now →
                    </button>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 mt-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-gray-400">© 2024 MedPredictX. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
