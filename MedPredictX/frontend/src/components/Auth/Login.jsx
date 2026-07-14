import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',  // accepts either username or email
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(formData.username, formData.password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Invalid credentials. Please check your username/email and password.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem 1rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                padding: '3rem 2.5rem',
                width: '100%',
                maxWidth: '420px'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: '#17A2B8',
                        borderRadius: '10px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem'
                    }}>
                        <span style={{ color: 'white', fontSize: '1.75rem', fontWeight: '700' }}>+</span>
                    </div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#111827',
                        marginBottom: '0.5rem'
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: '#6B7280', fontSize: '0.938rem' }}>
                        Sign in to access your account
                    </p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        borderRadius: '8px',
                        padding: '0.875rem',
                        marginBottom: '1.5rem'
                    }}>
                        <p style={{ color: '#DC2626', fontSize: '0.875rem', margin: 0 }}>
                            {error}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Username or Email */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Username or Email
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Enter your username or email"
                            autoComplete="username"
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '1px solid #D1D5DB',
                                borderRadius: '8px',
                                fontSize: '0.938rem',
                                outline: 'none',
                                transition: 'all 0.2s',
                                backgroundColor: '#F9FAFB'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#17A2B8';
                                e.currentTarget.style.backgroundColor = 'white';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = '#D1D5DB';
                                e.currentTarget.style.backgroundColor = '#F9FAFB';
                            }}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '1px solid #D1D5DB',
                                borderRadius: '8px',
                                fontSize: '0.938rem',
                                outline: 'none',
                                transition: 'all 0.2s',
                                backgroundColor: '#F9FAFB'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#17A2B8';
                                e.currentTarget.style.backgroundColor = 'white';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = '#D1D5DB';
                                e.currentTarget.style.backgroundColor = '#F9FAFB';
                            }}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            backgroundColor: loading ? '#9CA3AF' : '#17A2B8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: loading ? 'none' : '0 2px 4px rgba(37, 99, 235, 0.2)'
                        }}
                        onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1D4ED8')}
                        onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#17A2B8')}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Register Link */}
                <div style={{ marginTop: '2rem', textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid #E5E7EB' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                        Don't have an account?
                    </p>
                    <Link
                        to="/register"
                        style={{
                            color: '#17A2B8',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.938rem'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                        Create an account →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
