# Sistema de Rutas y Autenticación

Este archivo explica cómo funciona el sistema de rutas protegidas y redirecciones automáticas en la aplicación.

## 🚀 Características Implementadas

- **Rutas protegidas** que requieren autenticación
- **Redirección automática** al login si no estás autenticado
- **Redirección automática** al dashboard si ya estás logueado
- **Página 404 personalizada** con navegación
- **Hooks personalizados** para manejar redirecciones
- **Configuración centralizada** de rutas

## 📁 Estructura de Archivos

```
src/
├── config/
│   └── routeConfig.js          # Configuración centralizada de rutas
├── hooks/
│   └── useAuthRedirect.js      # Hooks para redirecciones automáticas
├── components/
│   └── ProtectedRoute.jsx      # Componente de protección de rutas
├── pages/
│   ├── login/                  # Página de login
│   ├── dashboard/              # Dashboard protegido
│   └── notFound/               # Página 404 personalizada
└── context/
    └── AuthContext.jsx         # Contexto de autenticación
```

## 🔐 Flujo de Autenticación

### 1. **Usuario no autenticado visita `/`**
- ✅ Se muestra la página de login
- ✅ No hay redirección

### 2. **Usuario no autenticado visita `/dashboard`**
- ❌ Se redirige automáticamente a `/` (login)
- ✅ Se muestra la página de login

### 3. **Usuario hace login exitoso**
- ✅ Se redirige automáticamente a `/dashboard`
- ✅ Se muestra el dashboard protegido

### 4. **Usuario autenticado visita `/`**
- ✅ Se redirige automáticamente a `/dashboard`
- ✅ Se muestra el dashboard protegido

### 5. **Usuario hace logout**
- ✅ Se redirige automáticamente a `/` (login)
- ✅ Se muestra la página de login

## 🎯 Rutas de la Aplicación

### **Rutas Públicas** (No requieren autenticación)
- `/` - Página de login
- `*` - Página 404 (Not Found)

### **Rutas Protegidas** (Requieren autenticación)
- `/dashboard` - Dashboard principal
- `/guests` - Gestión de invitados (futuro)
- `/profile` - Perfil de usuario (futuro)

## 🔧 Hooks Disponibles

### **useRequireAuth()**
Para rutas que requieren autenticación:

```jsx
import { useRequireAuth } from '../hooks/useAuthRedirect';

function ProtectedComponent() {
  // Redirige automáticamente al login si no está autenticado
  useRequireAuth();
  
  return <div>Contenido protegido</div>;
}
```

### **useRequireGuest()**
Para rutas que solo deben ser accesibles para usuarios NO autenticados:

```jsx
import { useRequireGuest } from '../hooks/useAuthRedirect';

function LoginComponent() {
  // Redirige automáticamente al dashboard si ya está autenticado
  useRequireGuest();
  
  return <div>Formulario de login</div>;
}
```

### **useAuthRedirect(options)**
Hook personalizable para casos específicos:

```jsx
import { useAuthRedirect } from '../hooks/useAuthRedirect';

function CustomComponent() {
  useAuthRedirect({
    redirectTo: '/custom-dashboard',
    redirectIfNotAuth: '/custom-login',
    requireAuth: true
  });
  
  return <div>Componente personalizado</div>;
}
```

## 🛡️ Componente ProtectedRoute

El componente `ProtectedRoute` protege automáticamente las rutas:

```jsx
import ProtectedRoute from '../components/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DataProvider>
        <Dashboard />
      </DataProvider>
    </ProtectedRoute>
  } 
/>
```

**Características:**
- ✅ Verifica autenticación automáticamente
- ✅ Muestra pantalla de loading mientras verifica
- ✅ Redirige al login si no está autenticado
- ✅ Permite acceso si está autenticado

## 🔄 Redirecciones Automáticas

### **En App.jsx**
```jsx
// Ruta raíz - redirigir según autenticación
<Route 
  path="/" 
  element={
    isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />
  } 
/>
```

### **En componentes individuales**
```jsx
// En Login.jsx
useRequireGuest(); // Redirige al dashboard si ya está logueado

// En Dashboard.jsx
// No necesita hook porque ya está protegido por ProtectedRoute
```

## 📱 Página 404 Personalizada

La página de Not Found incluye:

- **Código de error 404** con animaciones
- **Mensaje descriptivo** del error
- **Botones de acción** para navegar
- **Información de soporte** técnico
- **Diseño responsive** y moderno
- **Animaciones** de elementos flotantes

### **Funcionalidades:**
- 🏠 **Ir al Inicio** - Redirige a `/`
- ⬅️ **Volver Atrás** - Usa `navigate(-1)`
- 📧 **Soporte técnico** - Enlace de email

## ⚙️ Configuración de Rutas

### **routeConfig.js**
```javascript
export const ROUTES = {
  PUBLIC: {
    LOGIN: '/',
    NOT_FOUND: '*'
  },
  PROTECTED: {
    DASHBOARD: '/dashboard'
  }
};

export const REDIRECTS = {
  IF_AUTHENTICATED: '/dashboard',
  IF_NOT_AUTHENTICATED: '/',
  AFTER_LOGIN: '/dashboard',
  AFTER_LOGOUT: '/'
};
```

### **Personalización:**
Puedes modificar las rutas y redirecciones editando este archivo.

## 🧪 Testing del Sistema

### **1. Probar redirección sin autenticación:**
1. Abre la aplicación sin estar logueado
2. Intenta acceder a `/dashboard` directamente
3. Verifica que se redirija automáticamente a `/`

### **2. Probar redirección con autenticación:**
1. Haz login en la aplicación
2. Intenta acceder a `/` directamente
3. Verifica que se redirija automáticamente a `/dashboard`

### **3. Probar página 404:**
1. Accede a una ruta que no existe (ej: `/invalid-route`)
2. Verifica que se muestre la página 404 personalizada
3. Prueba los botones de navegación

## 🔍 Debugging

### **Logs en consola:**
- ✅ Conexión exitosa al servidor
- ❌ Errores de conexión
- 🔄 Redirecciones automáticas
- 🛡️ Verificación de autenticación

### **Verificar estado de autenticación:**
```javascript
// En la consola del navegador
localStorage.getItem('bearerToken') // Debe existir si está autenticado
localStorage.getItem('userData')    // Debe existir si está autenticado
```

## 🎯 Próximos Pasos

1. **Configura tu servidor** con autenticación JWT
2. **Prueba las redirecciones** automáticas
3. **Personaliza las rutas** según tus necesidades
4. **Agrega más rutas protegidas** cuando sea necesario

## 🚨 Consideraciones Importantes

1. **Tokens JWT** deben estar configurados en el servidor
2. **CORS** debe estar habilitado para el dominio de tu app React
3. **localStorage** se usa para persistir la autenticación
4. **Redirecciones** son automáticas y transparentes para el usuario

¡Con esta configuración, tu aplicación maneja automáticamente la autenticación y las redirecciones! 