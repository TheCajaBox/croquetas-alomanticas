import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { baseDelSitio } from './scripts/base-del-sitio.mjs'

// La ruta base sale del nombre del repositorio y no está escrita a mano: ver
// scripts/base-del-sitio.mjs. Todo lo que apunte a public/ debe construir su
// ruta con import.meta.env.BASE_URL, nunca con una ruta absoluta a pelo.
export default defineConfig({
  base: baseDelSitio(),
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
