import { useState, useEffect } from 'react';
import { login as authLogin, logout as authLogout, isAuthenticated, getUserData } from '../services/auth';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const isAuth = isAuthenticated();

            if (isAuth) {
                const userData = getUserData();
                setUser(userData);
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const result = await authLogin(credentials);

            if (result.success) {
                setUser(result.data.user || { email: credentials.email });
                setIsLoggedIn(true);
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch {
            return { success: false, error: 'Error inesperado durante el login' };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authLogout();
        setUser(null);
        setIsLoggedIn(false);
    };

    const value = { user, isLoggedIn, loading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 