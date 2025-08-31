// Configuración específica para Vercel
export const VERCEL_CONFIG = {
  // Verificar si estamos en Vercel de múltiples formas
  isVercel: typeof window !== 'undefined' && (
    window.location.hostname.includes('vercel.app') || 
    window.location.hostname.includes('vercel.com') ||
    window.location.hostname.includes('.vercel.app') ||
    window.location.hostname.includes('.vercel.com')
  ),
  
  // Detectar el entorno real con mejor logging
  getEnvironment() {
    
    // Si estamos en Vercel, forzar producción
    if (this.isVercel) {
      return 'production';
    }
    
    // Verificar si MODE está configurado como 'production'
    if (import.meta.env.MODE === 'production') {
      return 'production';
    }
    
    // Usar la detección estándar de Vite
    if (import.meta.env.PROD === true) {
      return 'production';
    }
    
    if (import.meta.env.DEV === true) {
      return 'development';
    }
    
    // Fallback basado en el modo
    const fallbackMode = import.meta.env.MODE || 'development';
    return fallbackMode;
  },
  
  // Obtener la URL de la API desde diferentes fuentes
  getApiUrl() {
    const environment = this.getEnvironment();
    
    // 1. Intentar obtener desde VITE_API_URL (variable de entorno)
    if (import.meta.env.VITE_API_URL) {
      // Asegurar que la URL no tenga barras duplicadas
      return import.meta.env.VITE_API_URL.replace(/\/$/, '');
    }
    
    // 2. Si estamos en producción o Vercel
    if (environment === 'production' || this.isVercel) {
      if (this.isVercel) {
        const currentDomain = window.location.origin;
        
        // Construir URL de la API basada en el dominio actual
        // Puedes ajustar esto según tu configuración
        const apiUrl = currentDomain.replace('https://', 'https://api.');
        
        return apiUrl;
      } else {
        return "https://tu-api-produccion.com"; // Cambiar por tu URL real
      }
    }
    
    // 3. Fallback para desarrollo local
    return "http://localhost:8080";
  },
  
  // Verificar configuración
  validateConfig() {
    const apiUrl = this.getApiUrl();
    const environment = this.getEnvironment();
    
    
    return {
      apiUrl,
      environment,
      isVercel: this.isVercel,
      hasEnvVar: !!import.meta.env.VITE_API_URL
    };
  }
};

export default VERCEL_CONFIG; 