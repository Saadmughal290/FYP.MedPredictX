import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        role: 'PATIENT',
        phone_number: '',
        specialization: '',
        license_number: '',
        // Health fields for patients
        height: '',
        weight: '',
        age: '',
        gender: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
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
            // Clean up the data - only send non-empty fields
            const cleanData = {};
            Object.keys(formData).forEach(key => {
                const value = formData[key];
                if (value !== '' && value !== null && value !== undefined) {
                    cleanData[key] = typeof value === 'string' ? value.trim() : value;
                }
            });

            // Ensure role is set
            if (!cleanData.role) {
                cleanData.role = 'PATIENT';
            }

            console.log('Sending registration data:', cleanData);
            await register(cleanData);
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration error:', err.response?.data);
            const errorData = err.response?.data;
            if (typeof errorData === 'object') {
                // Extract first error message from object
                const firstError = Object.values(errorData)[0];
                setError(Array.isArray(firstError) ? firstError[0] : firstError);
            } else {
                setError(errorData || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    const isDoctorRole = formData.role === 'DOCTOR';

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
                padding: '2.5rem',
                width: '100%',
                maxWidth: '480px'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#17A2B8',
                        borderRadius: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.75rem'
                    }}>
                        <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700' }}>+</span>
                    </div>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: '700',
                        color: '#111827',
                        marginBottom: '0.5rem'
                    }}>
                        Create Account
                    </h1>
                    <p style={{ color: '#6B7280', fontSize: '0.938rem' }}>
                        Join MedPredictX today
                    </p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        borderRadius: '6px',
                        padding: '0.75rem',
                        marginBottom: '1.5rem'
                    }}>
                        <p style={{ color: '#DC2626', fontSize: '0.875rem', margin: 0 }}>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Role Selection */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            I am a *
                        </label>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {[
                                { value: 'PATIENT', label: 'Patient', icon: '👤' },
                                { value: 'DOCTOR', label: 'Doctor', icon: '⚕️' }
                            ].map((role) => (
                                <button
                                    key={role.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: role.value })}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        border: formData.role === role.value ? '2px solid #17A2B8' : '1px solid #D1D5DB',
                                        borderRadius: '6px',
                                        backgroundColor: formData.role === role.value ? '#D1ECF1' : 'white',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        color: formData.role === role.value ? '#17A2B8' : '#6B7280',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div>{role.icon}</div>
                                    {role.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Username & Email */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                Username *
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '6px',
                                    fontSize: '0.938rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#17A2B8'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '6px',
                                    fontSize: '0.938rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#17A2B8'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
                            />
                        </div>
                    </div>

                    {/* Doctor-specific fields */}
                    {isDoctorRole && (
                        <>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                    Specialization *
                                </label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    required={isDoctorRole}
                                    placeholder="e.g., Cardiology, Dermatology"
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '6px',
                                        fontSize: '0.938rem',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = '#17A2B8'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
                                />
                            </div>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                    License Number *
                                </label>
                                <input
                                    type="text"
                                    name="license_number"
                                    value={formData.license_number}
                                    onChange={handleChange}
                                    required={isDoctorRole}
                                    placeholder="Medical license number"
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '6px',
                                        fontSize: '0.938rem',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = '#17A2B8'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
                                />
                            </div>
                        </>
                    )}

                    {/* Patient-specific health fields */}
                    {!isDoctorRole && (
                        <>
                            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1.25rem', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                                    📊 Health Information (Optional)
                                </h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                            Height (cm)
                                        </label>
                                        <input
                                            type="number"
                                            name="height"
                                            value={formData.height}
                                            onChange={handleChange}
                                            placeholder="170"
                                            step="0.01"
                                            style={{
                                                width: '100%',
                                                padding: '0.625rem',
                                                border: '1px solid #D1D5DB',
                                                borderRadius: '6px',
                                                fontSize: '0.938rem',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = '#17A2B8'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                            Weight (kg)
                                        </label>
                                        <input
                                            type="number"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleChange}
                                            placeholder="70"
                                            step="0.01"
                                            style={{
                                                width: '100%',
                                                padding: '0.625rem',
                                                border: '1px solid #D1D5DB',
                                                borderRadius: '6px',
                                                fontSize: '0.938rem',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = '#17A2B8'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            placeholder="25"
                                            style={{
                                                width: '100%',
                                                padding: '0.625rem',
                                                border: '1px solid #D1D5DB',
                                                borderRadius: '6px',
                                                fontSize: '0.938rem',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = '#17A2B8'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '0.625rem',
                                                border: '1px solid #D1D5DB',
                                                borderRadius: '6px',
                                                fontSize: '0.938rem',
                                                outline: 'none',
                                                backgroundColor: 'white'
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = '#17A2B8'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                            <option value="O">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Password */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                            Password *
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.625rem',
                                border: '1px solid #D1D5DB',
                                borderRadius: '6px',
                                fontSize: '0.938rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#17A2B8'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.625rem',
                                border: '1px solid #D1D5DB',
                                borderRadius: '6px',
                                fontSize: '0.938rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#17A2B8'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: loading ? '#9CA3AF' : '#17A2B8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1D4ED8')}
                        onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#17A2B8')}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                {/* Login Link */}
                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6B7280' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#17A2B8', textDecoration: 'none', fontWeight: '500' }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
