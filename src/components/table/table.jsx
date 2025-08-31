import './table.css';
import { useState, useMemo } from 'react';
import InvitationLink from '../invitation-link/invitationLink';
import MarkAsInvited from '../mark-as.invited/mark-as-invited';

const Table = ({ guestList }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar y paginar los datos
  const filteredAndPaginatedData = useMemo(() => {
    // Filtrar por término de búsqueda
    const filtered = guestList.filter(guest => 
      guest.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.guestSide?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.guestRelationship?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.guestType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.guestPrimaryContact?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcular paginación
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    
    return {
      filtered,
      paginated: filtered.slice(startIndex, endIndex),
      totalPages: Math.ceil(filtered.length / rowsPerPage),
      totalFiltered: filtered.length
    };
  }, [guestList, currentPage, rowsPerPage, searchTerm]);

  // Cambiar página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Cambiar filas por página
  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Resetear a la primera página
  };

  // Resetear búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Resetear a la primera página
  };

  // Generar botones de paginación
  const generatePaginationButtons = () => {
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
  };

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
      {/* Barra de búsqueda */}
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #e2e8f0',
        background: '#f8fafc'
      }}>
        <input
          type="text"
          placeholder="�� Buscar por nombre, lado, relación, tipo o contacto..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      {/* Tabla */}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Invitado por</th>
            <th>Relación</th>
            <th>Tipo</th>
            <th>Prioridad</th>
            <th>Invitado</th>
            <th>Pases</th>
            <th>Probabilidad</th>
            <th>Asistirá</th>
            <th>Contacto</th>
            <th>Contacto Sec.</th>
            <th>Inv. Impresa</th>
            <th>Inv. Enviada</th>
            <th>Idioma</th>
            <th>Pollo</th>
            <th>Cerdo</th>
            <th>Foráneo</th>
            <th>Transporte</th>
            <th>Personas Trans.</th>
            <th>Link Invitación</th>
            <th>Mesa</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndPaginatedData.paginated.map((guest, index) => (
            <tr key={guest.guestInvitationId || index}>
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
              <td>{guest.guestInvitationSent ? '✅ Sí' : '❌ No'}</td>
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
              <td className="column-status">
                {!guest.guestInvitationDelivered ? '⏳ Pendiente' : '✅ Enviada'}
              </td>
              <td className="column-actions">
                <MarkAsInvited userId={guest.guestInvitationId} guestData={guest} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
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