import { expect, test } from '@playwright/test'

/**
 * Recorrido real por el juego publicado: se resuelve un reto en cada uno de
 * los tres entornos, se comprueba que la protección contra bucles infinitos
 * funciona y que el sandbox no alcanza la partida guardada.
 */

/** Escribe en el editor de CodeMirror, que es un contenteditable. */
async function escribirCodigo(pagina, codigo) {
  const editor = pagina.locator('.cm-content')
  await editor.click()
  await pagina.keyboard.press('ControlOrMeta+a')
  await pagina.keyboard.press('Delete')
  await pagina.keyboard.insertText(codigo)
}

async function irAlReto(pagina, retoId) {
  await pagina.goto(`#/reto/${retoId}`)
  await expect(pagina.locator('h1')).toBeVisible()
}

const SOLUCIONES = {
  'es6-01-const-let': `const TARIFA_DIARIA = 25

function cobrar(dias) {
  return TARIFA_DIARIA * dias
}`,
  'vue2-01-instancia': `const componente = {
  data() {
    return { senor: 'Waxillium Ladrian', habitaciones: 34 }
  },
  template: '<section><h1>Casa Ladrian</h1><p class="senor">{{ senor }}</p><p class="habitaciones">{{ habitaciones }} habitaciones</p></section>',
}`,
  'vue3-01-ref-y-setup': `const { ref } = Vue

const componente = {
  setup() {
    const balas = ref(6)
    const disparar = () => { if (balas.value > 0) balas.value -= 1 }
    const recargar = () => { balas.value = 6 }
    return { balas, disparar, recargar }
  },
  template: '<div><p class="balas">{{ balas }}</p><button class="disparar" @click="disparar">Disparar</button><button class="recargar" @click="recargar">Recargar</button></div>',
}`,
}

test.beforeEach(async ({ page }) => {
  await page.goto('')
  await page.evaluate(() => localStorage.clear())
})

test('la portada presenta los cuatro mundos', async ({ page }) => {
  await page.goto('')
  await expect(page.getByRole('heading', { name: 'El primer día' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Los Áridos' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'La mansión Ladrian' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'La Nueva Seran' })).toBeVisible()
})

for (const [retoId, solucion] of Object.entries(SOLUCIONES)) {
  test(`se puede resolver un reto en el entorno de ${retoId.split('-')[0]}`, async ({ page }) => {
    await irAlReto(page, retoId)
    await escribirCodigo(page, solucion)
    await page.getByRole('button', { name: 'Ejecutar' }).click()

    await expect(page.getByText('Reto superado.')).toBeVisible({ timeout: 20_000 })
    // Y las croquetas llegan de verdad al marcador.
    await expect(page.locator('.contador.croquetas')).not.toHaveText('20')
  })
}

test('la vista previa pinta el componente de Vue', async ({ page }) => {
  await irAlReto(page, 'vue2-01-instancia')
  await escribirCodigo(page, SOLUCIONES['vue2-01-instancia'])
  await page.getByRole('button', { name: 'Ejecutar' }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible({ timeout: 20_000 })

  const sandbox = page.frameLocator('.marco-sandbox')
  await expect(sandbox.locator('.senor').first()).toHaveText('Waxillium Ladrian')
})

test('un bucle infinito se corta y la página sigue viva', async ({ page }) => {
  await irAlReto(page, 'es6-01-const-let')
  await escribirCodigo(page, 'const TARIFA_DIARIA = 25\nfunction cobrar(dias) { while (true) {} }')
  await page.getByRole('button', { name: 'Ejecutar' }).click()

  await expect(page.getByText(/Bucle sin salida|Se acabó el tiempo/)).toBeVisible({ timeout: 20_000 })
  // Si la pestaña se hubiera congelado, esto no respondería.
  await page.getByRole('link', { name: 'Mundos' }).click()
  await expect(page.getByRole('heading', { name: 'Los Áridos' })).toBeVisible()
})

test('la partida sobrevive a recargar la página', async ({ page }) => {
  await irAlReto(page, 'es6-01-const-let')
  await escribirCodigo(page, SOLUCIONES['es6-01-const-let'])
  await page.getByRole('button', { name: 'Ejecutar' }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible({ timeout: 20_000 })

  const croquetas = await page.locator('.contador.croquetas').textContent()

  await page.reload()
  await expect(page.locator('.contador.croquetas')).toHaveText(croquetas)
  await expect(page.locator('.contador.retos')).toHaveText(/^1\/\d+$/)
  // Y el reto sigue marcado como superado, con el código que se escribió.
  await expect(page.getByText('superado')).toBeVisible()
  await expect(page.locator('.cm-content')).toContainText('TARIFA_DIARIA')

  // El gato que se acaba de ganar sigue esperando en el refugio.
  await page.goto('#/refugio')
  await expect(page.getByRole('heading', { name: 'Acero' })).toBeVisible()
})

test('el sandbox no alcanza la partida guardada', async ({ page }) => {
  await page.goto('')
  await page.evaluate(() => localStorage.setItem('gatosYCodigo', '{"version":1,"secreto":"no mirar"}'))

  await irAlReto(page, 'vue2-01-instancia')
  await escribirCodigo(
    page,
    `const componente = {
  data() { return { hola: 'hola' } },
  template: '<p>{{ hola }}</p>',
}
const robado = window.parent.localStorage.getItem('gatosYCodigo')`,
  )
  await page.getByRole('button', { name: 'Ejecutar' }).click()

  await expect(page.getByText('Ha reventado al ejecutarlo')).toBeVisible({ timeout: 20_000 })
})

test('los sombreros se encuentran, se pagan y se guardan', async ({ page }) => {
  await page.goto('')

  // Están casi transparentes hasta que alguien pasa por encima: se pulsan igual.
  await expect(page.locator('.contador.sombreros')).toContainText('0/12')
  const croquetasAntes = Number(await page.locator('.contador.croquetas').textContent())

  await page.locator('.portada .sombrero-escondido').click()

  await expect(page.getByText('Sombrero encontrado')).toBeVisible()
  await expect(page.locator('.contador.sombreros')).toContainText('1/12')
  // Wayne jura que era suyo y lo paga.
  await expect
    .poll(async () => Number(await page.locator('.contador.croquetas').textContent()))
    .toBeGreaterThan(croquetasAntes)

  // Ya no está en su escondite y sí en la sombrerera.
  await expect(page.locator('.portada .sombrero-escondido')).toHaveCount(0)
  await page.goto('#/sombrerera')
  await expect(page.getByRole('heading', { name: 'El polvoriento' })).toBeVisible()
  await expect(page.getByText('1 de 12 encontrados')).toBeVisible()

  // Y sobrevive a recargar.
  await page.reload()
  await expect(page.locator('.contador.sombreros')).toContainText('1/12')
})

test('los retos del primer día se resuelven sin escribir código', async ({ page }) => {
  // Elegir la respuesta: se marca, se responde y se explican TODAS las opciones.
  await page.goto('#/reto/dia1-01-variables')
  await expect(page.getByRole('button', { name: /El apunte de Wax/ })).toBeVisible()
  await page.locator('.opcion').first().click()
  await page.getByRole('button', { name: 'Responder' }).click()

  await expect(page.getByText('Reto superado.')).toBeVisible()
  await expect(page.locator('.opcion .porque').first()).toBeVisible()

  // Emparejar: al juntar las seis parejas, el reto se da por resuelto.
  await page.goto('#/reto/dia1-02-tipos')
  await expect(page.getByText('0 de 6')).toBeVisible()

  const izquierda = page.locator('.columnas .columna').first().locator('button')
  const derecha = page.locator('.columnas .columna').last().locator('button')
  const textosIzquierda = await izquierda.allTextContents()

  const PAREJAS = {
    "'bombín'": 'Un texto',
    '42': 'Un número',
    'true': 'Un booleano: verdadero o falso',
    "['Acero', 'Bronce']": 'Una lista de valores en orden',
    "{ nombre: 'Wayne' }": 'Un objeto: valores con nombre',
    'null': 'Aquí no hay nada, y es a propósito',
  }

  for (const texto of textosIzquierda) {
    await izquierda.filter({ hasText: texto.trim() }).first().click()
    await derecha.filter({ hasText: PAREJAS[texto.trim()] }).first().click()
  }

  await expect(page.getByText('Reto superado.')).toBeVisible()
})

test('un reto de ordenar ejecuta el código en el orden que lo dejes', async ({ page }) => {
  await page.goto('#/reto/dia1-05-ordenar')
  // Se ejecuta tal cual viene barajado: sale mal, y sale mal explicando por qué.
  await page.getByRole('button', { name: 'Ejecutar en este orden' }).click()
  await expect(page.getByText(/Ha reventado al ejecutarlo|cuenta los tres gatos/)).toBeVisible({
    timeout: 20_000,
  })
})
