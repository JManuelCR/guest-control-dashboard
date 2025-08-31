import axios from "axios";
import API_CONFIG from "../config/api.js";

// Configuración de la API usando la configuración centralizada
const API = axios.create({
  baseURL: API_CONFIG.getBaseUrl()
});


// Interceptor para agregar el token a todas las peticiones
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('bearerToken');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas de error (token expirado)
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem('bearerToken');
            localStorage.removeItem('userData');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

const login = async (credentials) => {
    try {
        const response = await API.post('/auth/login', credentials);
        
        // El servidor devuelve {success: true, data: 'token'}
        if (response.data.success && response.data.data) {
            // Guardar token en localStorage
            localStorage.setItem('bearerToken', response.data.data);
            
            // Crear datos del usuario basados en las credenciales
            const userData = {
                email: credentials.email,
                id: Date.now(), // ID temporal
                name: credentials.email.split('@')[0] // Nombre basado en email
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            
            return {
                success: true,
                data: {
                    token: response.data.data,
                    user: userData
                }
            };
        } else {
            throw new Error('Token no recibido del servidor');
        }
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Error de conexión'
        };
    }
};

const logout = () => {
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('userData');
    window.location.href = '/';
};

const isAuthenticated = () => {
    const token = localStorage.getItem('bearerToken');
    return !!token;
};

const getToken = () => {
    return localStorage.getItem('bearerToken');
};

const getUserData = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
};

const refreshToken = async () => {
    try {
        const response = await API.post('/auth/refresh');
        if (response.data.token) {
            localStorage.setItem('bearerToken', response.data.token);
            return true;
        }
        return false;
    } catch {
        return false;
    }
};

export { 
    login, 
    logout, 
    isAuthenticated, 
    getToken, 
    getUserData, 
    refreshToken,
    API 
}; 