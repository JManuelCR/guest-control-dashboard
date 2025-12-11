// Configuración de WebSockets
export const SOCKET_CONFIG = {
  // URL del servidor WebSocket - usar localhost por defecto
  SERVER_URL: "http://localhost:8080",
  
  // Eventos de WebSocket
  EVENTS: {
    // Eventos emitidos por el servidor
    GUESTS_FETCHED: 'guests-fetched',
    GUEST_UPDATED: 'guest-updated',
    GUEST_ADDED: 'guest-added',
    GUEST_REMOVED: 'guest-removed',
    
    // Eventos emitidos por el cliente
    REQUEST_GUESTS: 'request-guests',
    GUEST_UPDATE: 'guest-update',
    GUEST_ADD: 'guest-add',
    GUEST_REMOVE: 'guest-remove'
  },
  
  // Configuración de reconexión
  RECONNECTION: {
    ENABLED: true,
    MAX_ATTEMPTS: 5,
    DELAY: 1000, // ms
    BACKOFF_MULTIPLIER: 1.5
  },
  
  // Configuración de heartbeat
  HEARTBEAT: {
    ENABLED: true,
    INTERVAL: 30000, // 30 segundos
    TIMEOUT: 5000    // 5 segundos
  }
};

// Función para obtener la URL del WebSocket
export const getSocketUrl = () => {
  // Intentar usar variable de entorno, fallback a localhost
  try {
    if (import.meta.env.VITE_API_URL) {
      // console.log('🔗 Usando URL de API desde variable de entorno:', import.meta.env.VITE_API_URL);
      return import.meta.env.VITE_API_URL;
    }
  } catch (error) {
    console.warn('No se pudo leer VITE_API_URL, usando localhost por defecto:', error);
  }
  
  // console.log('🔗 Usando URL por defecto:', SOCKET_CONFIG.SERVER_URL);
  return SOCKET_CONFIG.SERVER_URL;
};

// Validar configuración
export const validateSocketConfig = () => {
  // Validar URL del servidor
  if (!SOCKET_CONFIG.SERVER_URL) {
    throw new Error('URL del servidor WebSocket no configurado');
  }

  // Validar eventos
  if (!SOCKET_CONFIG.EVENTS.GUESTS_FETCHED || !SOCKET_CONFIG.EVENTS.GUEST_UPDATED) {
    throw new Error('Eventos WebSocket requeridos no configurados');
  }

  // Configuración válida
  return true;
}; 