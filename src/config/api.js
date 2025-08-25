import VERCEL_CONFIG from './vercel.js';

// Configuración de la API para diferentes entornos
export const API_CONFIG = {
  // Obtener la URL base según el entorno
  getBaseUrl() {
    console.log('🔧 Configuración de API:');
    
    // Usar la detección mejorada de Vercel
    const environment = VERCEL_CONFIG.getEnvironment();
    const apiUrl = VERCEL_CONFIG.getApiUrl();
    
    console.log('  - Entorno detectado:', environment);
    console.log('  - ¿Estamos en Vercel?', VERCEL_CONFIG.isVercel);
    console.log('  - URL de la API:', apiUrl);
    console.log('  - VITE_API_URL:', import.meta.env.VITE_API_URL);
    
    // Validar configuración
    VERCEL_CONFIG.validateConfig();
    
    return apiUrl;
  }
};

export default API_CONFIG; 