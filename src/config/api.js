import VERCEL_CONFIG from './vercel.js';

// Configuración de la API para diferentes entornos
export const API_CONFIG = {
  // Obtener la URL base según el entorno
  getBaseUrl() {    
    // Usar la detección mejorada de Vercel
    const environment = VERCEL_CONFIG.getEnvironment();
    const apiUrl = VERCEL_CONFIG.getApiUrl();
    
    // Validar configuración
    VERCEL_CONFIG.validateConfig();
    
    return apiUrl;
  }
};

export default API_CONFIG; 