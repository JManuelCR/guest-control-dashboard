import { io } from 'socket.io-client';
import { SOCKET_CONFIG, getSocketUrl, validateSocketConfig } from '../config/socketConfig';

class GuestSocketManager {
  constructor() {
    this.socket = null;
    this.callbacks = {
      onGuestsFetched: null,
      onGuestUpdated: null,
      onGuestAdded: null,
      onGuestRemoved: null
    };
    
    // Validar configuración al inicializar
    validateSocketConfig();
  }

  // Conectar al WebSocket
  connect() {
    const socketUrl = getSocketUrl();
    
    this.socket = io(socketUrl, {
      reconnection: SOCKET_CONFIG.RECONNECTION.ENABLED,
      reconnectionAttempts: SOCKET_CONFIG.RECONNECTION.MAX_ATTEMPTS,
      reconnectionDelay: SOCKET_CONFIG.RECONNECTION.DELAY,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: 10,
      timeout: 20000,
      transports: ['websocket', 'polling'],
      forceNew: true,
      autoConnect: true
    });
    
    this.setupEventListeners();
    
    if (SOCKET_CONFIG.HEARTBEAT.ENABLED) {
      this.setupHeartbeat();
    }
  }

  // Configurar todos los event listeners
  setupEventListeners() {
    this.socket.on('connect', () => {
        // console.log('🔌 WebSocket CONECTADO - ID:', this.socket.id);
        // console.log('📡 Transporte:', this.socket.io.engine.transport.name);
    });

    this.socket.on('disconnect', (reason) => {
      // console.log('❌ WebSocket DESCONECTADO - Razón:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('🚨 Error de conexión WebSocket:', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      attemptNumber
      // console.log('🔄 WebSocket RECONECTADO - Intento:', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('🚨 Error de reconexión WebSocket:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('💥 Falló la reconexión WebSocket');
    });

    // Eventos de invitados con logs detallados
    this.socket.on(SOCKET_CONFIG.EVENTS.GUESTS_FETCHED, (data) => {
      //  console.log('📋 WebSocket: Invitados obtenidos:', data);
      if (this.callbacks.onGuestsFetched) {
        this.callbacks.onGuestsFetched(data);
      }
    });

    this.socket.on(SOCKET_CONFIG.EVENTS.GUEST_UPDATED, (data) => {
      // console.log('🔄 WebSocket: Invitado ACTUALIZADO:', data);
      if (this.callbacks.onGuestUpdated) {
        this.callbacks.onGuestUpdated(data);
      }
    });

    this.socket.on(SOCKET_CONFIG.EVENTS.GUEST_ADDED, (data) => {
      // console.log('➕ WebSocket: Invitado AGREGADO:', data);
      if (this.callbacks.onGuestAdded) {
        this.callbacks.onGuestAdded(data);
      }
    });

    this.socket.on(SOCKET_CONFIG.EVENTS.GUEST_REMOVED, (data) => {
      // console.log('➖ WebSocket: Invitado ELIMINADO:', data);
      if (this.callbacks.onGuestRemoved) {
        this.callbacks.onGuestRemoved(data);
      }
    });

    // Evento para confirmar que el servidor recibió la actualización
    this.socket.on('guest-update-confirmed', (data) => {
      // console.log('✅ WebSocket: Actualización confirmada por servidor:', data);
    });

    // Evento para errores del servidor
    this.socket.on('guest-update-error', (error) => {
      console.error('🚨 WebSocket: Error en actualización:', error);
    });
  }

  // Configurar heartbeat
  setupHeartbeat() {
    const heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.connected) {
        this.socket.emit('ping');
      }
    }, SOCKET_CONFIG.HEARTBEAT.INTERVAL);

    this.socket.on('pong', () => {
      // Heartbeat recibido
    });

    this.socket.on('disconnect', () => {
      clearInterval(heartbeatInterval);
    });
  }

  // Configurar callbacks
  onGuestsFetched(callback) {
    this.callbacks.onGuestsFetched = callback;
  }

  onGuestUpdated(callback) {
    this.callbacks.onGuestUpdated = callback;
  }

  onGuestAdded(callback) {
    this.callbacks.onGuestAdded = callback;
  }

  onGuestRemoved(callback) {
    this.callbacks.onGuestRemoved = callback;
  }

  // Métodos para emitir eventos
  requestGuests() {
    if (this.socket && this.socket.connected) {
      this.socket.emit(SOCKET_CONFIG.EVENTS.REQUEST_GUESTS);
    }
  }

  updateGuest(guestData) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(SOCKET_CONFIG.EVENTS.GUEST_UPDATE, guestData);
    }
  }

  addGuest(guestData) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(SOCKET_CONFIG.EVENTS.GUEST_ADD, guestData);
    }
  }

  removeGuest(guestId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(SOCKET_CONFIG.EVENTS.GUEST_REMOVE, { id: guestId });
    }
  }

  // Desconectar y limpiar
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Verificar estado de conexión
  isConnected() {
    return this.socket && this.socket.connected;
  }

  // Obtener estadísticas de conexión
  getConnectionStats() {
    if (!this.socket) return null;
    
    return {
      connected: this.socket.connected,
      id: this.socket.id,
      transport: this.socket.io.engine.transport.name
    };
  }
}

export default GuestSocketManager; 