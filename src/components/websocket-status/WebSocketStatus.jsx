import { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import './WebSocketStatus.css';

const WebSocketStatus = () => {
  const { socketConnected, reconnectSocket } = useContext(DataContext);

  return (
    <div className="websocket-status">
      <div className={`status-indicator ${socketConnected ? 'connected' : 'disconnected'}`}>
        <span className="status-dot"></span>
        <span className="status-text">
          {socketConnected ? 'Conectado' : 'Desconectado'}
        </span>
      </div>
      
      {!socketConnected && (
        <button 
          className="reconnect-btn"
          onClick={reconnectSocket}
          title="Reconectar WebSocket"
        >
          🔄 Reconectar
        </button>
      )}
      
      <div className="status-info">
        <small>
          {socketConnected 
            ? '✅ Recibiendo actualizaciones en tiempo real' 
            : '❌ Sin conexión - no hay actualizaciones en tiempo real'
          }
        </small>
      </div>
    </div>
  );
};

export default WebSocketStatus; 