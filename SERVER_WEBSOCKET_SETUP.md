# Configuración del Servidor con WebSockets

Este archivo contiene las instrucciones específicas para configurar tu servidor Node.js/Express con WebSockets para que funcione con la aplicación React.

## 🔧 Instalación de Dependencias del Servidor

```bash
npm install socket.io
```

## 📁 Estructura del Servidor

```javascript
// server.js o app.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // URL de tu app React
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
```

## 🔌 Configuración de WebSockets

```javascript
// Función para emitir a todos los clientes conectados
function emitToAll(event, data) {
  io.emit(event, data);
  // console.log(`📡 Evento emitido: ${event}`, data);
}

// Manejo de conexiones WebSocket
io.on('connection', (socket) => {
  // console.log(`🔌 Cliente conectado: ${socket.id}`);
  
  // Cuando un cliente se desconecta
  socket.on('disconnect', () => {
    // console.log(`❌ Cliente desconectado: ${socket.id}`);
  });
  
  // Escuchar solicitudes de invitados
  socket.on('request-guests', async () => {
    try {
      const guests = await getAllGuests(); // Tu función existente
      emitToAll('guests-fetched', {
        action: 'fetched',
        count: guests.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al obtener invitados:', error);
    }
  });
  
  // Escuchar actualizaciones de invitados
  socket.on('guest-update', (guestData) => {
    // console.log('Actualización de invitado recibida:', guestData);
    // Aquí procesas la actualización en tu base de datos
    // Luego emites el evento a todos los clientes
    emitToAll('guest-updated', guestData);
  });
  
  // Escuchar nuevos invitados
  socket.on('guest-add', (guestData) => {
    // console.log('Nuevo invitado recibido:', guestData);
    // Aquí procesas la adición en tu base de datos
    // Luego emites el evento a todos los clientes
    emitToAll('guest-added', guestData);
  });
  
  // Escuchar eliminación de invitados
  socket.on('guest-remove', (guestData) => {
    // console.log('Eliminación de invitado recibida:', guestData);
    // Aquí procesas la eliminación en tu base de datos
    // Luego emites el evento a todos los clientes
    emitToAll('guest-removed', guestData);
  });
});
```

## 🚀 Endpoint GET /guests Actualizado

```javascript
// Tu endpoint existente actualizado
router.get("/guests", auth, async (req, res) => {
    try {
        const guests = await getAllGuests();
        
        // Emitir evento de socket SOLO cuando se obtienen todos los invitados
        emitToAll('guests-fetched', {
            action: 'fetched',
            count: guests.length,
            timestamp: new Date().toISOString()
        });
        
        res.status(200).json(guests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching guests", error: error.message });
    }
});
```

## 📡 Otros Endpoints que Deben Emitir Eventos

### POST /guests (Crear invitado)
```javascript
router.post("/guests", auth, async (req, res) => {
    try {
        const newGuest = await createGuest(req.body);
        
        // Emitir evento de nuevo invitado
        emitToAll('guest-added', newGuest);
        
        res.status(201).json(newGuest);
    } catch (error) {
        res.status(500).json({ message: "Error creating guest", error: error.message });
    }
});
```

### PATCH /guests/:id (Actualizar invitado)
```javascript
router.patch("/guests/:id", auth, async (req, res) => {
    try {
        const updatedGuest = await updateGuest(req.params.id, req.body);
        
        // Emitir evento de invitado actualizado
        emitToAll('guest-updated', updatedGuest);
        
        res.status(200).json(updatedGuest);
    } catch (error) {
        res.status(500).json({ message: "Error updating guest", error: error.message });
    }
});
```

### DELETE /guests/:id (Eliminar invitado)
```javascript
router.delete("/guests/:id", auth, async (req, res) => {
    try {
        await deleteGuest(req.params.id);
        
        // Emitir evento de invitado eliminado
        emitToAll('guest-removed', { id: req.params.id });
        
        res.status(200).json({ message: "Guest deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting guest", error: error.message });
    }
});
```

## 🔍 Logs del Servidor

El servidor debe mostrar estos logs cuando funcione correctamente:

```
🔌 Cliente conectado: [socket-id]
📡 Evento emitido: guests-fetched { action: 'fetched', count: 5, timestamp: '...' }
📡 Evento emitido: guest-added { id: 1, name: 'Juan', ... }
📡 Evento emitido: guest-updated { id: 1, name: 'Juan Carlos', ... }
📡 Evento emitido: guest-removed { id: 1 }
❌ Cliente desconectado: [socket-id]
```

## ⚠️ Consideraciones Importantes

1. **CORS**: Asegúrate de que CORS esté configurado correctamente
2. **Autenticación**: Los WebSockets pueden necesitar autenticación adicional
3. **Base de datos**: Los eventos se emiten DESPUÉS de que la operación en la BD sea exitosa
4. **Manejo de errores**: Siempre maneja errores antes de emitir eventos

## 🧪 Testing

Para probar que funciona:

1. **Inicia tu servidor** con WebSockets
2. **Abre la aplicación React** en múltiples pestañas
3. **Verifica en la consola del servidor** que aparezcan los logs de conexión
4. **Realiza operaciones CRUD** en una pestaña
5. **Verifica** que se actualice en tiempo real en las otras pestañas

## 🎯 Eventos que Debe Emitir tu Servidor

- `guests-fetched` - Al obtener todos los invitados
- `guest-added` - Al crear un nuevo invitado
- `guest-updated` - Al actualizar un invitado
- `guest-removed` - Al eliminar un invitado

## 🎯 Eventos que Escucha tu Servidor

- `request-guests` - Solicitud de invitados
- `guest-update` - Actualización de invitado
- `guest-add` - Agregar nuevo invitado
- `guest-remove` - Eliminar invitado

¡Con esta configuración, tu aplicación React recibirá actualizaciones en tiempo real cada vez que se realice una operación en el servidor! 