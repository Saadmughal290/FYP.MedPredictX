import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../common/Layout';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const PatientDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [healthMetrics, setHealthMetrics] = useState({
        bmi: null,
        latestBP: null,
        latestGlucose: null,
        bpHistory: [],
        glucoseHistory: []
    });

    useEffect(() => {
        fetchAppointments();
        fetchHealthMetrics();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://localhost:8000/api/appointments/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Fetched appointments:', response.data);
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHealthMetrics = async () => {
        try {
            const token = localStorage.getItem('access_token');

            // Fetch user profile for BMI calculation
            const profileResponse = await axios.get('http://localhost:8000/api/profile/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userData = profileResponse.data;

            console.log('Fetched profile data:', userData); // Debug log

            // Access nested profile data
            const profileData = userData.profile || {};

            // Calculate BMI if height and weight available
            let bmi = null;
            if (profileData.height && profileData.weight) {
                const heightInMeters = profileData.height / 100;
                bmi = (profileData.weight / (heightInMeters * heightInMeters)).toFixed(1);
                console.log(`BMI calculated: ${bmi} (height: ${profileData.height}cm, weight: ${profileData.weight}kg)`);
            } else {
                console.log('BMI not calculated - missing height or weight:', profileData);
            }

            // Fetch medical records for vitals
            const recordsResponse = await axios.get('http://localhost:8000/api/medical-records/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const records = recordsResponse.data;

            // Extract BP and glucose data
            const bpRecords = records.filter(r => r.blood_pressure_systolic && r.blood_pressure_diastolic);
            const glucoseRecords = records.filter(r => r.glucose_level);

            setHealthMetrics({
                bmi,
                latestBP: bpRecords.length > 0 ? bpRecords[0] : null,
                latestGlucose: glucoseRecords.length > 0 ? glucoseRecords[0] : null,
                bpHistory: bpRecords.slice(0, 5),
                glucoseHistory: glucoseRecords.slice(0, 5)
            });
        } catch (error) {
            console.error('Error fetching health metrics:', error);
        }
    };


    // Calculate dynamic stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.appointment_date);
        const isUpcoming = (apt.status === 'PENDING' || apt.status === 'CONFIRMED') && aptDate >= today;
        console.log('Checking appointment:', apt.id, 'Status:', apt.status, 'Date:', apt.appointment_date, 'Parsed:', aptDate, 'Today:', today, 'Is upcoming:', isUpcoming);
        return isUpcoming;
    }).length;

    const completedConsultations = appointments.filter(apt =>
        apt.status === 'COMPLETED'
    ).length;

    console.log('Appointments:', appointments.length, 'Upcoming:', upcomingAppointments, 'Completed:', completedConsultations);

    const stats = [
        { label: 'Upcoming Appointments', value: upcomingAppointments.toString(), color: '#17A2B8', bg: '#D1ECF1' },
        { label: 'Completed Consultations', value: completedConsultations.toString(), color: '#10B981', bg: '#ECFDF5' },
        { label: 'Prescriptions', value: '0', color: '#8B5CF6', bg: '#F5F3FF' },
        { label: 'Health Records', value: '0', color: '#F59E0B', bg: '#FFFBEB' },
    ];

    const quickActions = [
        {
            title: 'Disease Predictor',
            description: 'AI-powered disease prediction based on symptoms',
            icon: '🔮',
            color: '#17A2B8',
            action: () => navigate('/predictor')
        },
        {
            title: 'Book Consultation',
            description: 'Schedule a consultation with a doctor',
            icon: '💬',
            color: '#10B981',
            action: () => navigate('/consult')
        },
        {
            title: 'View Medical Records',
            description: 'Access your complete medical history',
            icon: '📋',
            color: '#8B5CF6',
            action: () => navigate('/records')
        },
        {
            title: 'Settings',
            description: 'Manage your profile and preferences',
            icon: '⚙️',
            color: '#6B7280',
            action: () => navigate('/settings')
        },
    ];

    return (
        <Layout>
            <div>
                {/* Welcome Section */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '1.875rem',
                        fontWeight: '700',
                        color: '#111827',
                        marginBottom: '0.5rem'
                    }}>
                        Welcome back, {user?.first_name || user?.username}!
                    </h1>
                    <p style={{ fontSize: '1rem', color: '#6B7280' }}>
                        Here's your health overview
                    </p>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                padding: '1.5rem',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: stat.bg,
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1rem'
                            }}>
                                <span style={{ fontSize: '1.5rem', color: stat.color, fontWeight: '700' }}>
                                    {stat.value}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: '500' }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Health Metrics Section */}
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>
                        📊 Health Metrics
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {/* BMI Card */}
                        <div style={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '1.5rem'
                        }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                                BMI
                            </h3>
                            {healthMetrics.bmi ? (
                                <>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1rem'
                                    }}>
                                        <div style={{
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
                                            backgroundColor: '#17A2B8',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '2rem',
                                            fontWeight: '700'
                                        }}>
                                            {healthMetrics.bmi}
                                        </div>
                                    </div>
                                    <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6B7280' }}>
                                        {healthMetrics.bmi < 18.5 ? 'Underweight' :
                                            healthMetrics.bmi < 25 ? 'Normal' :
                                                healthMetrics.bmi < 30 ? 'Overweight' : 'Obese'}
                                    </p>
                                </>
                            ) : (
                                <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '2rem' }}>
                                    No data available. Add your height and weight in settings.
                                </p>
                            )}
                        </div>

                        {/* Blood Pressure Card */}
                        <div style={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '1.5rem'
                        }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                                Blood Pressure
                            </h3>
                            {healthMetrics.latestBP ? (
                                <>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{
                                            backgroundColor: '#FEF3C7',
                                            padding: '1rem',
                                            borderRadius: '6px',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#92400E' }}>
                                                {healthMetrics.latestBP.blood_pressure_systolic} / {healthMetrics.latestBP.blood_pressure_diastolic}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#92400E', marginTop: '0.25rem' }}>
                                                mmHg • {new Date(healthMetrics.latestBP.record_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    {healthMetrics.bpHistory.length > 1 && (
                                        <div>
                                            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', marginBottom: '0.5rem' }}>
                                                Recent Readings
                                            </h4>
                                            {healthMetrics.bpHistory.slice(1, 4).map((record, idx) => (
                                                <div key={idx} style={{
                                                    fontSize: '0.875rem',
                                                    color: '#374151',
                                                    padding: '0.5rem 0',
                                                    borderBottom: '1px solid #F3F4F6'
                                                }}>
                                                    <span style={{ fontWeight: '600' }}>
                                                        {record.blood_pressure_systolic}/{record.blood_pressure_diastolic}
                                                    </span>
                                                    <span style={{ color: '#9CA3AF', marginLeft: '0.5rem', fontSize: '0.75rem' }}>
                                                        {new Date(record.record_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '2rem' }}>
                                    No blood pressure readings yet.
                                </p>
                            )}
                        </div>

                        {/* Glucose Level Card */}
                        <div style={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '1.5rem'
                        }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                                Glucose Level
                            </h3>
                            {healthMetrics.latestGlucose ? (
                                <>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{
                                            backgroundColor: '#DBEAFE',
                                            padding: '1rem',
                                            borderRadius: '6px',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E40AF' }}>
                                                {healthMetrics.latestGlucose.glucose_level} mg/dL
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#1E40AF', marginTop: '0.25rem' }}>
                                                {healthMetrics.latestGlucose.glucose_measurement_type || 'Random'} • {new Date(healthMetrics.latestGlucose.record_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    {healthMetrics.glucoseHistory.length > 1 && (
                                        <div>
                                            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', marginBottom: '0.5rem' }}>
                                                Recent Readings
                                            </h4>
                                            {healthMetrics.glucoseHistory.slice(1, 4).map((record, idx) => (
                                                <div key={idx} style={{
                                                    fontSize: '0.875rem',
                                                    color: '#374151',
                                                    padding: '0.5rem 0',
                                                    borderBottom: '1px solid #F3F4F6'
                                                }}>
                                                    <span style={{ fontWeight: '600' }}>
                                                        {record.glucose_level} mg/dL
                                                    </span>
                                                    <span style={{ color: '#9CA3AF', marginLeft: '0.5rem', fontSize: '0.75rem' }}>
                                                        {new Date(record.record_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '2rem' }}>
                                    No glucose readings yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '1rem'
                    }}>
                        Quick Actions
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={action.action}
                                style={{
                                    backgroundColor: 'white',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'start',
                                    gap: '1rem'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = action.color;
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#E5E7EB';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    fontSize: '2rem',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: `${action.color}10`,
                                    borderRadius: '8px'
                                }}>
                                    {action.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: '#111827',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {action.title}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                        {action.description}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '1rem'
                    }}>
                        Recent Activity
                    </h2>
                    <div style={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        padding: '2rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                        <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                            No recent activity to display
                        </p>
                        <button
                            onClick={() => navigate('/predictor')}
                            style={{
                                backgroundColor: '#17A2B8',
                                color: 'white',
                                border: 'none',
                                padding: '0.625rem 1.25rem',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#17A2B8'}
                        >
                            Start Your First Prediction
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PatientDashboard;
