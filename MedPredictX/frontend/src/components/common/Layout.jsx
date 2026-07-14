import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Get navigation items based on role
    const getNavItems = () => {
        if (!user || !user.profile) return [];

        const role = user.profile.role;

        if (role === 'PATIENT') {
            return [
                { name: 'Dashboard', path: '/dashboard', icon: '📊' },
                { name: 'Medical Triage', path: '/triage', icon: '🩺' },
                { name: 'Consultations', path: '/consult', icon: '💬' },
                { name: 'Settings', path: '/settings', icon: '⚙️' },
            ];
        } else if (role === 'DOCTOR') {
            return [
                { name: 'Dashboard', path: '/dashboard', icon: '📊' },
                { name: 'Medical Triage', path: '/triage', icon: '🩺' },
                { name: 'Consultations', path: '/consult', icon: '💬' },
                { name: 'Settings', path: '/settings', icon: '⚙️' },
            ];
        } else if (role === 'ADMIN') {
            return [
                { name: 'Dashboard', path: '/dashboard', icon: '📊' },
                { name: 'Users', path: '/admin/users', icon: '👥' },
                { name: 'Doctors', path: '/admin/doctors', icon: '⚕️' },
                { name: 'Settings', path: '/settings', icon: '⚙️' },
            ];
        }

        return [];
    };

    const navItems = getNavItems();
    const isActive = (path) => location.pathname === path;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column' }}>
            {/* Professional Navbar */}
            <nav style={{
                backgroundColor: 'white',
                borderBottom: '1px solid #E5E7EB',
                padding: '0 1.5rem',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}>
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '64px'
                }}>
                    {/* Logo */}
                    <Link to="/dashboard" style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#17A2B8',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#17A2B8',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.25rem'
                        }}>+</span>
                        MedPredictX
                    </Link>

                    {/* Navigation Links */}
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    textDecoration: 'none',
                                    color: isActive(item.path) ? '#17A2B8' : '#6B7280',
                                    fontWeight: isActive(item.path) ? '600' : '500',
                                    fontSize: '0.938rem',
                                    padding: '0.5rem 0',
                                    borderBottom: isActive(item.path) ? '2px solid #17A2B8' : '2px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => !isActive(item.path) && (e.currentTarget.style.color = '#111827')}
                                onMouseOut={(e) => !isActive(item.path) && (e.currentTarget.style.color = '#6B7280')}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* User Menu */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                                {user?.username}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                {user?.profile?.role === 'PATIENT' ? 'Patient' :
                                    user?.profile?.role === 'DOCTOR' ? 'Doctor' : 'Admin'}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                backgroundColor: 'white',
                                color: '#DC2626',
                                border: '1px solid #FCA5A5',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#FEF2F2';
                                e.currentTarget.style.borderColor = '#DC2626';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = '#FCA5A5';
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem 1.5rem' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
