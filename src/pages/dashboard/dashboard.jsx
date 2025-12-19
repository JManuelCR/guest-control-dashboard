import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import { useContext, useEffect, useMemo, useState, memo, useCallback } from 'react';
import { DataContext } from '../../context/DataContext';
import { useGuestSocket } from '../../hooks/useGuestSocket';
import Table from "../../components/table/table";
import TableTickets from '../../components/tableTickets/tableTickets';
import WebSocketStatus from '../../components/websocket-status/WebSocketStatus';
import CountersSection from '../../components/counters-section/counters-section';
import './dashboard.css';

// Memoizar componentes para evitar re-renders innecesarios
const MemoizedTable = memo(Table);
const MemoizedTableTickets = memo(TableTickets);

const Dashboard = () => {
  const data = useContext(DataContext);
  const { reconnect } = useGuestSocket();
  const { user, logout } = useAuth();
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();
  const [guestList, setGuestList] = useState([]);
  const [view, setView] = useState('allGuests');
  
  if (!data) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }
  
  const { 
    guests, 
    loading, 
    error, 
    socketConnected,
    requestGuestsViaSocket
  } = data;
  
  useEffect(() => {
    const token = localStorage.getItem('bearerToken');
    const decodeToken = jwtDecode(token);
    const userType = decodeToken.userType;
  
    setUserType(userType);
    setGuestList(guests)
  }, [guests]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  const updateGuestsList = useCallback((guest) => {
    setGuestList(prev => prev.map( g => g.guestInvitationId === guest.guestInvitationId ? guest : g));
  }, []);

  const filteredForTickets = useMemo(() => 
    guestList.filter(guest => guest.guestParticipation > 0),
  [guestList]
  );

  const handleViewChange = useCallback((viewName) => {
    setView(viewName);
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Dashboard de Invitados</h1>
            <p>Gestión y control de invitados en tiempo real</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-avatar">👤</span>
              <span className="user-email">{user?.email || 'Usuario'}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
      
      <div className="dashboard-stats">
          {userType === 'admin' ? 
          <CountersSection />
           : <></>}
          <WebSocketStatus />
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-actions">
          <button 
            onClick={requestGuestsViaSocket}
            className="action-btn primary"
            disabled={!socketConnected}
          >
            🔄 Actualizar via WebSocket
          </button>
          
          <button 
            onClick={reconnect}
            className="action-btn secondary"
          >
            🔌 Reconectar WebSocket
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Cargando invitados...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>Error al cargar invitados: {error.message}</p>
            <button onClick={requestGuestsViaSocket} className="retry-btn">
              🔄 Reintentar
            </button>
          </div>
        ) : (
          <div className="table-section">
            <div className="table-header">
              <h2>Lista de Invitados</h2>
              <div className="table-info">
                <span className="guest-count">
                  Total: <strong>{guestList.length}</strong> invitados
                </span> 
                <span className="connection-status">
                  {socketConnected ? '🟢 En tiempo real' : '🔴 Sin conexión'}
                </span>
              </div>
            </div>
            {
              userType === 'admin' ?
              (<div className='adminTableView'>
                <div className="button-group">
                  <button 
                    className={`buttonViewSelect ${view === 'allGuests' ? 'active' : ''}`} 
                    onClick={() => handleViewChange('allGuests')}
                  >
                    📋 Todos los invitados
                  </button>
                  <button 
                    className={`buttonViewSelect ${view === 'tickets' ? 'active' : ''}`} 
                    onClick={() => handleViewChange('tickets')}
                  >
                    🎟️ Asignación de mesas
                  </button>
                </div>
                {
                  view === 'allGuests' ?
                  <MemoizedTable guestList={guestList} /> : 
                  <MemoizedTableTickets guestList={filteredForTickets} onGuestUpdated={updateGuestsList}/>  
                }
              </div>) : (<MemoizedTableTickets guestList={filteredForTickets} onGuestUpdated={updateGuestsList}/>)
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;