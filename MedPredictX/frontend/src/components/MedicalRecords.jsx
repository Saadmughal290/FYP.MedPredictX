import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './common/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MedicalRecords = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMedicalRecords();
    }, []);

    const fetchMedicalRecords = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://localhost:8000/api/medical-records/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecords(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching medical records:', err);
            setError('Failed to load medical records');
        } finally {
            setLoading(false);
        }
    };

    const getRecordTypeColor = (type) => {
        const colors = {
            'DIAGNOSIS': '#17A2B8',
            'LAB_RESULT': '#10B981',
            'PRESCRIPTION': '#8B5CF6',
            'IMAGING': '#F59E0B',
            'CONSULTATION': '#6B7280',
            'OTHER': '#9CA3AF'
        };
        return colors[type] || '#6B7280';
    };

    const getRecordTypeIcon = (type) => {
        const icons = {
            'DIAGNOSIS': '🏥',
            'LAB_RESULT': '🔬',
            'PRESCRIPTION': '💊',
            'IMAGING': '📷',
            'CONSULTATION': '👨‍⚕️',
            'OTHER': '📄'
        };
        return icons[type] || '📄';
    };

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
                        Medical Records
                    </h1>
                    <p style={{ fontSize: '1rem', color: '#6B7280' }}>
                        View your complete medical history and records
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            border: '4px solid #17A2B8',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 1rem'
                        }}></div>
                        <p style={{ color: '#6B7280' }}>Loading medical records...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div style={{
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <p style={{ color: '#DC2626', fontWeight: '500' }}>{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && records.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                            No Medical Records Yet
                        </h3>
                        <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                            Your medical records from consultations will appear here
                        </p>
                        <button
                            onClick={() => navigate('/consult')}
                            style={{
                                backgroundColor: '#17A2B8',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#138496'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#17A2B8'}
                        >
                            Book Consultation
                        </button>
                    </div>
                )}

                {/* Records List */}
                {!loading && !error && records.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {records.map((record) => (
                            <div
                                key={record.id}
                                style={{
                                    backgroundColor: 'white',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
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
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {/* Icon */}
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        backgroundColor: `${getRecordTypeColor(record.record_type)}20`,
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        flexShrink: 0
                                    }}>
                                        {getRecordTypeIcon(record.record_type)}
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                                                {record.title}
                                            </h3>
                                            <span style={{
                                                backgroundColor: `${getRecordTypeColor(record.record_type)}20`,
                                                color: getRecordTypeColor(record.record_type),
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                {record.record_type.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                                            {record.description}
                                        </p>

                                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#6B7280' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span>📅</span>
                                                <span>{new Date(record.record_date).toLocaleDateString()}</span>
                                            </div>
                                            {record.doctor_name && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span>👨‍⚕️</span>
                                                    <span>Dr. {record.doctor_name}</span>
                                                </div>
                                            )}
                                        </div>

                                        {record.attachment && (
                                            <div style={{ marginTop: '0.75rem' }}>
                                                <a
                                                    href={`http://localhost:8000${record.attachment}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        color: '#17A2B8',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '500',
                                                        textDecoration: 'none',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}
                                                >
                                                    📎 View Attachment
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </Layout>
    );
};

export default MedicalRecords;
