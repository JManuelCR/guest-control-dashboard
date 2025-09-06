// Script de prueba para WebSocket
const { io } = require('socket.io-client');

const socketUrl = 'http://localhost:8080';

console.log('🧪 Iniciando prueba de WebSocket...');
console.log('🔗 Conectando a:', socketUrl);

const socket = io(socketUrl, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ WebSocket CONECTADO - ID:', socket.id);
  console.log('📡 Transporte:', socket.io.engine.transport.name);
  
  // Solicitar lista de invitados
  console.log('📋 Solicitando lista de invitados...');
  socket.emit('request-guests');
});

socket.on('disconnect', (reason) => {
  console.log('❌ WebSocket DESCONECTADO - Razón:', reason);
});

socket.on('connect_error', (error) => {
  console.error('🚨 Error de conexión WebSocket:', error);
});

socket.on('guests-fetched', (data) => {
  console.log('📋 Invitados obtenidos:', data);
});

socket.on('guest-updated', (data) => {
  console.log('🔄 Invitado actualizado:', data);
});

socket.on('guest-added', (data) => {
  console.log('➕ Invitado agregado:', data);
});

socket.on('guest-removed', (data) => {
  console.log('➖ Invitado eliminado:', data);
});

socket.on('guest-update-confirmed', (data) => {
  console.log('✅ Actualización confirmada:', data);
});

socket.on('guest-update-error', (error) => {
  console.error('🚨 Error en actualización:', error);
});

// Manejar ping/pong
socket.on('pong', () => {
  console.log('🏓 Pong recibido');
});

// Enviar ping cada 30 segundos
setInterval(() => {
  if (socket.connected) {
    console.log('🏓 Enviando ping...');
    socket.emit('ping');
  }
}, 30000);

// Cerrar conexión después de 2 minutos
setTimeout(() => {
  console.log('⏰ Cerrando conexión de prueba...');
  socket.disconnect();
  process.exit(0);
}, 120000);

console.log('⏳ Esperando conexión...');
