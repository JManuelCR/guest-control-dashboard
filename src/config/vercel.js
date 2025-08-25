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
    console.log('🔧 Detección de entorno - Variables disponibles:');
    console.log('  - import.meta.env.MODE:', import.meta.env.MODE);
    console.log('  - import.meta.env.DEV:', import.meta.env.DEV);
    console.log('  - import.meta.env.PROD:', import.meta.env.PROD);
    console.log('  - window.location.hostname:', typeof window !== 'undefined' ? window.location.hostname : 'undefined');
    console.log('  - window.location.origin:', typeof window !== 'undefined' ? window.location.origin : 'undefined');
    
    // Si estamos en Vercel, forzar producción
    if (this.isVercel) {
      console.log('✅ Detectado Vercel - Forzando entorno de producción');
      return 'production';
    }
    
    // Verificar si MODE está configurado como 'production'
    if (import.meta.env.MODE === 'production') {
      console.log('✅ MODE configurado como production');
      return 'production';
    }
    
    // Usar la detección estándar de Vite
    if (import.meta.env.PROD === true) {
      console.log('✅ PROD detectado como true');
      return 'production';
    }
    
    if (import.meta.env.DEV === true) {
      console.log('✅ DEV detectado como true');
      return 'development';
    }
    
    // Fallback basado en el modo
    const fallbackMode = import.meta.env.MODE || 'development';
    console.log('⚠️ Usando fallback basado en MODE:', fallbackMode);
    return fallbackMode;
  },
  
  // Obtener la URL de la API desde diferentes fuentes
  getApiUrl() {
    const environment = this.getEnvironment();
    console.log('🔧 Entorno detectado:', environment);
    
    // 1. Intentar obtener desde VITE_API_URL (variable de entorno)
    if (import.meta.env.VITE_API_URL) {
      console.log(import.meta.env)
      console.log('✅ VITE_API_URL encontrada:', import.meta.env.VITE_API_URL);
      return import.meta.env.VITE_API_URL;
    }
    
    // 2. Si estamos en producción o Vercel
    if (environment === 'production' || this.isVercel) {
      if (this.isVercel) {
        const currentDomain = window.location.origin;
        console.log('🌐 Detectado dominio de Vercel:', currentDomain);
        
        // Construir URL de la API basada en el dominio actual
        // Puedes ajustar esto según tu configuración
        const apiUrl = currentDomain.replace('https://', 'https://api.');
        
        console.log('🚀 Construyendo URL de API:', apiUrl);
        return apiUrl;
      } else {
        console.log('🚀 Entorno de producción detectado');
        return "https://tu-api-produccion.com"; // Cambiar por tu URL real
      }
    }
    
    // 3. Fallback para desarrollo local
    console.log('🏠 Usando fallback para desarrollo local');
    return "http://localhost:8080";
  },
  
  // Verificar configuración
  validateConfig() {
    const apiUrl = this.getApiUrl();
    const environment = this.getEnvironment();
    
    console.log('🔍 Validación de configuración:');
    console.log('  - Entorno detectado:', environment);
    console.log('  - ¿Estamos en Vercel?', this.isVercel);
    console.log('  - URL de la API:', apiUrl);
    console.log('  - VITE_API_URL:', import.meta.env.VITE_API_URL);
    
    return {
      apiUrl,
      environment,
      isVercel: this.isVercel,
      hasEnvVar: !!import.meta.env.VITE_API_URL
    };
  }
};

export default VERCEL_CONFIG; 