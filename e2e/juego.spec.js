import { readdirSync } from 'node:fs'

import { expect, test } from '@playwright/test'

import { MUNDOS } from '../src/contenido/mundos.js'

/**
 * Recorrido real por el juego publicado: se resuelve un reto en cada uno de
 * los tres entornos, se comprueba que la protección contra bucles infinitos
 * funciona y que el sandbox no alcanza la partida guardada.
 */

/**
 * Los ids de los retos de un mundo, leídos del contenido.
 *
 * No se puede usar `contenido/retos/index.js` porque se monta con
 * `import.meta.glob`, que es de Vite y aquí no existe; así que se lee la
 * carpeta y se importa cada reto, que son módulos normales.
 *
 * Escritos a mano se desfasaban en cuanto se añadía un reto, y el síntoma no
 * decía nada: el mundo dejaba de estar completo y el repaso redirigía a la
 * portada.
 */
async function idsDelMundo(mundo) {
  const carpeta = new URL(`../src/contenido/retos/${mundo}/`, import.meta.url)
  const ficheros = readdirSync(carpeta).filter((f) => f.endsWith('.js')).sort()
  const ids = []
  for (const fichero of ficheros) {
    ids.push((await import(new URL(fichero, carpeta).href)).default.id)
  }
  return ids
}

/** Escribe en el editor de CodeMirror, que es un contenteditable. */
async function escribirCodigo(pagina, codigo) {
  const editor = pagina.locator('.cm-content')
  await editor.click()
  await pagina.keyboard.press('ControlOrMeta+a')
  await pagina.keyboard.press('Delete')
  await pagina.keyboard.insertText(codigo)
}

/** Todos los retos de todos los mundos, leídos una sola vez por proceso. */
let catalogo = null
async function todosLosRetos() {
  if (!catalogo) {
    catalogo = {}
    for (const mundo of MUNDOS) catalogo[mundo.id] = await idsDelMundo(mundo.id)
  }
  return catalogo
}

/**
 * Lo que hay que llevar hecho para que un reto esté abierto: los anteriores de
 * su mundo, y enteros los mundos que el suyo exige.
 */
async function loAnterior(retoId) {
  const todos = await todosLosRetos()
  const mundo = MUNDOS.find((m) => todos[m.id].includes(retoId))
  if (!mundo) throw new Error(`no encuentro el reto ${retoId}`)

  const pendientes = Array.isArray(mundo.requiere)
    ? [...mundo.requiere]
    : mundo.requiere
      ? [mundo.requiere]
      : []
  const previos = []
  while (pendientes.length > 0) {
    const id = pendientes.shift()
    if (previos.includes(id)) continue
    previos.unshift(id)
    const exigidos = MUNDOS.find((m) => m.id === id)?.requiere
    if (exigidos) pendientes.push(...(Array.isArray(exigidos) ? exigidos : [exigidos]))
  }

  const ids = previos.flatMap((id) => todos[id])
  return [...ids, ...todos[mundo.id].slice(0, todos[mundo.id].indexOf(retoId))]
}

/**
 * Da por superado todo lo anterior a un reto.
 *
 * Un reto solo se abre con el anterior hecho -antes se entraba a cualquiera
 * por la dirección, y Armonía enlazaba lecciones cerradas-, así que los
 * recorridos que empiezan por en medio siembran lo de antes en vez de
 * resolverlo, que ya se prueba en otro sitio.
 *
 * Se siembra con `addInitScript` porque el autoguardado pisa cualquier cosa
 * escrita en localStorage con la partida ya en marcha, y se fusiona con lo que
 * haya en vez de sustituirlo, para no borrar lo que el test lleve hecho.
 */
async function sembrarLoAnterior(pagina, retoId) {
  const ids = await loAnterior(retoId)
  if (ids.length === 0) return false

  await pagina.addInitScript((anteriores) => {
    const partida = JSON.parse(localStorage.getItem('gatosYCodigo') ?? '{"version":1}')
    const progreso = partida.progreso ?? {}
    const retos = { ...(progreso.retos ?? {}) }
    for (const id of anteriores) {
      // Se conserva lo que hubiera -intentos, pistas, borrador- pero se da por
      // superado igual: si el test ha dejado uno a medias por el camino, su
      // mundo se quedaría sin terminar y el siguiente, cerrado.
      retos[id] = {
        intentos: 1,
        fallos: 0,
        pistasUsadas: [],
        codigoGuardado: null,
        ...(retos[id] ?? {}),
        superado: true,
        superadoEn: retos[id]?.superadoEn ?? Date.now(),
      }
    }
    localStorage.setItem('gatosYCodigo', JSON.stringify({ ...partida, progreso: { ...progreso, retos } }))
  }, ids)
  return true
}

async function irAlReto(pagina, retoId) {
  if (await sembrarLoAnterior(pagina, retoId)) {
    // El guion sembrado solo corre al cargar el documento, y saltar de
    // almohadilla en almohadilla no recarga nada. Se recarga ANTES de pedir el
    // reto: si se pide primero, el candado ve la partida vieja y desvía.
    await pagina.goto('#/')
    await pagina.reload()
  }
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

test('la portada presenta los siete mundos', async ({ page }) => {
  await page.goto('')
  await expect(page.getByRole('heading', { name: 'El primer día' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Los Áridos' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'La mansión Ladrian' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'La Nueva Seran' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Cambio de forma' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'La comisaría' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'El taller' })).toBeVisible()
})

for (const [retoId, solucion] of Object.entries(SOLUCIONES)) {
  test(`se puede resolver un reto en el entorno de ${retoId.split('-')[0]}`, async ({ page }) => {
    await irAlReto(page, retoId)
    await escribirCodigo(page, solucion)
    await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()

    await expect(page.getByText('Reto superado.')).toBeVisible({ timeout: 20_000 })
    // Y las croquetas llegan de verdad al marcador.
    await expect(page.locator('.contador.croquetas')).not.toHaveText('20')
  })
}

test('la vista previa pinta el componente de Vue', async ({ page }) => {
  await irAlReto(page, 'vue2-01-instancia')
  await escribirCodigo(page, SOLUCIONES['vue2-01-instancia'])
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible({ timeout: 20_000 })

  const sandbox = page.frameLocator('.marco-sandbox')
  await expect(sandbox.locator('.senor').first()).toHaveText('Waxillium Ladrian')
})

test('un bucle infinito se corta y la página sigue viva', async ({ page }) => {
  await irAlReto(page, 'es6-01-const-let')
  await escribirCodigo(page, 'const TARIFA_DIARIA = 25\nfunction cobrar(dias) { while (true) {} }')
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()

  await expect(page.getByText(/Bucle sin salida|Se acabó el tiempo/)).toBeVisible({ timeout: 20_000 })
  // Si la pestaña se hubiera congelado, esto no respondería.
  await page.getByRole('link', { name: 'Mundos' }).click()
  await expect(page.getByRole('heading', { name: 'Los Áridos' })).toBeVisible()
})

test('la partida sobrevive a recargar la página', async ({ page }) => {
  await irAlReto(page, 'es6-01-const-let')
  const superadosAntes = Number((await page.locator('.contador.retos').textContent()).split('/')[0])
  await escribirCodigo(page, SOLUCIONES['es6-01-const-let'])
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible({ timeout: 20_000 })

  const croquetas = await page.locator('.contador.croquetas').textContent()

  await page.reload()
  await expect(page.locator('.contador.croquetas')).toHaveText(croquetas)
  await expect(page.locator('.contador.retos')).toHaveText(new RegExp(`^${superadosAntes + 1}/`))
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
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()

  await expect(page.getByText('Ha reventado al ejecutarlo')).toBeVisible({ timeout: 20_000 })
})

test('a una lección cerrada no se entra, ni por la barra ni por Armonía', async ({ page }) => {
  // Por la dirección: devuelve al mundo, que enseña dónde te has quedado.
  await page.goto('#/reto/com-06-el-bucle')
  await expect(page.getByRole('heading', { name: 'La comisaría' })).toBeVisible()
  await expect(page.locator('h1')).not.toContainText('bucle')

  // Y por las citas de Armonía, que era la puerta de atrás: cita lo que hay,
  // pero lo cerrado no se pulsa.
  await irAlReto(page, 'dia1-01-variables')
  await preguntarAArmonia(page, '¿qué es un bucle?')

  const citas = page.locator('.cajon .citas li')
  await expect(citas.first()).toBeVisible()
  await expect(page.locator('.cajon .citas a')).toHaveCount(0)
  await expect(citas.filter({ hasText: 'todavía cerrado' }).first()).toBeVisible()
})

/** Mete gatos ya adoptados en la partida, sin tener que ganárselos aquí. */
async function sembrarColonia(pagina, ids, { limpieza = 40, felicidad = 88 } = {}) {
  await pagina.addInitScript(
    ([gatos, cuanta, animo]) => {
      const colonia = {}
      for (const id of gatos) {
        colonia[id] = {
          adoptado: true,
          comida: 90,
          felicidad: animo,
          limpieza: cuanta,
          ultimoCuidado: {},
          adoptadoEn: Date.now(),
        }
      }
      const partida = JSON.parse(localStorage.getItem('gatosYCodigo') ?? '{"version":1}')
      partida.gatos = { colonia, ultimaActualizacion: Date.now(), bonusUsadosHoy: {} }
      localStorage.setItem('gatosYCodigo', JSON.stringify(partida))
    },
    [ids, limpieza, felicidad],
  )
}

test('la colonia es una casa con jardín y los gatos se mueven por ella', async ({ page }) => {
  await sembrarColonia(page, ['acero', 'hierro', 'peltre'])
  await page.goto('#/colonia')
  await page.reload()

  await expect(page.locator('.escena .lienzo')).toBeVisible()
  await expect(page.locator('.paseante')).toHaveCount(3)

  // Se mueven de verdad: la misma escena un segundo después no está igual.
  const donde = () => page.locator('.paseante').first().getAttribute('transform')
  const antes = await donde()
  await expect.poll(donde, { timeout: 15_000 }).not.toBe(antes)

  // Y se pulsan para atenderlos, que es a lo que se viene.
  await page.locator('.paseante').first().click()
  await expect(page.locator('.tarjeta .acciones')).toBeVisible()
  await page.getByRole('button', { name: 'Cerrar' }).click()
  await expect(page.locator('.tarjeta')).toHaveCount(0)
})

test('cepillar a un gato es arrastrar por encima', async ({ page }) => {
  await sembrarColonia(page, ['acero'], { limpieza: 20 })
  await page.goto('#/colonia')
  await page.reload()

  await page.locator('.paseante').first().click()
  await expect(page.getByText('Aseo')).toBeVisible()
  await page.getByRole('button', { name: 'Cepillar' }).click()

  const zona = page.locator('.zona')
  const caja = await zona.boundingBox()
  await page.mouse.move(caja.x + 30, caja.y + caja.height / 2)
  await page.mouse.down()
  // El cepillo se ve mientras se arrastra, y solo mientras se arrastra.
  await page.mouse.move(caja.x + caja.width - 30, caja.y + 60, { steps: 6 })
  await expect(page.locator('.brocha')).toBeVisible()

  for (let vuelta = 0; vuelta < 5; vuelta += 1) {
    await page.mouse.move(caja.x + 30, caja.y + 50 + vuelta * 12, { steps: 6 })
    await page.mouse.move(caja.x + caja.width - 30, caja.y + 56 + vuelta * 12, { steps: 6 })
  }
  await page.mouse.up()

  // Y el aseo sube de verdad: el cuidado se aplica al terminar el arrastre.
  await expect(page.locator('.estado', { hasText: 'Aseo' })).toContainText('70')
})

test('jugar con un gato es que persiga una pluma', async ({ page }) => {
  await sembrarColonia(page, ['acero'], { felicidad: 40 })
  await page.goto('#/colonia')
  await page.reload()

  await page.locator('.paseante').first().click()
  await page.getByRole('button', { name: 'Jugar', exact: true }).click()
  await expect(page.getByText('Pásale la pluma por delante.')).toBeVisible()

  const zona = page.locator('.zona')
  const caja = await zona.boundingBox()
  const zarpazos = () => page.locator('.huella.dada').count()

  await page.mouse.move(caja.x + caja.width / 2, caja.y + caja.height / 2)
  await page.mouse.down()

  // Cuatro esquinas, esperando a que llegue: el gato persigue, no aparece.
  const esquinas = [[0.22, 0.24], [0.8, 0.8], [0.2, 0.82], [0.82, 0.2]]
  for (let vuelta = 0; vuelta < esquinas.length; vuelta += 1) {
    const [ex, ey] = esquinas[vuelta]
    const x = caja.x + caja.width * ex
    const y = caja.y + caja.height * ey
    await page.mouse.move(x, y, { steps: 12 })
    // Se le mueve un poco delante de las narices mientras se espera, que
    // quieta del todo -y con razón- deja de picar.
    await expect
      .poll(async () => {
        await page.mouse.move(x + (vuelta % 2 ? 1 : -1), y)
        return zarpazos()
      }, { timeout: 15_000 })
      .toBeGreaterThan(vuelta)
  }
  await page.mouse.up()

  await expect(page.getByText('Se ha quedado a gusto.')).toBeVisible()
  // Y el ánimo sube de verdad, con lo que eso despierta.
  await expect(page.locator('.estado', { hasText: 'Ánimo' })).toContainText('75')
})

test('los sombreros se encuentran, se pagan y se guardan', async ({ page }) => {
  await page.goto('')

  // Están casi transparentes hasta que alguien pasa por encima: se pulsan igual.
  await expect(page.locator('.contador.sombreros')).toContainText('0/14')
  const croquetasAntes = Number(await page.locator('.contador.croquetas').textContent())

  await page.locator('.portada .sombrero-escondido').click()

  await expect(page.getByText('Sombrero encontrado')).toBeVisible()
  await expect(page.locator('.contador.sombreros')).toContainText('1/14')
  // Wayne jura que era suyo y lo paga.
  await expect
    .poll(async () => Number(await page.locator('.contador.croquetas').textContent()))
    .toBeGreaterThan(croquetasAntes)

  // Ya no está en su escondite y sí en la sombrerera.
  await expect(page.locator('.portada .sombrero-escondido')).toHaveCount(0)
  await page.goto('#/sombrerera')
  await expect(page.getByRole('heading', { name: 'El polvoriento' })).toBeVisible()
  await expect(page.getByText('1 de 14 encontrados')).toBeVisible()

  // Y sobrevive a recargar.
  await page.reload()
  await expect(page.locator('.contador.sombreros')).toContainText('1/14')
})

test('la racha se ve en la cabecera y se pierde al comprar una pista', async ({ page }) => {
  // Se siembra una racha de uno: encadenar dos retos a mano aquí no aportaría
  // nada y ataría la prueba a cómo se resuelve cada tipo.
  // Y el segundo reto por hecho, que si no el tercero está cerrado. Se siembra
  // aquí y no con `irAlReto` para no perder la racha: sembrar recarga, y esta
  // partida se escribe entera en cada carga.
  await page.addInitScript(() => {
    const hecho = { superado: true, intentos: 1, fallos: 0, pistasUsadas: [], superadoEn: Date.now() }
    localStorage.setItem(
      'gatosYCodigo',
      JSON.stringify({
        version: 1,
        progreso: { rachaSinPistas: 1, mejorRacha: 1, retos: { 'dia1-02-tipos': hecho } },
      }),
    )
  })

  // Con uno no hay racha que enseñar.
  await page.goto('#/reto/dia1-01-variables')
  await page.reload()
  await expect(page.locator('.contador.racha')).toHaveCount(0)

  // El segundo sin pistas ya la saca.
  await page.locator('.opcion').first().click()
  await page.getByRole('button', { name: 'Responder' }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible()
  await expect(page.locator('.contador.racha')).toContainText('2')

  // Y comprar una pista en el siguiente la rompe.
  await page.goto('#/reto/dia1-03-const-o-let')
  await expect(page.getByRole('heading', { name: /Lo que se mueve/ })).toBeVisible()
  await page.getByRole('button', { name: /Pista 1/ }).click()
  // Se espera a que la pista esté abierta de verdad: contestar antes deja la
  // compra a medias y la racha no se entera de que había una pista pedida.
  await expect(page.locator('.pistas li.abierta')).toHaveCount(1)
  // Este tiene dos correctas, así que hay que marcar las dos.
  await page.locator('.opcion').nth(0).click()
  await page.locator('.opcion').nth(1).click()
  await page.getByRole('button', { name: 'Responder' }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible()
  await expect(page.locator('.contador.racha')).toHaveCount(0)
})

test('cerrar un mundo tiene su momento, y las insignias no pagan', async ({ page }) => {
  const ids = await idsDelMundo('primer-dia')
  const croquetasIniciales = 12

  // Todo el mundo resuelto salvo el jefe, para llegar a él sin repetirlo aquí.
  await page.addInitScript((sinJefe) => {
    const retos = {}
    for (const id of sinJefe) {
      retos[id] = { superado: true, intentos: 1, pistasUsadas: [], superadoEn: Date.now() }
    }
    localStorage.setItem('gatosYCodigo', JSON.stringify({ version: 1, progreso: { retos } }))
  }, ids.slice(0, -1))

  await page.goto(`#/reto/${ids.at(-1)}`)
  await page.reload()

  await escribirCodigo(page, 'function saludar(nombre) {\n  return `Buenas, ${nombre}.`\n}')
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible({ timeout: 20_000 })

  // El cierre del mundo, con su despedida y su enlace al repaso.
  const cierre = page.locator('.cierre')
  await expect(cierre).toBeVisible()
  await expect(cierre).toContainText('El primer día, terminado')
  await expect(cierre.getByRole('link', { name: /repaso de Marasi/ })).toBeVisible()

  // Y la insignia, que se apunta y no toca el saldo.
  await page.goto('#/trastos')
  await expect(page.getByText('Primer día resuelto')).toBeVisible()
  const croquetas = Number(await page.locator('.contador.croquetas').textContent())
  await expect(page.getByText(/de 18 insignias/)).toBeVisible()
  // Lo ganado sale de los retos, nunca de las insignias.
  expect(croquetas).toBeGreaterThan(croquetasIniciales)
})

test('los cuatro tipos de señalar se resuelven y explican', async ({ page }) => {
  // Poner nombre: se elige la etiqueta y se pulsa el trozo al que corresponde.
  await irAlReto(page, 'dia1-06b-poner-nombre')
  const etiquetar = page.locator('.etiquetar')
  for (const [etiqueta, trozo] of [
    ['nombre de la función', 'saludar'],
    ['parámetro', 'nombre'],
    ['cuerpo', 'return `Buenas, ${nombre}`'],
    ['llamada', "saludar('Wayne')"],
  ]) {
    await etiquetar.locator('.etiqueta', { hasText: etiqueta }).first().click()
    // Por etiqueta accesible y no por texto: al colocar un nombre, el trozo se
    // lo queda dentro y pasaría a colar en las búsquedas de los siguientes.
    await etiquetar.getByRole('button', { name: `Trozo ${trozo}`, exact: true }).click()
  }
  await page.getByRole('button', { name: 'Comprobar' }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible()
  // Al terminar se repasa cómo se llama cada cosa, se acierte o no.
  await expect(etiquetar.locator('.repaso')).toBeVisible()

  // Verdadero o falso: se marcan todas y se corrigen juntas.
  await irAlReto(page, 'es6-06b-verdadero-o-falso')
  const vof = page.locator('.vof')
  await expect(page.getByRole('button', { name: 'Te falta marcar alguna' })).toBeDisabled()
  for (const afirmacion of await vof.locator('.afirmacion').all()) {
    await afirmacion.getByRole('button', { name: 'Verdadero' }).click()
  }
  await page.getByRole('button', { name: 'Corregir' }).click()
  // Marcarlas todas verdaderas falla, y aun así se explica cada una.
  await expect(page.locator('.resultados')).not.toContainText('Reto superado')
  await expect(vof.locator('.porque')).toHaveCount(6)

  // Cazar la línea: se señala la culpable, que no es donde revienta.
  await irAlReto(page, 'taller-04b-la-linea-culpable')
  const cazar = page.locator('.cazar')
  await cazar.getByRole('button', { name: 'Línea 7' }).click()
  await page.getByRole('button', { name: 'Es la línea 7' }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible()
  await expect(cazar.locator('.veredicto.bien')).toContainText('La línea 7 era')

  // Seguir el hilo: se rellena la tabla y salta sola a la casilla siguiente.
  await irAlReto(page, 'com-06b-seguir-el-hilo')
  const trazar = page.locator('.trazar')
  for (const valor of ['(no existe)', '0', '12', '12', '30', '42', '8', '50', '(no existe)', '50']) {
    await trazar.locator('.valor-ficha', { hasText: valor }).first().click()
  }
  await page.getByRole('button', { name: 'Comprobar la traza' }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible()
  await expect(trazar.locator('.veredicto.bien')).toBeVisible()
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
  await irAlReto(page, 'dia1-05-ordenar')
  // Se ejecuta tal cual viene barajado: sale mal, y sale mal explicando por qué.
  await page.getByRole('button', { name: 'Ejecutar en este orden' }).click()
  await expect(page.getByText(/Ha reventado al ejecutarlo|cuenta los tres gatos/)).toBeVisible({
    timeout: 20_000,
  })
})

test('Steris traduce los errores que asustan', async ({ page }) => {
  await irAlReto(page, 'es6-01-const-let')
  // Una errata, que es el fallo más común de quien empieza.
  await escribirCodigo(page, 'const TARIFA_DIARIA = 25\nfunction cobrar(dias) { return TARIFA_DIARIA * diaz }')
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()

  await expect(page.getByText('Steris lo tenía previsto')).toBeVisible({ timeout: 20_000 })
  await expect(page.getByText('Estás usando un nombre que no existe')).toBeVisible()
  await expect(page.locator('.imprevisto .causas li').first()).toContainText('errata')
})

test('los términos del glosario se pueden pulsar sin salir del reto', async ({ page }) => {
  await irAlReto(page, 'dia1-07-primera-funcion')

  // Los términos se detectan solos en el enunciado y en el apunte.
  await expect(page.locator('.termino').first()).toBeVisible()
  await page.locator('.termino').first().click()

  await expect(page.getByText('Del glosario de Steris')).toBeVisible()
  await expect(page.locator('.ficha .definicion')).not.toBeEmpty()

  // Y al cambiar de pantalla se cierra: si no, su fondo bloquea la siguiente.
  await page.goto('#/glosario')
  await expect(page.locator('.fondo')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'El glosario de Steris' })).toBeVisible()
})

test('la antesala explica de qué va todo esto', async ({ page }) => {
  await page.goto('')
  // Mientras no se haya leído, la portada la ofrece.
  await page.getByText('¿No has programado nunca?').click()

  await expect(page.getByRole('heading', { name: 'Antes de empezar' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Qué es un programa' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Contingencias previstas' })).toBeVisible()

  // Leída una vez, la portada deja de insistir.
  await page.goto('')
  await expect(page.getByText('¿No has programado nunca?')).toHaveCount(0)
})

test('un reto de refactor de MeLaan valida la forma, no solo el resultado', async ({ page }) => {
  await irAlReto(page, 'melaan-01-de-bucle-a-metodo')

  // El código de partida ya pasa los tests: lo que suspende es la forma.
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.locator('.resultados')).toContainText('Las normas del reto')
  await expect(page.locator('.resultados')).not.toContainText('Reto superado')

  await escribirCodigo(page, `function nombresCaros(metales, minimo) {
  return metales
    .filter((metal) => metal.precio >= minimo)
    .map((metal) => metal.nombre.toUpperCase())
}

function valorTotal(metales) {
  return metales.reduce((suma, metal) => suma + metal.precio, 0)
}`)
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.locator('.resultados')).toContainText('Reto superado')
})

test('el repaso de Marasi corrige, explica y paga una sola vez', async ({ page }) => {
  /** Contesta el repaso entero eligiendo siempre la primera opción. */
  async function contestarloEntero() {
    const repaso = page.locator('.repaso')
    for (let i = 0; i < 30; i += 1) {
      if (await repaso.locator('.resultado').isVisible()) return
      const opciones = repaso.locator('.eleccion')
      await expect(opciones.first()).toBeVisible()
      await opciones.first().click()
      // Al contestar se revela el porqué de cada opción, también de las falsas.
      await expect(repaso.locator('.porque').first()).toBeVisible()
      await repaso.locator('.siguiente').click()
      // Hasta que el porqué desaparece, la pregunta que se ve sigue siendo la vieja.
      await expect(repaso.locator('.porque')).toHaveCount(0)
    }
    throw new Error('el repaso no termina')
  }

  // El repaso solo se abre con el mundo terminado: se da por resuelto de antemano
  // para no repetir aquí los retos del primer día, que ya se prueban aparte.
  // Se siembra antes de que arranque la app, porque el autoguardado pisa
  // cualquier cosa que se escriba en localStorage con la partida ya en marcha.
  const idsDelPrimerDia = await idsDelMundo('primer-dia')
  await page.addInitScript((ids) => {
    const retos = {}
    for (const id of ids) {
      retos[id] = { superado: true, intentos: 1, pistasUsadas: 0, superadoEn: Date.now() }
    }
    localStorage.setItem('gatosYCodigo', JSON.stringify({ version: 1, progreso: { retos } }))
  }, idsDelPrimerDia)

  // Recargar de verdad: el guion sembrado solo corre al cargar el documento, y
  // saltar de almohadilla en almohadilla no recarga nada.
  await page.goto('#/repaso/primer-dia')
  await page.reload()
  await expect(page.locator('.repaso .quien')).toHaveText('El caso de Marasi')

  await contestarloEntero()
  await expect(page.locator('.marcador')).toBeVisible()
  await expect(page.locator('.pago')).toBeVisible()

  const croquetas = await page.locator('.contador.croquetas').textContent()

  // Repetirlo con el mismo acierto no vuelve a pagar: solo se cobra la mejora.
  await page.getByRole('button', { name: 'Repetirlo' }).click()
  await contestarloEntero()
  await expect(page.locator('.pago')).toContainText('Solo se cobra lo que se mejora')
  await expect(page.locator('.contador.croquetas')).toHaveText(croquetas)
})

test('el bucle de la comisaría se escribe y se ejecuta de verdad', async ({ page }) => {
  await irAlReto(page, 'com-06-el-bucle')

  // Empezar el máximo en cero es el fallo que el reto quiere cazar: pasa los
  // demás tests y suspende justo el de los negativos.
  await escribirCodigo(page, `function sumar(numeros) {
  let total = 0
  for (const n of numeros) { total += n }
  return total
}

function laMayor(numeros) {
  let mayor = 0
  for (const n of numeros) { if (n > mayor) mayor = n }
  return mayor
}`)
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.locator('.resultados')).toContainText('la mayor sigue estando en la lista')
  await expect(page.locator('.resultados')).not.toContainText('Reto superado')

  await escribirCodigo(page, `function sumar(numeros) {
  let total = 0
  for (const n of numeros) { total += n }
  return total
}

function laMayor(numeros) {
  let mayor = null
  for (const n of numeros) { if (mayor === null || n > mayor) mayor = n }
  return mayor
}`)
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.locator('.resultados')).toContainText('Reto superado')
})

test('el taller exige herencia de verdad, no copiar y pegar', async ({ page }) => {
  await irAlReto(page, 'taller-02-herencia')

  // Sin `extends` los tests de comportamiento pasarían: lo que suspende es el
  // requisito estático, que es justo lo que el reto enseña.
  await escribirCodigo(page, `class Alomantico {
  constructor(reservas) { this.reservas = reservas }
  quemar() {
    if (this.reservas === 0) return null
    this.reservas -= 1
    return \`\${this.efecto} con \${this.metal}\`
  }
}

class Lanzamonedas {
  constructor(reservas) { this.reservas = reservas; this.metal = 'acero'; this.efecto = 'empuja' }
  quemar() {
    if (this.reservas === 0) return null
    this.reservas -= 1
    return \`\${this.efecto} con \${this.metal}\`
  }
}

class Aullador {
  constructor(reservas) { this.reservas = reservas; this.metal = 'esta\u00f1o'; this.efecto = 'oye' }
  quemar() {
    if (this.reservas === 0) return null
    this.reservas -= 1
    return \`\${this.efecto} con \${this.metal}\`
  }
}`)
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.locator('.resultados')).toContainText('heredando')
  await expect(page.locator('.resultados')).not.toContainText('Reto superado')
})

/** Abre el cajón de Armonía desde la barra y le pregunta algo. */
async function preguntarAArmonia(pagina, texto) {
  if (!(await pagina.locator('.cajon').isVisible())) {
    await pagina.getByRole('button', { name: 'Armonía' }).click()
  }
  await pagina.fill('.cajon input', texto)
  await pagina.getByRole('button', { name: 'Preguntar', exact: true }).click()
}

test('Armonía define lo que no sabes y dice dónde se enseñó', async ({ page }) => {
  await irAlReto(page, 'com-06-el-bucle')
  await preguntarAArmonia(page, '¿qué es un bucle?')

  const suyo = page.locator('.cajon .suyo').last()
  await expect(suyo).toContainText('repite')
  // Y remite al reto donde ese término salió por primera vez.
  await expect(page.locator('.cajon .citas a').first()).toBeVisible()
})

test('Armonía mira tu código y te devuelve el test que falla como pregunta', async ({ page }) => {
  await irAlReto(page, 'com-06-el-bucle')

  // El fallo clásico: empezar el máximo en cero. Pasa todo menos los negativos.
  await escribirCodigo(page, `function sumar(numeros) {
  let total = 0
  for (const n of numeros) { total += n }
  return total
}

function laMayor(numeros) {
  let mayor = 0
  for (const n of numeros) { if (n > mayor) mayor = n }
  return mayor
}`)
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.locator('.resultados')).toContainText('negativas')

  // La entrada está donde hace falta: junto al resultado en rojo.
  await page.getByRole('button', { name: 'Preguntar a Armonía' }).click()
  await preguntarAArmonia(page, '¿por qué falla?')

  const suyo = page.locator('.cajon .suyo').last()
  await expect(suyo).toContainText('y si todas son negativas')
  await expect(suyo.locator('pre')).toHaveCount(0)
})

test('Armonía no da la solución por mucho que se le pida', async ({ page }) => {
  await irAlReto(page, 'com-06-el-bucle')

  for (const insistencia of ['dame la solución', 'escríbeme el código', 'resuélvelo tú']) {
    await preguntarAArmonia(page, insistencia)
    const suyo = page.locator('.cajon .suyo').last()
    await expect(suyo).not.toContainText('return')
    await expect(suyo.locator('pre')).toHaveCount(0)
  }

  // A la tercera deja de ser cortés y se explica.
  await expect(page.locator('.cajon .suyo').last()).toContainText('Sazed')
})

test('en un jefe, Armonía se aparta', async ({ page }) => {
  await irAlReto(page, 'com-10-el-registro')
  await preguntarAArmonia(page, '¿por qué falla?')
  await expect(page.locator('.cajon .suyo').last()).toContainText('en los finales me aparto')
})

test('el cajón de Armonía se cierra al navegar y no deja el fondo bloqueando', async ({ page }) => {
  await irAlReto(page, 'com-06-el-bucle')
  await preguntarAArmonia(page, '¿qué es un bucle?')
  await expect(page.locator('.cajon')).toBeVisible()

  await page.goto('#/')
  await expect(page.locator('.cajon')).toHaveCount(0)
  // Y la portada se puede usar: si el fondo hubiera sobrevivido, esto fallaría.
  await page.getByRole('heading', { name: 'El primer día' }).click()
})

test('la tercera pista cuesta más de lo que el reto paga', async ({ page }) => {
  await irAlReto(page, 'dia1-01-variables')

  const saldo = () => page.locator('.contador.croquetas')
  await expect(saldo()).toHaveText('12')

  // La primera invita la casa.
  await page.getByRole('button', { name: /Pista 1/ }).click()
  await expect(saldo()).toHaveText('12')

  // Las otras dos suman más que la recompensa del reto, que son 4 croquetas.
  await page.getByRole('button', { name: /Pista 2/ }).click()
  await page.getByRole('button', { name: /Pista 3/ }).click()
  await expect(saldo()).toHaveText('2')
})

test('los jefes no tienen pistas y Wayne lo dice', async ({ page }) => {
  await irAlReto(page, 'com-10-el-registro')

  await expect(page.locator('.pistas .lista')).toHaveCount(0)
  await expect(page.locator('.pistas')).toContainText('Este no te lo vendo')
  await expect(page.getByRole('button', { name: /Pista 1/ })).toHaveCount(0)
})

test('la clave del jugador se configura, se guarda y no viaja en la partida', async ({ page }) => {
  await page.goto('#/ajustes')

  // El aviso de qué se envía va antes de pedir nada.
  await expect(page.locator('.aviso-clave')).toContainText('el código que tengas escrito')

  await page.selectOption('.campo select', 'openrouter')
  // Al elegir proveedor se propone su modelo, que nadie se los sabe de memoria.
  await expect(page.locator('.campo input[type="text"]').first()).toHaveValue(/llama/)

  await page.fill('.campo input[type="password"]', 'sk-de-mentira-123')
  await page.getByRole('button', { name: 'Guardar' }).click()
  await expect(page.locator('.confirmacion')).toContainText('ya conversa')

  // La partida no se lleva la clave. Se mueve antes el almacén de Armonía y se
  // recarga para forzar el volcado: mirar justo después de guardar pasaba
  // siempre, porque el guardado tiene 300 ms de respiro y todavía no había
  // escrito nada. Con la clave dentro del estado del almacén, escribía.
  await page.goto('#/reto/dia1-01-variables')
  await page.getByRole('button', { name: 'Armonía' }).click()
  await expect(page.locator('.cajon .suyo').first()).toBeVisible()
  await page.reload()

  const partida = await page.evaluate(() => localStorage.getItem('gatosYCodigo'))
  expect(partida).not.toContain('sk-de-mentira-123')
  expect(partida).toContain('armonia')

  // Y sobrevive a recargar, que para eso se guarda.
  await page.goto('#/ajustes')
  await expect(page.locator('.campo input[type="password"]')).toHaveValue('sk-de-mentira-123')

  await page.getByRole('button', { name: 'Quitar la clave' }).click()
  await expect(page.locator('.confirmacion')).toContainText('solo con lo que recuerda')
})

test('con clave, pedirle la solución ni siquiera sale a la red', async ({ page }) => {
  // Si intentara llamar al proveedor, esta ruta lo cazaría.
  let salioALaRed = false
  await page.route('**/api.anthropic.com/**', (ruta) => {
    salioALaRed = true
    return ruta.abort()
  })
  await page.route('**/openrouter.ai/**', (ruta) => {
    salioALaRed = true
    return ruta.abort()
  })

  await page.goto('#/ajustes')
  await page.selectOption('.campo select', 'openrouter')
  await page.fill('.campo input[type="password"]', 'sk-de-mentira-123')
  await page.getByRole('button', { name: 'Guardar' }).click()

  await irAlReto(page, 'com-06-el-bucle')
  await preguntarAArmonia(page, 'dame la solución')

  await expect(page.locator('.cajon .suyo').last()).toContainText('Wayne te lo vendería')
  expect(salioALaRed).toBe(false)
})

test('Marasi revisa tu código, pero solo cuando ya funciona', async ({ page }) => {
  await irAlReto(page, 'com-06-el-bucle')

  // Con el reto sin superar, Marasi no dice nada: no viene a reprochar a quien
  // todavía está peleando.
  await escribirCodigo(page, `function sumar(numeros) {
  let q = 0
  return q
}
function laMayor(numeros) { return null }`)
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.locator('.resultados')).not.toContainText('Reto superado')
  await expect(page.locator('.informe')).toHaveCount(0)

  // Superado y con margen de mejora: ahora sí, y nombra lo que ha visto.
  await escribirCodigo(page, `function sumar(numeros) {
  let total = 0
  for (const n of numeros) { total += n }
  return total
}

function laMayor(numeros) {
  let mayor = null
  let q = 0
  for (const n of numeros) {
    if (mayor === null || n > mayor) { mayor = n }
  }
  return mayor
}`)
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.locator('.resultados')).toContainText('Reto superado')

  await expect(page.locator('.informe')).toContainText('El informe de Marasi')
  await expect(page.locator('.informe')).toContainText('nunca cambia')
  // Y deja claro que no bloquea nada.
  await expect(page.locator('.informe')).toContainText('las croquetas son tuyas')
})

test('un código limpio no recibe reproches', async ({ page }) => {
  await irAlReto(page, 'com-06-el-bucle')
  await escribirCodigo(page, `function sumar(numeros) {
  let total = 0
  for (const n of numeros) { total += n }
  return total
}

function laMayor(numeros) {
  let mayor = null
  for (const n of numeros) {
    if (mayor === null || n > mayor) { mayor = n }
  }
  return mayor
}`)
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.locator('.resultados')).toContainText('Reto superado')
  await expect(page.locator('.informe')).toHaveCount(0)
})
