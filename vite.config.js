import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// `base` tiene que coincidir con el nombre del repo para que funcione publicado
// en GitHub Pages. Todo lo que apunte a public/ debe construir su ruta con
// import.meta.env.BASE_URL, nunca con una ruta absoluta escrita a mano.
export default defineConfig({
  base: process.env.BASE_JUEGO ?? '/Dynamic-Quality-Forms/',
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    // Los retos de Vue necesitan DOM; cada fichero elige su entorno con un
    // comentario @vitest-environment en la primera línea.
  },
})
