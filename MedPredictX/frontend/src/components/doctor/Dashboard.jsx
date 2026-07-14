import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../common/Layout';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const isVerified = user?.profile?.is_verified;
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`${API_URL}/appointments/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats from appointments
    const today = new Date().toDateString();
    const uniquePatients = new Set(appointments.map(apt => apt.patient)).size;
    const todaysAppointments = appointments.filter(apt =>
        new Date(apt.appointment_date).toDateString() === today
    ).length;
    const pendingConsultations = appointments.filter(apt =>
        apt.status === 'PENDING'
    ).length;
    const completedToday = appointments.filter(apt =>
        apt.status === 'COMPLETED' && new Date(apt.appointment_date).toDateString() === today
    ).length;

    const stats = [
        { label: 'Total Patients', value: uniquePatients.toString(), color: '#17A2B8', bg: '#D1ECF1' },
        { label: 'Today\'s Appointments', value: todaysAppointments.toString(), color: '#10B981', bg: '#ECFDF5' },
        { label: 'Pending Consultations', value: pendingConsultations.toString(), color: '#F59E0B', bg: '#FFFBEB' },
        { label: 'Completed Today', value: completedToday.toString(), color: '#8B5CF6', bg: '#F5F3FF' },
    ];

    return (
        <Layout>
            <div>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '1.875rem',
                        fontWeight: '700',
                        color: '#111827',
                        marginBottom: '0.5rem'
                    }}>
                        Doctor Dashboard
                    </h1>
                    <p style={{ fontSize: '1rem', color: '#6B7280' }}>
                        Manage your patients and consultations
                    </p>
                </div>

                {/* Verification Alert (only if not verified) */}
                {!isVerified && (
                    <div style={{
                        backgroundColor: '#FFFBEB',
                        border: '1px solid #FCD34D',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'start',
                        gap: '0.75rem'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                        <div>
                            <div style={{ fontWeight: '600', color: '#92400E', marginBottom: '0.25rem' }}>
                                Account Verification Pending
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#78350F' }}>
                                Your doctor account is under review. You'll be able to access full features once verified by our admin team.
                            </div>
                        </div>
                    </div>
                )}

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

                {/* Quick Actions */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {/* Today's Schedule */}
                    <div style={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        padding: '1.5rem'
                    }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                            Today's Schedule
                        </h3>
                        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#6B7280' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
                            <p style={{ fontSize: '0.875rem' }}>
                                {todaysAppointments > 0
                                    ? `${todaysAppointments} appointment${todaysAppointments > 1 ? 's' : ''} scheduled`
                                    : 'No appointments scheduled for today'}
                            </p>
                        </div>
                    </div>

                    {/* Recent Consultations */}
                    <div style={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        padding: '1.5rem'
                    }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                            Recent Consultations
                        </h3>
                        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#6B7280' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
                            <p style={{ fontSize: '0.875rem' }}>
                                {appointments.length > 0
                                    ? `${appointments.length} total consultation${appointments.length > 1 ? 's' : ''}`
                                    : 'No recent consultations'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DoctorDashboard;

