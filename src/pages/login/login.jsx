import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRequireGuest } from '../../hooks/useAuthRedirect';
import './login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  useRequireGuest(); // Redirigir automáticamente si ya está logueado

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(credentials);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch {
      setError('Error inesperado durante el login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setCredentials({
      email: 'demo@example.com',
      password: 'password'
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">🎉</span>
            <h1>Iniciar Sesión</h1>
          </div>
          <p className="subtitle">Accede a tu cuenta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Tu contraseña"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Iniciando...
              </>
            ) : (
              <>
                <span className="btn-icon">🚀</span>
                Iniciar Sesión
              </>
            )}
          </button>

          <button
            type="button"
            className="demo-button"
            onClick={handleDemoLogin}
            disabled={isLoading}
          >
            🧪 Usar Credenciales Demo
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;