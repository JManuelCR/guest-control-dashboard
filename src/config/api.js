// Configuración de la API para diferentes entornos
export const API_CONFIG = {
  // Detectar el entorno
  isDevelopment: import.meta.env.DEV || import.meta.env.MODE === 'development',
  isProduction: import.meta.env.PROD || import.meta.env.MODE === 'production',
  
  // URLs base para diferentes entornos
  development: "http://localhost:8080",
  production: import.meta.env.VITE_API_URL || "https://tu-api-produccion.com",
  
  // Obtener la URL base según el entorno
  getBaseUrl() {
    console.log('🔧 Configuración de API:');
    console.log('  - Entorno:', import.meta.env.MODE);
    console.log('  - DEV:', import.meta.env.DEV);
    console.log('  - PROD:', import.meta.env.PROD);
    console.log('  - VITE_API_URL:', import.meta.env.VITE_API_URL);
    
    if (this.isDevelopment) {
      console.log('🚀 Usando URL de desarrollo:', this.development);
      return this.development;
    }
    
    if (this.isProduction) {
      if (import.meta.env.VITE_API_URL) {
        console.log('🚀 Usando URL de producción:', import.meta.env.VITE_API_URL);
        return import.meta.env.VITE_API_URL;
      } else {
        console.warn('⚠️ VITE_API_URL no configurada en producción, usando fallback');
        return this.production;
      }
    }
    
    // Fallback
    console.warn('⚠️ Entorno no reconocido, usando fallback');
    return this.production;
  }
};

export default API_CONFIG; 