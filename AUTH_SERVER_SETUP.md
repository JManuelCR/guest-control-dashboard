# Configuración del Servidor de Autenticación

Este archivo contiene las instrucciones para configurar tu servidor Node.js/Express con autenticación JWT para que funcione con la aplicación React.

## 🔧 Instalación de Dependencias del Servidor

```bash
npm install jsonwebtoken bcryptjs cors express
```

## 📁 Estructura del Servidor de Autenticación

```javascript
// server.js o app.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro';

app.use(cors());
app.use(express.json());
```

## 🔐 Configuración de JWT

```javascript
// Middleware para generar tokens JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      role: user.role || 'user'
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Middleware para verificar tokens JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
};
```

## 🚀 Endpoint de Login

```javascript
// POST /auth/login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Aquí deberías buscar el usuario en tu base de datos
    // Este es un ejemplo con datos hardcodeados para testing
    const users = [
      {
        id: 1,
        email: 'demo@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
        name: 'Usuario Demo'
      },
      {
        id: 2,
        email: 'admin@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
        name: 'Administrador'
      }
    ];

    // Buscar usuario por email
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    // Generar token JWT
    const token = generateToken(user);

    // Enviar respuesta exitosa
    res.status(200).json({
      message: 'Login exitoso',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
});
```

## 🔄 Endpoint de Refresh Token

```javascript
// POST /auth/refresh
app.post('/auth/refresh', authenticateToken, async (req, res) => {
  try {
    // El token ya fue verificado por authenticateToken
    const user = req.user;
    
    // Generar nuevo token
    const newToken = generateToken(user);
    
    res.status(200).json({
      message: 'Token renovado',
      token: newToken
    });
    
  } catch (error) {
    console.error('Error al renovar token:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
});
```

## 🚪 Endpoint de Logout

```javascript
// POST /auth/logout
app.post('/auth/logout', authenticateToken, async (req, res) => {
  try {
    // En una implementación real, podrías agregar el token a una blacklist
    // Para este ejemplo, solo enviamos una respuesta exitosa
    
    res.status(200).json({
      message: 'Logout exitoso'
    });
    
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
});
```

## 🛡️ Proteger Rutas con Autenticación

```javascript
// Ejemplo de ruta protegida
app.get('/guests', authenticateToken, async (req, res) => {
  try {
    // req.user contiene la información del usuario autenticado
    console.log('Usuario autenticado:', req.user);
    
    // Tu lógica para obtener invitados
    const guests = await getAllGuests();
    
    // Emitir evento de socket si tienes WebSockets configurado
    if (io) {
      io.emit('guests-fetched', {
        action: 'fetched',
        count: guests.length,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json(guests);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching guests", 
      error: error.message 
    });
  }
});
```

## 🔑 Credenciales de Testing

Para probar la aplicación, puedes usar estas credenciales:

```
Email: demo@example.com
Password: password

Email: admin@example.com
Password: password
```

## 📝 Variables de Entorno

Crea un archivo `.env` en tu servidor:

```bash
# .env
JWT_SECRET=tu-secreto-super-seguro-y-unico
PORT=8080
NODE_ENV=development
```

## 🧪 Testing de la Autenticación

### 1. Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password"}'
```

### 2. Usar Token en Ruta Protegida
```bash
curl -X GET http://localhost:8080/guests \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## ⚠️ Consideraciones de Seguridad

1. **JWT_SECRET**: Usa un secreto fuerte y único en producción
2. **Expiración**: Los tokens expiran en 24 horas por defecto
3. **HTTPS**: En producción, siempre usa HTTPS
4. **Validación**: Valida todos los inputs del usuario
5. **Rate Limiting**: Implementa límites de velocidad para prevenir ataques

## 🔄 Integración con WebSockets

Si tienes WebSockets configurado, puedes agregar autenticación:

```javascript
// En tu configuración de WebSockets
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    
    socket.user = decoded;
    next();
  });
});
```

## 🎯 Flujo Completo de Autenticación

1. **Usuario ingresa credenciales** en el formulario de login
2. **Servidor valida credenciales** y genera JWT
3. **Cliente almacena token** en localStorage
4. **Cliente incluye token** en todas las peticiones HTTP
5. **Servidor verifica token** en cada petición protegida
6. **Token expira** → Cliente redirigido al login

¡Con esta configuración, tu aplicación React tendrá un sistema de autenticación completo y seguro! 