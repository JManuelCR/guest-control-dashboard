import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { useGuestSocket } from '../../hooks/useGuestSocket';
import Table from "../../components/table/table";
import WebSocketStatus from '../../components/websocket-status/WebSocketStatus';
import GuestCounter from '../../components/guest-counter/GuestCounter';
import './dashboard.css';

const Dashboard = () => {
  const data = useContext(DataContext);
  const { reconnect } = useGuestSocket();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Verificación de seguridad
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
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
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
        <GuestCounter />
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
                  Total: <strong>{guests.length}</strong> invitados
                </span>
                <span className="connection-status">
                  {socketConnected ? '🟢 En tiempo real' : '🔴 Sin conexión'}
                </span>
              </div>
            </div>
            <Table guestList={guests} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;