import { useState } from 'react';
import Layout from '../common/Layout';

const AdminDashboard = () => {
    const stats = [
        { label: 'Total Users', value: '0', color: '#17A2B8', bg: '#D1ECF1', icon: '👥' },
        { label: 'Doctors', value: '0', color: '#10B981', bg: '#ECFDF5', icon: '⚕️' },
        { label: 'Patients', value: '0', color: '#8B5CF6', bg: '#F5F3FF', icon: '👤' },
        { label: 'Pending Verifications', value: '0', color: '#F59E0B', bg: '#FFFBEB', icon: '⏳' },
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
                        Admin Dashboard
                    </h1>
                    <p style={{ fontSize: '1rem', color: '#6B7280' }}>
                        System overview and management
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
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    backgroundColor: stat.bg,
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem'
                                }}>
                                    {stat.icon}
                                </div>
                                <span style={{ fontSize: '2rem', color: stat.color, fontWeight: '700' }}>
                                    {stat.value}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: '500' }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Management Sections */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {/* Doctor Verification Queue */}
                    <div style={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        padding: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                                Doctor Verifications
                            </h3>
                            <span style={{
                                backgroundColor: '#FEF2F2',
                                color: '#DC2626',
                                padding: '0.25rem 0.625rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                0 Pending
                            </span>
                        </div>
                        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#6B7280' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                            <p style={{ fontSize: '0.875rem' }}>No pending verifications</p>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div style={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        padding: '1.5rem'
                    }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                            Recent Activity
                        </h3>
                        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#6B7280' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
                            <p style={{ fontSize: '0.875rem' }}>No recent activity</p>
                        </div>
                    </div>

                    {/* System Stats */}
                    <div style={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        padding: '1.5rem'
                    }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                            System Health
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { label: 'API Status', status: 'Operational', color: '#10B981' },
                                { label: 'Database', status: 'Connected', color: '#10B981' },
                                { label: 'Services', status: 'Running', color: '#10B981' }
                            ].map((item, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{item.label}</span>
                                    <span style={{
                                        backgroundColor: `${item.color}20`,
                                        color: item.color,
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '12px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
