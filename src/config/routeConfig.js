// Configuración de rutas de la aplicación
export const ROUTES = {
  // Rutas públicas (no requieren autenticación)
  PUBLIC: {
    LOGIN: '/',
    NOT_FOUND: '*'
  },
  
  // Rutas protegidas (requieren autenticación)
  PROTECTED: {
    DASHBOARD: '/dashboard'
  }
};

// Configuración de redirecciones
export const REDIRECTS = {
  // A dónde redirigir si está autenticado
  IF_AUTHENTICATED: '/dashboard',
  
  // A dónde redirigir si NO está autenticado
  IF_NOT_AUTHENTICATED: '/',
  
  // A dónde redirigir después del login exitoso
  AFTER_LOGIN: '/dashboard',
  
  // A dónde redirigir después del logout
  AFTER_LOGOUT: '/'
};

// Configuración de protección de rutas
export const ROUTE_PROTECTION = {
  // Rutas que requieren autenticación
  REQUIRE_AUTH: [
    '/dashboard',
    '/guests',
    '/profile'
  ],
  
  // Rutas que solo deben ser accesibles para usuarios NO autenticados
  REQUIRE_GUEST: [
    '/',
    '/login',
    '/register'
  ]
};

// Función para verificar si una ruta requiere autenticación
export const isProtectedRoute = (path) => {
  return ROUTE_PROTECTION.REQUIRE_AUTH.some(route => 
    path.startsWith(route)
  );
};

// Función para verificar si una ruta es solo para invitados
export const isGuestOnlyRoute = (path) => {
  return ROUTE_PROTECTION.REQUIRE_GUEST.some(route => 
    path === route
  );
};

// Función para obtener la ruta de redirección apropiada
export const getRedirectRoute = (isAuthenticated, currentPath) => {
  if (isAuthenticated) {
    // Si está autenticado y está en una ruta de invitado, redirigir al dashboard
    if (isGuestOnlyRoute(currentPath)) {
      return REDIRECTS.IF_AUTHENTICATED;
    }
  } else {
    // Si NO está autenticado y está en una ruta protegida, redirigir al login
    if (isProtectedRoute(currentPath)) {
      return REDIRECTS.IF_NOT_AUTHENTICATED;
    }
  }
  
  // No hay redirección necesaria
  return null;
}; 