import { useState, useEffect, useRef, useCallback } from 'react';
import GuestSocketManager from '../services/guestSocketService';

export function useGuestSocket() {
  const [guestsCount, setGuestsCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  const socketManagerRef = useRef(null);
  const connectionCheckRef = useRef(null);

  useEffect(() => {
    const manager = new GuestSocketManager();
    socketManagerRef.current = manager;

    // Configurar callbacks
    manager.onGuestsFetched((data) => {
      setGuestsCount(data.count);
      setLastFetchTime(data.timestamp);
    });

    manager.onGuestUpdated(() => {
      // Aquí podrías actualizar la lista de invitados si es necesario
    });

    manager.onGuestAdded(() => {
      // Aquí podrías agregar el nuevo invitado a la lista
    });

    manager.onGuestRemoved(() => {
      // Aquí podrías remover el invitado de la lista
    });

    // Conectar al WebSocket
    manager.connect();

    // Verificar estado de conexión con intervalo más largo
    connectionCheckRef.current = setInterval(() => {
      if (manager.isConnected()) {
        setIsConnected(true);
        setConnectionStatus('connected');
      } else {
        setIsConnected(false);
        setConnectionStatus('disconnected');
      }
    }, 2000); // Reducido de 1000ms a 2000ms

    return () => {
      if (connectionCheckRef.current) {
        clearInterval(connectionCheckRef.current);
      }
      manager.disconnect();
    };
  }, []);

  // Función para solicitar invitados manualmente
  const requestGuests = useCallback(() => {
    if (socketManagerRef.current) {
      socketManagerRef.current.requestGuests();
    }
  }, []);

  // Función para reconectar manualmente
  const reconnect = useCallback(() => {
    if (socketManagerRef.current) {
      socketManagerRef.current.disconnect();
      socketManagerRef.current.connect();
    }
  }, []);

  return {
    guestsCount,
    lastFetchTime,
    isConnected,
    connectionStatus,
    requestGuests,
    reconnect
  };
} 