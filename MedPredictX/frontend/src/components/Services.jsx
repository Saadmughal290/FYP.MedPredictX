import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function Services() {
    const navigate = useNavigate();

    const services = [
        {
            icon: "🔮",
            title: "AI Disease Prediction",
            description: "Our advanced machine learning algorithms analyze your symptoms and medical history to predict potential health issues before they become serious.",
            features: [
                "Symptom-based analysis",
                "Real-time predictions",
                "Evidence-based recommendations",
                "Continuous learning AI"
            ]
        },
        {
            icon: "👨‍⚕️",
            title: "Doctor Consultations",
            description: "Connect with verified medical specialists for professional consultations. Book appointments, manage your healthcare journey, and get expert advice.",
            features: [
                "Verified specialists",
                "Easy appointment booking",
                "Secure consultations",
                "Follow-up care"
            ]
        },
        {
            icon: "📊",
            title: "Health Metrics Tracking",
            description: "Monitor your vital health metrics including BMI, blood pressure, and glucose levels with comprehensive analytics and historical tracking.",
            features: [
                "BMI calculation",
                "Blood pressure monitoring",
                "Glucose level tracking",
                "Trend analysis"
            ]
        },
        {
            icon: "📋",
            title: "Medical Records",
            description: "Secure digital storage of your complete medical history. Access your records anytime, anywhere with bank-level encryption.",
            features: [
                "Cloud-based storage",
                "24/7 accessibility",
                "Encrypted security",
                "Easy sharing with doctors"
            ]
        }
    ];

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
                        <button onClick={() => navigate("/services")} className="text-teal-500 font-bold">
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
                        Our Services
                    </motion.h1>
                    <motion.p
                        className="text-xl max-w-3xl mx-auto"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Comprehensive healthcare solutions powered by cutting-edge technology and expert medical professionals
                    </motion.p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 min-h-[450px] flex flex-col"
                        >
                            <div className="text-6xl mb-5">{service.icon}</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed flex-grow">{service.description}</p>
                            <div className="space-y-3 mt-auto">
                                <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                                {service.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 leading-relaxed">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    className="mt-20 text-center bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-12"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
                    <p className="text-xl text-gray-600 mb-8">Join thousands of users managing their health with MedPredictX</p>
                    <button
                        onClick={() => navigate("/register")}
                        className="bg-teal-500 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-teal-600 transition-all duration-300 hover:scale-105"
                    >
                        Create Account →
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
