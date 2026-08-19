import { defineConfig, devices } from '@playwright/test'

import { baseDelSitio } from './scripts/base-del-sitio.mjs'

// La misma ruta base que usa el build: así las pruebas van contra exactamente
// lo que se publica, incluido el prefijo del que cuelga todo.
const BASE = baseDelSitio()
const PUERTO = 4173

/**
 * Las pruebas de extremo a extremo se hacen contra el BUILD DE PRODUCCIÓN y
 * servido bajo la misma ruta base que en GitHub Pages. Es a propósito: el
 * fallo clásico de este juego sería una ruta al sandbox escrita en absoluto,
 * que en desarrollo funciona y publicado da un 404.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PUERTO}${BASE}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Este entorno trae un Chromium ya instalado que puede no coincidir con
        // la versión que espera @playwright/test. Se apunta al que hay en vez de
        // descargar otro; si no existe, Playwright usa el suyo.
        launchOptions: process.env.CHROMIUM_DEL_SISTEMA
          ? { executablePath: process.env.CHROMIUM_DEL_SISTEMA }
          : {},
      },
    },
  ],
  webServer: {
    command: `npm run build && npx vite preview --port ${PUERTO} --strictPort`,
    url: `http://127.0.0.1:${PUERTO}${BASE}`,
    // Nunca se reaprovecha un servidor ya levantado: reutilizarlo significa
    // probar contra un build viejo, y eso da fallos que no existen y aprueba
    // arreglos que no están.
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
