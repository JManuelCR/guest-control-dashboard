# Implementación de WebSockets para Gestión de Invitados

Este proyecto implementa un sistema de WebSockets en tiempo real para la gestión de invitados, permitiendo actualizaciones automáticas cuando se realizan operaciones CRUD en el endpoint GET /guests.

## 🚀 Características

- **Conexión en tiempo real** con el servidor WebSocket
- **Actualizaciones automáticas** de la lista de invitados
- **Reconexión automática** con backoff exponencial
- **Heartbeat** para mantener la conexión activa
- **Manejo de errores** robusto
- **Configuración centralizada** y fácil de mantener

## 📁 Estructura de Archivos

```
src/
├── config/
│   └── socketConfig.js          # Configuración centralizada de WebSockets
├── services/
│   └── guestSocketService.jsx   # Servicio principal de WebSockets
├── hooks/
│   └── useGuestSocket.jsx       # Hook personalizado para React
├── components/
│   ├── websocket-status/        # Componente de estado de conexión
│   └── guest-counter/           # Contador de invitados en tiempo real
└── context/
    └── DataProvider.jsx         # Proveedor de datos con WebSockets integrado
```

## 🔧 Configuración del Servidor

Para que el sistema funcione correctamente, tu servidor debe emitir los siguientes eventos:

### Eventos que debe emitir el servidor:

1. **`guests-fetched`** - Cuando se obtienen todos los invitados (GET /guests)
   ```javascript
   // En tu endpoint GET /guests
   socket.emit('guests-fetched', {
     count: guests.length,
     timestamp: new Date().toISOString()
   });
   ```

2. **`guest-updated`** - Cuando se actualiza un invitado
   ```javascript
   socket.emit('guest-updated', updatedGuestData);
   ```

3. **`guest-added`** - Cuando se agrega un nuevo invitado
   ```javascript
   socket.emit('guest-added', newGuestData);
   ```

4. **`guest-removed`** - Cuando se elimina un invitado
   ```javascript
   socket.emit('guest-removed', { id: guestId });
   ```

### Eventos que escucha el servidor:

1. **`request-guests`** - Solicitud de invitados
2. **`guest-update`** - Actualización de invitado
3. **`guest-add`** - Agregar nuevo invitado
4. **`guest-remove`** - Eliminar invitado

## 🎯 Uso en Componentes React

### Uso básico con el hook personalizado:

```jsx
import { useGuestSocket } from '../hooks/useGuestSocket';

function MyComponent() {
  const { guestsCount, lastFetchTime, isConnected, requestGuests } = useGuestSocket();

  return (
    <div>
      <p>Total de invitados: {guestsCount}</p>
      <p>Estado: {isConnected ? 'Conectado' : 'Desconectado'}</p>
      <button onClick={requestGuests}>Solicitar Invitados</button>
    </div>
  );
}
```

### Uso con el contexto de datos:

```jsx
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

function MyComponent() {
  const { 
    guests, 
    socketConnected, 
    requestGuestsViaSocket, 
    reconnectSocket 
  } = useContext(DataContext);

  return (
    <div>
      <p>Invitados: {guests.length}</p>
      <p>WebSocket: {socketConnected ? '✅' : '❌'}</p>
      <button onClick={requestGuestsViaSocket}>Solicitar via WebSocket</button>
      <button onClick={reconnectSocket}>Reconectar</button>
    </div>
  );
}
```

## ⚙️ Configuración

### Variables de entorno:

```bash
# .env
VITE_API_URL=http://localhost:8080
```

### Configuración personalizada:

```javascript
// src/config/socketConfig.js
export const SOCKET_CONFIG = {
  SERVER_URL: "http://tu-servidor.com",
  RECONNECTION: {
    ENABLED: true,
    MAX_ATTEMPTS: 10,
    DELAY: 2000
  }
};
```

## 🔍 Debugging

### Logs en consola:

El sistema proporciona logs detallados en la consola del navegador:

- ✅ Conexión exitosa
- ❌ Errores de conexión
- 🔄 Reconexión automática
- 📋 Eventos de invitados
- 💓 Heartbeat
- 📡 Emisión de eventos

### Verificar estado de conexión:

```javascript
const manager = new GuestSocketManager();
// console.log('Estado:', manager.isConnected());
// console.log('Stats:', manager.getConnectionStats());
```

## 🚨 Manejo de Errores

El sistema maneja automáticamente:

- **Pérdida de conexión** - Reconexión automática
- **Errores de red** - Reintentos con backoff
- **Timeouts** - Configuración personalizable
- **Fallbacks** - Degradación elegante

## 📱 Responsive Design

Los componentes están diseñados para funcionar en:

- **Desktop** - Layout horizontal
- **Tablet** - Layout adaptativo
- **Mobile** - Layout vertical

## 🧪 Testing

Para probar el sistema:

1. **Inicia tu servidor** con WebSockets habilitado
2. **Abre la aplicación** en múltiples pestañas
3. **Realiza cambios** en una pestaña
4. **Verifica** que se actualice en tiempo real en las otras

## 🔧 Personalización

### Agregar nuevos eventos:

```javascript
// En socketConfig.js
EVENTS: {
  // ... eventos existentes
  NEW_CUSTOM_EVENT: 'new-custom-event'
}

// En guestSocketService.jsx
this.socket.on(SOCKET_CONFIG.EVENTS.NEW_CUSTOM_EVENT, (data) => {
  // Manejar el nuevo evento
});
```

### Modificar comportamiento de reconexión:

```javascript
// En socketConfig.js
RECONNECTION: {
  ENABLED: true,
  MAX_ATTEMPTS: 3,
  DELAY: 5000,
  BACKOFF_MULTIPLIER: 2
}
```

## 📚 Dependencias

- `socket.io-client` - Cliente WebSocket
- `react` - Framework de UI
- `axios` - Cliente HTTP (para fallbacks)

## 🎉 ¡Listo!

Tu aplicación ahora tiene un sistema de WebSockets completo que:

- ✅ Se conecta automáticamente al servidor
- ✅ Recibe actualizaciones en tiempo real
- ✅ Maneja reconexiones automáticamente
- ✅ Proporciona feedback visual del estado
- ✅ Es fácil de mantener y extender

Para cualquier pregunta o problema, revisa los logs en la consola del navegador. 