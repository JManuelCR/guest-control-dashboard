import './tableAssignationInput.css'
import { useEffect, useRef, useState, useContext } from "react";
import { DataContext } from '../../context/DataContext';
import { jwtDecode } from 'jwt-decode';



const TableAssignationInput = (({ guest, updatedGuest, positionAssignation = false }) => {
    const { updateGuest } = useContext(DataContext);
    const guestTableNumber = guest?.guestTableNumber ?? '';
    const [table, setTable] = useState(guestTableNumber);
    const [position, setPosition] = useState('')
    const debounceRef = useRef(null)
    const isUserUpdatingRef = useRef(false);
    const [userType, setUserType] = useState('');

    // Sincronizar el estado local cuando el guest cambie desde el contexto (actualización del socket)
    // Solo actualizar si el cambio viene del servidor/socket, no del usuario
    useEffect(() => {
        const newTableNumber = guest?.guestTableNumber ?? '';
        const newPosition = guest?.guestTablePosition ?? ''
        if(positionAssignation)
            debugger
        // Solo actualizar si no estamos en medio de una actualización del usuario
        // y el valor del contexto es diferente al estado actual
        if (!isUserUpdatingRef.current && newTableNumber !== '' && newTableNumber !== table && !positionAssignation) {
            setTable(newTableNumber);
        }
        else if(!isUserUpdatingRef.current && newPosition !== '' && newPosition !== position && positionAssignation){
            setPosition(newPosition);
        }
    }, [guest?.guestTableNumber]);

    useEffect(() => {
        const token = localStorage.getItem('bearerToken');
        const decodeToken = jwtDecode(token);
        const userType = decodeToken.userType;

        setUserType(userType);
    }, [guest]);

    const assignationTable = ((event) => {
        const newValue = parseInt(event.target.value);
                isUserUpdatingRef.current = true; // Marcar que el usuario está actualizando

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        if (positionAssignation) {
            setPosition(newValue)
            debounceRef.current = setTimeout(async () => {
                if (newValue === 0) {
                    window.alert('La numeración de posiciones empieza en 1')
                    isUserUpdatingRef.current = false;
                    return;
                } else if (newValue > 10) {
                    window.alert('Solo hay 10 lugares')
                    isUserUpdatingRef.current = false;
                    return
                } else {
                    try {
                        // Usar updateGuest del DataContext que está conectado al socket
                        const guestUpdated = await updateGuest(guest.guestInvitationId, {
                            guestTablePosition: newValue
                        });
                        if (guestUpdated) {
                            setTable(guestUpdated.guestTablePosition || newValue);
                            // Llamar al callback si existe
                            if (updatedGuest) {
                                updatedGuest(guestUpdated);
                            }
                        }
                        // Permitir que las actualizaciones del socket se reflejen después de un breve delay
                        setTimeout(() => {
                            isUserUpdatingRef.current = false;
                        }, 1000);
                    } catch (error) {
                        console.error('Error al actualizar la mesa del invitado:', error);
                        // Revertir el valor en caso de error
                        setTable(guestTablePosition);
                        isUserUpdatingRef.current = false;
                    }
                }
            }, 500)
        } else {
            setTable(newValue);
            debounceRef.current = setTimeout(async () => {
                if (newValue === 0) {
                    window.alert('La numeración de mesas empieza en 1')
                    isUserUpdatingRef.current = false;
                    return;
                } else if (newValue > 29) {
                    window.alert('Solo hay 29 mesas')
                    isUserUpdatingRef.current = false;
                    return
                } else {
                    try {
                        // Usar updateGuest del DataContext que está conectado al socket
                        const guestUpdated = await updateGuest(guest.guestInvitationId, {
                            guestTableNumber: newValue
                        });
                        if (guestUpdated) {
                            setTable(guestUpdated.guestTableNumber || newValue);
                            // Llamar al callback si existe
                            if (updatedGuest) {
                                updatedGuest(guestUpdated);
                            }
                        }
                        // Permitir que las actualizaciones del socket se reflejen después de un breve delay
                        setTimeout(() => {
                            isUserUpdatingRef.current = false;
                        }, 1000);
                    } catch (error) {
                        console.error('Error al actualizar la mesa del invitado:', error);
                        // Revertir el valor en caso de error
                        setTable(guestTableNumber);
                        isUserUpdatingRef.current = false;
                    }
                }
            }, 500)
        }
    })

    return (
        <input
            className="input-assignation-table"
            type="number"
            placeholder={positionAssignation ? "Introduce la posición del invitado en la mesa": "Introduce la mesa del invitado"}
            value={positionAssignation? position : table}
            onChange={assignationTable}
            min={1}
            max={29}
            readOnly={userType !== 'admin'}
        />
    )
});
export default TableAssignationInput