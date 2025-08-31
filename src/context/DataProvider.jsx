import { useState, useEffect, useRef, useCallback } from 'react';
import { getGuests, getGuestById, patchGuest } from '../services/peopleService';
import GuestSocketManager from '../services/guestSocketService';
import { DataContext } from './DataContext';

const DataProvider = ({ children }) => {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [socketConnected, setSocketConnected] = useState(false);
    
    const socketManagerRef = useRef(null);
    const connectionCheckRef = useRef(null);

    const fetchGuests = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getGuests();
            setGuests(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Inicializar WebSocket de manera optimizada
    const initSocket = useCallback(() => {
        if (socketManagerRef.current) {
            socketManagerRef.current.disconnect();
        }

        const manager = new GuestSocketManager();
        socketManagerRef.current = manager;

        // Configurar callbacks con logs detallados
        manager.onGuestsFetched((data) => {
            data
            // console.log('📋 DataProvider: Invitados obtenidos via WebSocket:', data);
            // Actualizar contador si es necesario
        });

        manager.onGuestUpdated((data) => {
            // console.log('🔄 DataProvider: Invitado actualizado via WebSocket:', data);
            setGuests((prevGuests) => {
                const updatedGuests = prevGuests.map((guest) => {
                    // Buscar por guestInvitationId en lugar de id
                    if (guest.guestInvitationId === data.guestInvitationId) {
                        // console.log('✅ DataProvider: Actualizando invitado:', guest.guestName, 'con datos:', data);
                        return { ...guest, ...data };
                    }
                    return guest;
                });
                // console.log('📊 DataProvider: Lista de invitados actualizada:', updatedGuests.length, 'invitados');
                return updatedGuests;
            });
        });

        manager.onGuestAdded((data) => {
            // console.log('➕ DataProvider: Invitado agregado via WebSocket:', data);
            setGuests((prevGuests) => [...prevGuests, data]);
        });

        manager.onGuestRemoved((data) => {
            // console.log('➖ DataProvider: Invitado removido via WebSocket:', data);
            setGuests((prevGuests) => prevGuests.filter(guest => guest.guestInvitationId !== data.guestInvitationId));
        });

        // Conectar al WebSocket
        manager.connect();

        // Verificar estado de conexión con intervalo más largo
        connectionCheckRef.current = setInterval(() => {
            const isConnected = manager.isConnected();
            if (isConnected !== socketConnected) {
                // console.log('🔌 DataProvider: Estado de WebSocket cambiado:', isConnected ? 'CONECTADO' : 'DESCONECTADO');
                setSocketConnected(isConnected);
            }
        }, 2000); // Reducido de 1000ms a 2000ms

        return manager;
    }, [socketConnected]);

    useEffect(() => {
        fetchGuests();
        const manager = initSocket();

        return () => {
            if (connectionCheckRef.current) {
                clearInterval(connectionCheckRef.current);
            }
            if (manager) {
                manager.disconnect();
            }
        };
    }, [fetchGuests, initSocket]);

    const updateGuest = useCallback(async (id, data) => {
        try {
            // console.log('🔄 DataProvider: Iniciando actualización de invitado:', id, 'con datos:', data);
            
            // Hacer la petición PATCH
            const response = await patchGuest(id, data);
            // console.log('✅ DataProvider: PATCH exitoso, respuesta:', response.data);
            
            // Actualizar estado local inmediatamente
            setGuests((prevGuests) => {
                const updatedGuests = prevGuests.map((guest) => {
                    if (guest.guestInvitationId === id) {
                        // console.log('📝 DataProvider: Actualizando invitado local:', guest.guestName);
                        return { ...guest, ...response.data };
                    }
                    return guest;
                });
                return updatedGuests;
            });
            
            // Notificar al WebSocket sobre la actualización
            if (socketManagerRef.current && socketManagerRef.current.isConnected()) {
                // console.log('📡 DataProvider: Notificando actualización via WebSocket');
                socketManagerRef.current.updateGuest({
                    guestInvitationId: id,
                    ...data,
                    timestamp: new Date().toISOString()
                });
            } else {
                // console.log('⚠️ DataProvider: WebSocket no conectado, no se puede notificar');
            }
            
            return response.data;
        } catch (err) {
            console.error('🚨 DataProvider: Error en updateGuest:', err);
            setError(err);
            throw err;
        }
    }, []);

    const getGuestDetails = useCallback(async (id) => {
        try {
            const response = await getGuestById(id);
            setSelectedGuest(response.data);
            return response.data;
        } catch (err) {
            setError(err);
            return null;
        }
    }, []);

    const requestGuestsViaSocket = useCallback(() => {
        if (socketManagerRef.current) {
            socketManagerRef.current.requestGuests();
        }
    }, []);

    const value = {
        guests,
        loading,
        error,
        selectedGuest,
        socketConnected,
        updateGuest,
        getGuestDetails,
        requestGuestsViaSocket
    };


    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;