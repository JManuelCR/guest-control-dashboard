import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * Hook para manejar redirecciones automáticas basadas en autenticación
 * @param {string} redirectTo - Ruta a la que redirigir si está autenticado
 * @param {string} redirectIfNotAuth - Ruta a la que redirigir si NO está autenticado
 * @param {boolean} requireAuth - Si requiere autenticación para la ruta actual
 */
export const useAuthRedirect = (options = {}) => {
  const { redirectTo = '/dashboard', redirectIfNotAuth = '/', requireAuth = false } = options;
  const { isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // No hacer nada mientras está cargando
    if (loading) return;

    if (requireAuth && !isLoggedIn) {
      // Si requiere autenticación pero no está logueado, redirigir al login
      navigate(redirectIfNotAuth, { replace: true });
    } else if (!requireAuth && isLoggedIn) {
      // Si NO requiere autenticación pero está logueado, redirigir al dashboard
      navigate(redirectTo, { replace: true });
    }
  }, [isLoggedIn, loading, requireAuth, redirectTo, redirectIfNotAuth, navigate]);

  return { isLoggedIn, loading };
};

/**
 * Hook para proteger rutas que requieren autenticación
 */
export const useRequireAuth = () => {
  return useAuthRedirect({ requireAuth: true });
};

/**
 * Hook para rutas que solo deben ser accesibles para usuarios NO autenticados
 */
export const useRequireGuest = () => {
  return useAuthRedirect({ requireAuth: false });
}; 