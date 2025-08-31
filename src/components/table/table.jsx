import './table.css';
import { useState, useMemo, useCallback } from 'react';
import InvitationLink from '../invitation-link/invitationLink';
import MarkAsInvited from '../mark-as.invited/mark-as-invited';

const Table = ({ guestList }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para filtros de columnas
  const [columnFilters, setColumnFilters] = useState({
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
    guestTableNumber: ''
  });

  // Diccionario completo de clases para diferentes estados
  const classDictionary = useMemo(() => ({
    // Estados de fila
    row: {
      sinAccion: 'sin-accion',
      sinContestar: 'sin-contestar',
      contestada: 'contestada'
    },
    
    // Estados de celda
    cell: {
      status: {
        base: 'column-status',
        enviada: 'enviada',
        pendiente: 'pendiente'
      },
      actions: 'column-actions',
      name: 'column-name',
      email: 'column-email',
      number: 'column-number'
    },
    
    // Estados de invitación
    invitation: {
      delivered: 'delivered',
      notDelivered: 'not-delivered',
      sent: 'sent',
      notSent: 'not-sent'
    },
    
    // Estados de respuesta
    response: {
      answered: 'answered',
      notAnswered: 'not-answered',
      pending: 'pending'
    }
  }), []);

  // Función para obtener clases de fila usando el diccionario
  const getRowClassesFromDict = useCallback((guest) => {
    if (!guest.guestInvitationDelivered) {
      return classDictionary.row.sinAccion;
    } else if (guest.guestInvitationDelivered && guest.guestInvitationResponse) {
      return classDictionary.row.sinContestar;
    } else {
      return classDictionary.row.contestada;
    }
  }, [classDictionary.row]);

  // Función para obtener clases de celda de estado usando el diccionario
  const getStatusCellClassesFromDict = useCallback((guest) => {
    const baseClass = classDictionary.cell.status.base;
    const statusClass = guest.guestInvitationDelivered 
      ? classDictionary.cell.status.enviada 
      : classDictionary.cell.status.pendiente;
    return `${baseClass} ${statusClass}`;
  }, [classDictionary.cell.status]);

  // Función para actualizar filtros de columna - optimizada con useCallback
  const updateColumnFilter = useCallback((column, value) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
    setCurrentPage(1); // Resetear a la primera página
  }, []);

  // Función para limpiar todos los filtros - optimizada con useCallback
  const clearAllFilters = useCallback(() => {
    setColumnFilters({
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
      guestTableNumber: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  // Filtrar y paginar los datos - optimizado con useMemo
  const filteredAndPaginatedData = useMemo(() => {
    // Filtrar por término de búsqueda general
    let filtered = guestList.filter(guest => 
      guest.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.guestSide?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.guestRelationship?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.guestType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.guestPrimaryContact?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Aplicar filtros de columna
    Object.entries(columnFilters).forEach(([column, filterValue]) => {
      if (filterValue && filterValue.trim() !== '') {
        filtered = filtered.filter(guest => {
          const guestValue = guest[column];
          if (guestValue === null || guestValue === undefined) return false;
          
          // Filtrado especial para campos booleanos/estado
          if (column === 'guestInvited') {
            return filterValue === 'all' || guestValue === filterValue;
          }
          if (column === 'guestInvitationDelivered' || column === 'guestInvitationSent') {
            return filterValue === 'all' || guestValue === (filterValue === 'true');
          }
          if (column === 'guestForeigner') {
            return filterValue === 'all' || guestValue === filterValue;
          }
          
          // Filtrado por texto
          return guestValue.toString().toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });

    // Calcular paginación
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    
    return {
      filtered,
      paginated: filtered.slice(startIndex, endIndex),
      totalPages: Math.ceil(filtered.length / rowsPerPage),
      totalFiltered: filtered.length
    };
  }, [guestList, currentPage, rowsPerPage, searchTerm, columnFilters]);

  // Cambiar página - optimizado con useCallback
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Cambiar filas por página - optimizado con useCallback
  const handleRowsPerPageChange = useCallback((event) => {
    const newRowsPerPage = parseInt(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Resetear a la primera página
  }, []);

  // Resetear búsqueda - optimizado con useCallback
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Resetear a la primera página
  }, []);

  // Generar botones de paginación - optimizado con useCallback
  const generatePaginationButtons = useCallback(() => {
    const { totalPages } = filteredAndPaginatedData;
    const buttons = [];
    
    // Botón anterior
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        ← Anterior
      </button>
    );

    // Botones de página
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // Primera página
        i === totalPages || // Última página
        (i >= currentPage - 2 && i <= currentPage + 2) // Páginas alrededor de la actual
      ) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`pagination-button ${i === currentPage ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      } else if (
        i === currentPage - 3 ||
        i === currentPage + 3
      ) {
        buttons.push(<span key={`ellipsis-${i}`}>...</span>);
      }
    }

    // Botón siguiente
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Siguiente →
      </button>
    );

    return buttons;
  }, [filteredAndPaginatedData.totalPages, currentPage, handlePageChange]);

  // Componente de filtro de columna - optimizado con useCallback
  const ColumnFilter = useCallback(({ column, value, onChange, type = 'text', options = [] }) => {
    if (type === 'select') {
      return (
        <select
          value={value}
          onChange={(e) => onChange(column, e.target.value)}
          className="column-filter-select"
        >
          <option value="">Todos</option>
          {options.map(option => (
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
      <div className="table-container">
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          <p>No hay invitados disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      {/* Barra de búsqueda y filtros - FIJA */}
      <div className="table-filters">
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Búsqueda general por nombre, lado, relación, tipo o contacto..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="global-search-input"
          />
          <button onClick={clearAllFilters} className="clear-filters-btn">
            🗑️ Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Contenedor de scroll horizontal para la tabla */}
      <div className="table-scroll-container">
        {/* Tabla */}
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
                  <span>Invitado por</span>
                  <ColumnFilter
                    column="guestSide"
                    value={columnFilters.guestSide}
                    onChange={updateColumnFilter}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Relación</span>
                  <ColumnFilter
                    column="guestRelationship"
                    value={columnFilters.guestRelationship}
                    onChange={updateColumnFilter}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Tipo</span>
                  <ColumnFilter
                    column="guestType"
                    value={columnFilters.guestType}
                    onChange={updateColumnFilter}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Prioridad</span>
                  <ColumnFilter
                    column="guestPriority"
                    value={columnFilters.guestPriority}
                    onChange={updateColumnFilter}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Invitado</span>
                  <ColumnFilter
                    column="guestInvited"
                    value={columnFilters.guestInvited}
                    onChange={updateColumnFilter}
                    type="select"
                    options={[
                      { value: 'all', label: 'Todos' },
                      { value: 'YES', label: 'Sí' },
                      { value: 'NO', label: 'No' }
                    ]}
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
                  <span>Probabilidad</span>
                  <ColumnFilter
                    column="guestProbability"
                    value={columnFilters.guestProbability}
                    onChange={updateColumnFilter}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Asistirá</span>
                  <ColumnFilter
                    column="guestParticipation"
                    value={columnFilters.guestParticipation}
                    onChange={updateColumnFilter}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Contacto</span>
                  <ColumnFilter
                    column="guestPrimaryContact"
                    value={columnFilters.guestPrimaryContact}
                    onChange={updateColumnFilter}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Contacto Sec.</span>
                  <ColumnFilter
                    column="guestSecondaryContact"
                    value={columnFilters.guestSecondaryContact}
                    onChange={updateColumnFilter}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Inv. Impresa</span>
                  <ColumnFilter
                    column="guestInvitationDelivered"
                    value={columnFilters.guestInvitationDelivered}
                    onChange={updateColumnFilter}
                    type="select"
                    options={[
                      { value: 'all', label: 'Todos' },
                      { value: 'true', label: 'Sí' },
                      { value: 'false', label: 'No' }
                    ]}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Idioma</span>
                  <ColumnFilter
                    column="guestLanguage"
                    value={columnFilters.guestLanguage}
                    onChange={updateColumnFilter}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Pollo</span>
                  <ColumnFilter
                    column="guestChickenCountDesire"
                    value={columnFilters.guestChickenCountDesire}
                    onChange={updateColumnFilter}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Cerdo</span>
                  <ColumnFilter
                    column="guestPorkCountDesire"
                    value={columnFilters.guestPorkCountDesire}
                    onChange={updateColumnFilter}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Foráneo</span>
                  <ColumnFilter
                    column="guestForeigner"
                    value={columnFilters.guestForeigner}
                    onChange={updateColumnFilter}
                    type="select"
                    options={[
                      { value: 'all', label: 'Todos' },
                      { value: 'YES', label: 'Sí' },
                      { value: 'NO', label: 'No' }
                    ]}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Transporte</span>
                  <ColumnFilter
                    column="guestTransportCount"
                    value={columnFilters.guestTransportCount}
                    onChange={updateColumnFilter}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Personas Trans.</span>
                  <ColumnFilter
                    column="guestTransportCount"
                    value={columnFilters.guestTransportCount}
                    onChange={updateColumnFilter}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Link Invitación</span>
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Mesa</span>
                  <ColumnFilter
                    column="guestTableNumber"
                    value={columnFilters.guestTableNumber}
                    onChange={updateColumnFilter}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Estado del envío de la invitación</span>
                  <ColumnFilter
                    column="guestInvitationSent"
                    value={columnFilters.guestInvitationDelivered}
                    onChange={updateColumnFilter}
                    type="select"
                    options={[
                      { value: 'all', label: 'Todos' },
                      { value: 'true', label: 'Sí' },
                      { value: 'false', label: 'No' }
                    ]}
                  />
                </div>
              </th>
              <th>
                <div className="header-content">
                  <span>Acciones</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndPaginatedData.paginated.map((guest, index) => (
              <tr key={guest.guestInvitationId || index} className={getRowClassesFromDict(guest)}>
                <td className="column-name">{guest.guestName || 'N/A'}</td>
                <td>{guest.guestSide || 'N/A'}</td>
                <td>{guest.guestRelationship || 'N/A'}</td>
                <td>{guest.guestType || 'N/A'}</td>
                <td>{guest.guestPriority || 'N/A'}</td>
                <td>{guest.guestInvited === 'YES' ? '✅ Sí' : '❌ No'}</td>
                <td className="column-number">{guest.guestPassesNumberToRecibe || '0'}</td>
                <td>{guest.guestProbability || 'N/A'}</td>
                <td className="column-status">
                  {!guest.guestInvitationDelivered ? '⏳ Pendiente' : 
                   guest.guestParticipation > 0 && guest.guestInvitationResponse ? '✅ Sí' : '❌ No'}
                </td>
                <td className="column-email">{guest.guestPrimaryContact || 'N/A'}</td>
                <td className="column-email">{guest.guestSecondaryContact || 'N/A'}</td>
                <td>{guest.guestInvitationDelivered ? '✅ Sí' : '❌ No'}</td>
                <td>{guest.guestLanguage === 'Espanol' ? '🇪🇸 Español' : guest.guestLanguage || 'N/A'}</td>
                <td className="column-number">{guest.guestChickenCountDesire || '0'}</td>
                <td className="column-number">{guest.guestPorkCountDesire || '0'}</td>
                <td>{guest.guestForeigner === 'YES' ? '🌍 Sí' : '🏠 No'}</td>
                <td>{guest.guestTransportCount > 0 ? '🚗 Sí' : '❌ No'}</td>
                <td className="column-number">{guest.guestTransportCount || '0'}</td>
                <td className="column-actions">
                  <InvitationLink invitationId={guest.guestInvitationId} />
                </td>
                <td className="column-number">{guest.guestTableNumber || 'N/A'}</td>
                <td className={getStatusCellClassesFromDict(guest)}>
                  {!guest.guestInvitationDelivered ? '⏳ Pendiente' : '✅ Enviada'}
                </td>
                <td className="column-actions">
                  <MarkAsInvited userId={guest.guestInvitationId} guestData={guest} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación - FIJA */}
      <div className="pagination-container">
        <div className="pagination-info">
          Mostrando {((currentPage - 1) * rowsPerPage) + 1} a {Math.min(currentPage * rowsPerPage, filteredAndPaginatedData.totalFiltered)} de {filteredAndPaginatedData.totalFiltered} invitados
        </div>
        
        <div className="pagination-controls">
          <div className="rows-per-page">
            <label>Filas por página:</label>
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
  );
};

export default Table;