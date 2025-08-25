# 🔧 Configuración de Variables de Entorno en Vercel

## 🚨 **Problema Identificado:**
Las variables de entorno `VITE_API_URL` no se están tomando correctamente en Vercel.

## ✅ **Solución Implementada:**

### 1. **Archivo vercel.json Simplificado**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**⚠️ IMPORTANTE:** NO agregues variables de entorno en `vercel.json`. Vercel las maneja automáticamente.

### 2. **auth.js Mejorado**
```javascript
const getApiUrl = () => {
  // En desarrollo, usar localhost
  if (import.meta.env.DEV) {
    return "http://localhost:8080";
  }
  
  // En producción, usar la variable de entorno
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log('🔧 VITE_API_URL:', apiUrl);
  
  if (apiUrl) {
    return apiUrl;
  }
  
  // Fallback para producción
  console.warn('⚠️ VITE_API_URL no configurada, usando fallback');
  return "https://tu-api-produccion.com";
};
```

## 🎯 **Configuración CORRECTA en Vercel:**

### **Paso 1: Ir al Dashboard de Vercel**
1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto

### **Paso 2: Configurar Variables de Entorno**
1. Ve a **Settings** → **Environment Variables**
2. Haz click en **Add New**
3. Configura la variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://tu-api-produccion.com` (tu URL real)
   - **Environment**: ✅ `Production`, ✅ `Preview`, ✅ `Development`
4. Haz click en **Save**

### **Paso 3: Redeploy**
1. Ve a **Deployments**
2. Haz click en **Redeploy** en el último deployment

## 🔍 **Verificación:**

### **En Desarrollo:**
- ✅ Usa `http://localhost:8080`
- ✅ Logs en consola muestran la URL

### **En Producción:**
- ✅ Usa la variable `VITE_API_URL` configurada en Vercel
- ✅ Logs en consola muestran la URL configurada
- ✅ Fallback si no está configurada

## 📝 **Archivos Modificados:**

1. **`vercel.json`** - ✅ Configuración simplificada (sin variables)
2. **`src/services/auth.js`** - ✅ Manejo mejorado de variables
3. **`versel.json`** - ❌ Eliminado (nombre incorrecto)

## 🚀 **Resultado Esperado:**

- ✅ **Variables de entorno** funcionando en Vercel
- ✅ **URLs correctas** en desarrollo y producción
- ✅ **Logs de debug** para verificar configuración
- ✅ **Fallback seguro** si algo falla

## ⚠️ **IMPORTANTE - NO HACER:**

- ❌ **NO agregues variables** en `vercel.json`
- ❌ **NO uses `@secret_name`** en la configuración
- ❌ **NO configures `env`** en `vercel.json`

## ✅ **IMPORTANTE - SÍ HACER:**

- ✅ **Configura variables** en el Dashboard de Vercel
- ✅ **Usa nombres exactos** como `VITE_API_URL`
- ✅ **Selecciona todos los entornos** (Production, Preview, Development)
- ✅ **Haz redeploy** después de configurar

## 🔧 **Solución al Error:**

El error **"Secret 'vite_api_url' does not exist"** se solucionó:
1. ✅ **Eliminando** la configuración incorrecta de `vercel.json`
2. ✅ **Configurando** la variable directamente en el Dashboard de Vercel
3. ✅ **Simplificando** la configuración del proyecto

¡Ahora las variables de entorno deberían funcionar correctamente en Vercel sin errores! 