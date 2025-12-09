
import { useState, useMemo, useCallback, useEffect, useContext } from "react";
import { DataContext } from "../../context/DataContext";
import TableAssignationInput from "../tableAssignationInput/tableAssignationInput";
import GenerateTicketQR from "../generateTicketQR/generateTicketQR";
const TableTickets = ({ list, onGuestUpdated }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [forceUpdate, setForceUpdate] = useState(0);
    const data = useContext(DataContext)
    const [guestList, setGuestList] = useState([])

    useEffect(() => {
        setGuestList(data.guests.filter(guest => guest.guestParticipation > 0))
    }, [data])

    // Obtener el estado global de datos del contexto
    const [socketConnected, setSocketConnected] = useState(false);

    // Estado para filtros de columnas
    const [columnFilters, setColumnsFilters] = useState({
        guestName: '',
        guestSide: '',
        guestRelationship: '',
        guestType: '',
        guestPriority: '',
        guestInvited: '',
        guestPassesNumberToRecibe: '',
        guestProbability: '',
        guestParticipation: '',
        guestPrimaryContact: '',
        guestSecondaryContact: '',
        guestInvitationDelivered: '',
        guestInvitationSent: '',
        guestLanguage: '',
        guestChickenCountDesire: '',
        guestPorkCountDesire: '',
        guestForeigner: '',
        guestTransportCount: '',
        guestTableNumber: '',
        guestTablePosition: ''
    });

    // Diccionario completo de las clases para diferentes estados

    const classDictionary = useMemo(() => ({

        // Estado de la fila
        row: {
            sinAccion: 'sin-acción',
            sinContestar: 'sin-contestar',
            aceptada: 'aceptada',
            rechazada: 'rechazada',
            aceptadaParcial: 'aceptada-parcial'
        },
        // Estado del a celda
        cell: {
            status: {
                base: 'columna-status',
                envida: 'enviada',
                pendiente: 'pendiente',
            },
            actions: 'column-actions',
            name: 'column-name',
            email: 'column-email',
            number: 'column-number'
        },
        // Estado de la invitación
        invitation: {
            delivered: 'delivered',
            notDelivered: 'not-delivered',
            sent: 'sent',
            notSent: 'not-sent',
        },
        respponse: {
            answered: 'answered',
            notAnswered: 'not-answered',
            pending: 'pending',
        }
    }), []);

    // FunciÓn para forzar actualización de la tabla -  MOVIDA AQUÍ
    const refreshTable = useCallback(() => {
        setForceUpdate((prev) => prev + 1);
    }, []);

    // Función para manejar el cambio de estado de los invitados
    const handleGuestStatusChange = useCallback((userId, newStatus) => {
        // Forzar actualización de la tabla
        refreshTable();

        //También puedes actualizar el estado local si es necesario
    }, [refreshTable]);

    // Función para obtener clases de la fila usando  el diccionario - MEJORADA
    const getRowClassesFromDict = useCallback((guest) => {
        // verificar que el guest tenga las propiedades necesarias

        if (!guest) return classDictionary.row.sinAccion;

        const isDelivered = guest.guestInvitationDelivered === true;
        const hasResponse = guest.guestInvitationResponse === true;
        const hasParticipation = guest.guestParticipation > 0;
        const hasPartialParticipation = guest.guestParticipation > guest.guestPassesNumberToRecibe;

        // Lógica mejorada para determinar el estado 
        if (!isDelivered) {
            return classDictionary.row.sinAccion
        } else if (isDelivered && hasResponse && hasParticipation && !hasPartialParticipation) {
            return classDictionary.row.aceptada;
        } else if (isDelivered && hasResponse && !hasParticipation) {
            return classDictionary.row.rechazada;
        } else if (isDelivered && hasResponse && hasPartialParticipation) {
            return classDictionary.row.aceptadaParcial;
        } else {
            return classDictionary.row.sinContestar;
        }
    }, [classDictionary.row]);

    // Función para obtener clases de la celda de estado usando el diccionario - MEJORADA
    const getStatusCellClassesFromDIct = useCallback((guest) => {
        if (!guest) return classDictionary.cell.status.base;

        const baseClass = classDictionary.cell.status.base;
        const statusClass = guest.guestInvitationDelivered
            ? classDictionary.cell.status.envida
            : classDictionary.cell.status.pendiente;
        return `${baseClass} ${statusClass}`;
    }, [classDictionary.cell.status]);
    // FUncion para actualizar los filtros de la columna -optima con useCallback
    const updateColumnFilter = useCallback((columnKey, filterValue) => {
        setColumns((prevFilters) => ({
            ...prevFilters,
            [columnKey]: filterValue,
        }));
    }, []);

    const clearAllFilters = useCallback(() => {
        setColumnsFilters({
            guestName: '',
            guestSide: '',
            guestRelationship: '',
            guestType: '',
            guestPriority: '',
            guestInvited: '',
            guestPassesNumberToRecibe: '',
            guestProbability: '',
            guestParticipation: '',
            guestPrimaryContact: '',
            guestSecondaryContact: '',
            guestInvitationDelivered: '',
            guestInvitationSent: '',
            guestLanguage: '',
            guestChickenCountDesire: '',
            guestPorkCountDesire: '',
            guestForeigner: '',
            guestTransportCount: '',
            guestTableNumber: '',
            guestTablePosition: ''
        });
        setSearchTerm('');
        setCurrentPage(1);
    }, []);

    const filteredAndPaginatedData = useMemo(() => {

        let filtered = guestList.filter(guest =>
            guest.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.guestSide.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.guestRelationship.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.guestType.toLowerCase().includes(searchTerm.toLowerCase())
        );

        Object.entries(columnFilters).forEach(([column, filterValue]) => {
            if (filterValue && filterValue.trim() !== '') {
                filtered = filtered.filter(guest => {
                    const guestValue = guest[column];

                    // filtrado especial para campos booleanos
                    if (column === 'guestInvited') {
                        return filterValue == 'all' || guestValue === filterValue;
                    }
                    if (column === 'guestInvitationDelivered' || column === 'guestInvitationSent') {
                        return filterValue === 'all' || (filterValue === 'YES' ? guestValue === true : guestValue === false);
                    }
                    if (column === 'guestForeigner') {
                        return filterValue === 'all' || guestValue === filterValue;
                    }
                    if (column == 'guestParticipation') {
                        return filterValue === 'all' || guestValue > 0;
                    }
                    return guestValue.toString().toLowerCase().includes(filterValue.toLowerCase());
                });
            }
        });

        // Calcular la pagination

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage

        return {
            filtered,
            paginated: filtered.slice(startIndex, endIndex),
            totalPages: Math.ceil(filtered.length / rowsPerPage),
            totalFiltered: filtered.length
        };
    }, [guestList, currentPage, rowsPerPage, searchTerm, columnFilters, forceUpdate]);

    useEffect(() => {
        // Lógica para manejar la conexión del socket
        refreshTable();
    }, [guestList, refreshTable])

    const handlePageChange = useCallback((newPage) => {
        setCurrentPage(newPage);
    }, []);
    // Resetear la busqueda  - opto,mizado con useCallBack
    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reiniciar a la primera página
    }, []);
    // Cambiar filas por página - optimizado con useCallBack
    const handleRowsPerPageChange = useCallback((event) => {
        const newRowsPerPage = parseInt(event.target.value)
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1); // Reiniciar a la primera página
    }, []);
    const generatePaginationButtons = useCallback(() => {
        const { totalPages } = filteredAndPaginatedData;
        const buttons = [];

        buttons.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disable={currentPage === 1}
                className="pagination-button"
            >
                ← Anterior
            </button>
        );

        // Botones de página numéricos
        for (let page = 1; page <= totalPages; page++) {
            if (
                page === 1 || // Primera página
                page === totalPages || // Última página
                (page >= currentPage - 2 && page <= currentPage + 2) // paginas alrededor de la actual
            ) {
                buttons.push(
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                    >
                        {page}
                    </button>
                );
            } else if (
                page === currentPage - 3 || // Salto antes del rango
                page === currentPage + 3 // Salto después del rango
            ) {
                buttons.push(
                    <spam key={`elipsis-${page}`}>...</spam>
                );
            }
        }

        buttons.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disable={currentPage === totalPages}
                className="pagination-button"
            >
                Siguiente →
            </button>

        );
        return buttons;
    }, [filteredAndPaginatedData.totalPages, currentPage, handlePageChange]);

    const ColumnFilter = useCallback(({ column, value, onChange, type = 'text', options = [] }) => {
        if (type === 'select') {
            return (
                <select
                    value={value}
                    onChange={(e) => onChange(column, e.target.value)}
                    className="column-filter-select"
                >
                    <option value="">Todos</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }
        return (
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(column, e.target.value)}
                placeholder={`Filtrar ${column}...`}
                className="column-filter-input"
            />
        );
    }, []);

    if (!guestList || guestList.length === 0) {
        return (
            <div
                className="table-container">
                <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                    <p>No hay invitados disponibles</p>
                </div>
            </div>
        );
    }
    // La función updateGuestsList ya no es necesaria porque
    // TableAssignationInput ahora usa updateGuest del DataContext
    // que automáticamente actualiza el estado y notifica al socket
    const updateGuestsList = (updatedGuest) => {
        // Esta función se mantiene para compatibilidad con el callback
        // pero la actualización real se hace en el DataProvider
        // El socket ya está configurado para recibir las actualizaciones
    };

    return (
        <div className="table-container">
            {/* Barra de búsqueda y filtros - FIJA */}
            <div className="table-filters">
                <div className="search-section">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="global-search-input"
                        placeholder="🔍 Búsqueda general por nombre, lado, relación, tipo o contacto ..."
                    />
                    <button
                        onClick={clearAllFilters} className="clear-filters-btn"
                    >
                        🗑️ Limpiar filtros
                    </button>
                    <div className="socket-status">
                        <span className={`status-indicator ${socketConnected ? 'connected' : 'disconnected'}`}>
                            {socketConnected ? ' 🔌 ' : ' ❌ '}
                        </span>
                        <span className="status-text">
                            {socketConnected ? 'Conectado al servidor' : 'Desconectado del servidor'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Contenedor de scroll horizontal para la tabla */}
            <div className="table-scroll-container">
                {/* Tabla de invitados */}
                <table>
                    <thead>
                        <tr>
                            <th>
                                <div className="header-content">
                                    <span>Nombre</span>
                                    <ColumnFilter
                                        column="guestName"
                                        value={columnFilters.guestName}
                                        onChange={updateColumnFilter}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="header-content">
                                    <span>Pases</span>
                                    <ColumnFilter
                                        column="guestPassesNumberToRecibe"
                                        value={columnFilters.guestPassesNumberToRecibe}
                                        onChange={updateColumnFilter}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="header-content">
                                    <span>Asignación de mesa</span>
                                </div>
                            </th>
                            <th>
                                <div className="header-content">
                                    <span>Asignación de posición en mesa</span>
                                </div>
                            </th>
                            <th>
                                <div className="header-content">
                                    <span>Número de mesa</span>
                                    <ColumnFilter
                                        column="guestTableNumber"
                                        value={columnFilters.guestTableNumber}
                                        onChange={updateColumnFilter}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="header-content">
                                    <span>Posición en mesa</span>
                                    <ColumnFilter
                                        column="guestTablePosition"
                                        value={columnFilters.guestTablePosition}
                                        onChange={updateColumnFilter}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="header-content">
                                    <span>Crear Pase de entrada</span>
                                </div>
                            </th>
                            <th>
                                <div className="header-content">
                                    <span>Invitado por</span>
                                    <ColumnFilter
                                        column="guestSude"
                                        value={columnFilters.guestSide}
                                        onChange={updateColumnFilter}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="header-content">
                                    <span>Número de platillos con pollo</span>
                                    <ColumnFilter
                                        column="guestChickenCountDesire"
                                        value={columnFilters.guestChickenCountDesire}
                                        onChange={updateColumnFilter}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="header-content">
                                    <span>Número de platillos con cerdo</span>
                                    <ColumnFilter
                                        column="guestPorkCountDesire"
                                        value={columnFilters.guestPorkCountDesire}
                                        onChange={updateColumnFilter}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="header-content">
                                    <span>Requiere transporte</span>
                                    <ColumnFilter
                                        column="guestTransportCount"
                                        value={columnFilters.guestTransportCount}
                                        onChange={updateColumnFilter}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="header-content">
                                    <span>Número de personas que requieren transporte</span>
                                    <ColumnFilter
                                        column="guestTransportCount"
                                        value={columnFilters.guestTransportCount}
                                        onChange={updateColumnFilter}
                                    />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndPaginatedData.paginated.map((guest, index) => (
                            <tr key={guest.guestInvitationId || index} className={getRowClassesFromDict(guest)}>
                                <td className="column-name">{guest.guestName || 'N/A'}</td>
                                <td className="column-passes">{guest.guestChurchAssistantConfirmation > 0 ? guest.guestPassesNumberToRecibe : 0}</td>
                                <td><TableAssignationInput guest={guest} updatedGuest={updateGuestsList} /></td>
                                <td><TableAssignationInput guest={guest} updatedGuest={updateGuestsList} positionAssignation={true} /></td>
                                <td className="column-number">{guest.guestTableNumber}</td>
                                <td className="column-actions">
                                    <GenerateTicketQR guest={guest} />

                                </td>
                                <td className="column-side">{guest.guestSide || 'N/A'}</td>
                                <td className="column-number">{guest.guestChickenCountDesire || '0'}</td>
                                <td className="column-number">{guest.guestPorkCountDesire || '0'}</td>
                                <td>{guest.guestTransportCount > 0 ? '🚗 Sí' : '❌ No'}</td>
                                <td className="column-number">{guest.guestTransportCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/*Paginación - FIJA*/}
            <div className="pagination-container">
                <div className="pagination-info">
                    Mostrando {((currentPage - 1) * rowsPerPage) + 1}a {Math.min(currentPage * rowsPerPage, filteredAndPaginatedData.totalFiltered)} de {filteredAndPaginatedData.totalFiltered} invitados
                </div>

                <div className="pagination-controls">
                    <div className="rows-per-page">
                        <label htmlFor="">filas por página:</label>
                        <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    {generatePaginationButtons()}
                </div>
            </div>
        </div>
    )
}

export default TableTickets;