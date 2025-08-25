import { useNavigate } from 'react-router-dom';
import './notFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">
          <span className="error-number">4</span>
          <span className="error-zero">0</span>
          <span className="error-number">4</span>
        </div>
        
        <h1 className="error-title">¡Página no encontrada!</h1>
        
        <p className="error-description">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        
        <div className="error-actions">
          <button onClick={handleGoHome} className="action-btn primary">
            🏠 Ir al Inicio
          </button>
          
          <button onClick={handleGoBack} className="action-btn secondary">
            ⬅️ Volver Atrás
          </button>
        </div>
        
        <div className="error-help">
          <p>¿Necesitas ayuda? Contacta con soporte técnico</p>
          <a href="mailto:soporte@example.com" className="support-link">
            📧 soporte@example.com
          </a>
        </div>
        
        <div className="error-illustration">
          <div className="floating-elements">
            <span className="floating-icon">🎉</span>
            <span className="floating-icon">📱</span>
            <span className="floating-icon">💻</span>
            <span className="floating-icon">🚀</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;