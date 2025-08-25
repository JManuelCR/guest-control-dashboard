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

        // Configurar callbacks
        manager.onGuestsFetched(() => {
            // Actualizar contador si es necesario
        });

        manager.onGuestUpdated((data) => {
            setGuests((prevGuests) =>
                prevGuests.map((guest) =>
                    guest.id === data.id ? { ...guest, ...data } : guest
                )
            );
        });

        manager.onGuestAdded((data) => {
            setGuests((prevGuests) => [...prevGuests, data]);
        });

        manager.onGuestRemoved((data) => {
            setGuests((prevGuests) => prevGuests.filter(guest => guest.id !== data.id));
        });

        // Conectar al WebSocket
        manager.connect();

        // Verificar estado de conexión con intervalo más largo
        connectionCheckRef.current = setInterval(() => {
            if (manager.isConnected()) {
                setSocketConnected(true);
            } else {
                setSocketConnected(false);
            }
        }, 2000); // Reducido de 1000ms a 2000ms

        return manager;
    }, []);

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
            const response = await patchGuest(id, data);
            setGuests((prevGuests) =>
                prevGuests.map((guest) =>
                    guest.id === id ? response.data : guest
                )
            );
        } catch (err) {
            setError(err);
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

    console.log('DataProvider - Valor del contexto:', value);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;