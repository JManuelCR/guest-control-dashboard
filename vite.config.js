import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // Cargar variables de entorno del archivo .env
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), '')
  
  // Detectar si estamos en build de producción (Vercel)
  const isProductionBuild = command === 'build'
  
  // Forzar modo de producción si es build
  const forcedMode = isProductionBuild ? 'production' : mode
  
  return {
    plugins: [react()],
    
    // Configuración para detectar correctamente el entorno
    define: {
      // Forzar modo de producción basado en build
      __DEV__: JSON.stringify(forcedMode === 'development'),
      __PROD__: JSON.stringify(forcedMode === 'production'),
      
      // Exponer variables de entorno con valores corregidos
      'import.meta.env.MODE': JSON.stringify(forcedMode),
      'import.meta.env.DEV': JSON.stringify(forcedMode === 'development'),
      'import.meta.env.PROD': JSON.stringify(forcedMode === 'production'),
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'import.meta.env.VITE_MODE': JSON.stringify(env.VITE_MODE),
      'import.meta.env.VITE_USER_NODE_ENV': JSON.stringify(env.VITE_USER_NODE_ENV),
    },
    
    // Configuración de build para Vercel
    build: {
      // Usar esbuild en lugar de terser para evitar problemas
      minify: 'esbuild',
      sourcemap: false,
      
      // Configuración de rollup
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    
    // Configuración de servidor de desarrollo
    server: {
      port: 3000,
      host: true,
    },
    
    // Configuración de preview
    preview: {
      port: 3000,
      host: true,
    },
  }
})
