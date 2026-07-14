import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:8000/api';

    // Check if user is authenticated on mount
    useEffect(() => {
        checkAuth();
    }, []);

    // Check authentication status
    const checkAuth = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const response = await axios.get(`${API_URL}/auth/user/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Auth check failed:', error);
                // Token might be expired, clear it
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setUser(null);
            }
        }
        setLoading(false);
    };

    // Register new user
    const register = async (userData) => {
        try {
            setError(null);

            // Clean up empty fields for non-doctor roles
            const cleanedData = { ...userData };
            if (userData.role !== 'DOCTOR') {
                delete cleanedData.specialization;
                delete cleanedData.license_number;
            }

            const response = await axios.post(`${API_URL}/auth/register/`, cleanedData);

            // Store tokens
            localStorage.setItem('access_token', response.data.tokens.access);
            localStorage.setItem('refresh_token', response.data.tokens.refresh);

            // Set user
            setUser(response.data.user);

            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data || 'Registration failed';
            setError(errorMessage);
            throw err; // Throw to let component handle it
        }
    };

    // Login user
    const login = async (username, password) => {
        try {
            setError(null);
            const response = await axios.post(`${API_URL}/auth/login/`, {
                username,
                password
            });

            // Store tokens
            localStorage.setItem('access_token', response.data.tokens.access);
            localStorage.setItem('refresh_token', response.data.tokens.refresh);

            // Set user
            setUser(response.data.user);

            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Logout user
    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');

            // Try to blacklist token on server, but don't fail if it errors
            if (refreshToken) {
                try {
                    await axios.post(`${API_URL}/auth/logout/`, {
                        refresh_token: refreshToken
                    });
                } catch (err) {
                    console.log('Server logout failed, but clearing local session anyway');
                }
            }
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            // Always clear local storage and user state
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
