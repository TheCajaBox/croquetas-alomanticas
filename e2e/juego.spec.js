import { readdirSync } from 'node:fs'

import { expect, test } from '@playwright/test'

import { ITINERARIOS } from '../src/contenido/itinerarios.js'
import { MUNDOS, mundosDelItinerario } from '../src/contenido/mundos.js'

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

test('la entrada ofrece todos los caminos y no salta sola a ninguno', async ({ page }) => {
  await page.goto('')

  // Los dos itinerarios, con su lenguaje, y sin haber elegido nada todavía.
  for (const itinerario of ITINERARIOS) {
    const camino = page.locator('.camino', { hasText: itinerario.nombre })
    await expect(camino).toBeVisible()
    await expect(camino).toContainText(itinerario.etiquetaLenguaje)
  }
  expect(page.url()).toMatch(/#\/$|\/$/)

  // Y se entra por la tarjeta al camino que tenga mundos.
  await page.locator('.camino', { hasText: 'La segunda era' }).click()
  await expect(page.getByRole('heading', { name: 'La segunda era' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'El primer día' })).toBeVisible()

  // Con partida empezada sigue habiendo que elegir: nadie pierde el otro camino.
  await page.goto('')
  await expect(page.locator('.camino')).toHaveCount(ITINERARIOS.length)
})

test('la portada de un itinerario presenta sus mundos, y solo los suyos', async ({ page }) => {
  await page.goto('#/itinerario/era2')

  // Escritos a mano se quedaban cortos: la prueba decía «los siete mundos»
  // cuando ya eran nueve. Y recorriendo MUNDOS entero se quedó mal por el otro
  // lado en cuanto hubo mundos de otro itinerario, que aquí no pintan nada.
  for (const mundo of mundosDelItinerario('era2')) {
    await expect(page.getByRole('heading', { name: mundo.nombre, exact: true })).toBeVisible()
  }

  for (const mundo of MUNDOS.filter((m) => m.itinerario !== 'era2')) {
    await expect(page.getByRole('heading', { name: mundo.nombre, exact: true })).toHaveCount(0)
  }
})

test('en la primera era habla su gente, no la de la segunda', async ({ page }) => {
  // Cinco paneles llevaban el personaje escrito a mano, así que en los mundos de
  // PHP anunciaban a gente que no está allí: el apunte lo firma Kelsier y no
  // Wax, el glosario es de Sazed y no de Steris, y las pistas las vende
  // Fantasma. Se comprueban los tres en el mismo reto.
  await irAlReto(page, 'ceniza-03-la-cuadrilla')

  await expect(page.locator('.apunte .titulo')).toContainText('El apunte de Kelsier')
  await expect(page.getByRole('heading', { name: /Pistas de Fantasma/ })).toBeVisible()
  // Y con su cara: Fantasma ya tiene ilustración, así que es una imagen y no la
  // inicial dibujada. Sin esto, quedarse sin el fichero pasaría desapercibido.
  await expect(page.locator('img.avatar.vendedor')).toBeVisible()

  // El glosario, al pulsar un término del enunciado o del apunte.
  await page.locator('button[data-termino]').first().click()
  await expect(page.locator('.ficha .quien')).toContainText('Sazed')

  // Y en la segunda era sigue siendo la suya.
  await irAlReto(page, 'dia1-07-primera-funcion')
  await expect(page.locator('.apunte .titulo')).toContainText('El apunte de Wax')
  await page.locator('button[data-termino]').first().click()
  await expect(page.locator('.ficha .quien')).toContainText('Steris')
})

test('quien repasa un mundo es el suyo, no siempre Marasi', async ({ page }) => {
  // La tarjeta del repaso llevaba «marasi» escrito a mano, cara y nombre, así
  // que en los mundos de la primera era anunciaba a alguien que no está allí.
  // La tarjeta solo sale con el mundo terminado, así que se siembran los dos.
  const todos = await todosLosRetos()
  await page.addInitScript((ids) => {
    const retos = {}
    for (const id of ids) {
      retos[id] = {
        superado: true, intentos: 1, fallos: 0, pistasUsadas: [],
        codigoGuardado: null, superadoEn: Date.now(), variantesHechas: [],
      }
    }
    localStorage.setItem('gatosYCodigo', JSON.stringify({
      version: 1,
      progreso: { retos, vistoLaBienvenida: true, ultimaVisita: Date.now() },
    }))
  }, [...todos['primer-dia'], ...todos.ceniza])
  await page.goto('#/')
  await page.reload()

  await page.goto('#/mundo/primer-dia')
  // La segunda era no lo declara en el repaso: sale del reparto, que dice Marasi.
  await expect(page.locator('.caso')).toContainText('Marasi repasa')

  await page.goto('#/mundo/ceniza')
  const suya = page.locator('.caso')
  await expect(suya).toContainText('Brisa repasa')
  await expect(suya).not.toContainText('Marasi')
  // Y con su cara: Brisa tiene ilustración, así que es una imagen y no la
  // inicial dibujada.
  await expect(suya.locator('img.avatar')).toBeVisible()
})

test('cada camino presenta a quien lo narra, con su ilustración si la tiene', async ({ page }) => {
  // El retrato grande estaba escrito a mano para Wayne, así que la primera era
  // salía con el disco pequeño de Brisa aunque tuviera ilustración. Ahora lo
  // decide el campo `retrato` del itinerario, y esto lo comprueba en los dos.
  await page.goto('#/itinerario/era2')
  await expect(page.locator('.retrato-grande')).toHaveAttribute('alt', /Wayne/)

  await page.goto('#/itinerario/era1')
  const suyo = page.locator('.retrato-grande')
  await expect(suyo).toBeVisible()
  await expect(suyo).toHaveAttribute('alt', /Brisa/)
  // Y la imagen carga de verdad: una ruta mal puesta daría un 404 silencioso y
  // el hueco se vería igual de vacío que si no existiera el retrato.
  expect(await suyo.evaluate((img) => img.naturalWidth)).toBeGreaterThan(100)

  // Sel todavía no tiene ilustración: sale su avatar y no un hueco.
  await page.goto('#/itinerario/sel')
  await expect(page.locator('.retrato-grande')).toHaveCount(0)
  await expect(page.locator('.anfitrion .avatar, .anfitrion svg')).toBeVisible()
})

test('la portada dice por dónde ibas y lleva a ese reto', async ({ page }) => {
  // Recién llegado: por dónde se empieza.
  await page.goto('#/itinerario/era2')
  const seguir = page.locator('.seguir')
  await expect(seguir).toContainText('Por aquí se empieza')
  await expect(seguir.getByRole('link', { name: /Empezar/ })).toBeVisible()

  // Con algo hecho: el siguiente, con lo que llevas.
  const ids = await idsDelMundo('primer-dia')
  await page.addInitScript((hechos) => {
    const retos = {}
    for (const id of hechos) {
      retos[id] = { superado: true, intentos: 1, fallos: 0, pistasUsadas: [], superadoEn: Date.now() }
    }
    localStorage.setItem('gatosYCodigo', JSON.stringify({ version: 1, progreso: { retos } }))
  }, ids.slice(0, 3))
  await page.goto('#/itinerario/era2')
  await page.reload()

  await expect(seguir).toContainText('Por dónde ibas')
  await expect(seguir.locator('.marcadores')).toContainText('3/')
  await seguir.getByRole('link', { name: /Seguir/ }).click()

  // Y es justo el cuarto, que es donde se había quedado. Con `toHaveURL`, que
  // reintenta: leer `page.url()` a pelo lo mira antes de que el router llegue.
  await expect(page).toHaveURL(new RegExp(ids[3]))
  await expect(page.locator('h1')).toBeVisible()
})

test('la cabecera cabe en una línea, con racha y todo', async ({ page }) => {
  // Con ocho secciones y cinco contadores dejó de caber, y como la barra tiene
  // altura fija la segunda fila se salía por abajo encima del contenido.
  await page.addInitScript(() => {
    localStorage.setItem(
      'gatosYCodigo',
      JSON.stringify({ version: 1, progreso: { retos: {}, rachaSinPistas: 7, mejorRacha: 7 } }),
    )
  })
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('')
  await page.reload()
  await expect(page.locator('.contador.racha')).toBeVisible()

  // Dos cosas, y hacen falta las dos: que sea una sola fila -la barra tiene
  // altura fija y la segunda se saldría por abajo- y que **quepa de verdad**.
  // Con `nowrap` la primera se cumple sola, así que sin la segunda esta prueba
  // dejaría de proteger nada: lo que se rompe al añadir retos es que el último
  // enlace se sale por la derecha.
  const cabecera = await page.evaluate(() => {
    const enlaces = [...document.querySelectorAll('.navegacion > *')]
    const cajas = enlaces.map((enlace) => enlace.getBoundingClientRect())
    const nav = document.querySelector('.navegacion').getBoundingClientRect()
    return {
      filas: new Set(cajas.map((caja) => Math.round(caja.top))).size,
      // Lo que sobresale del hueco de la navegación, en píxeles.
      desbordado: Math.max(0, Math.round(Math.max(...cajas.map((c) => c.right)) - nav.right)),
      fueraDeLaVentana: cajas.filter((caja) => caja.right > window.innerWidth).length,
    }
  })
  expect(cabecera.filas).toBe(1)
  expect(cabecera.desbordado, 'la navegación no cabe y se desplaza').toBe(0)
  expect(cabecera.fueraDeLaVentana, 'hay enlaces fuera de la ventana').toBe(0)
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
  await page.getByRole('link', { name: 'Caminos' }).click()
  await expect(page.getByRole('heading', { name: 'La segunda era' })).toBeVisible()
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

test('un reto de PHP se ejecuta de verdad, con PHP', async ({ page }) => {
  // El motor son 20 MB de WebAssembly que se piden en diferido, así que este
  // primer envío tiene margen de sobra: lo que se comprueba es que PHP corre en
  // el navegador, no lo rápido que va la red de quien pase las pruebas.
  await irAlReto(page, 'ceniza-01-el-primer-echo')
  await expect(page.getByRole('heading', { name: 'Lo primero que se dice' })).toBeVisible()

  // Y no sale el panel de vista previa: PHP no pinta nada.
  await expect(page.locator('.marco-sandbox')).toHaveCount(0)
  // Las pistas las vende Fantasma en este itinerario, no Wayne.
  await expect(page.getByRole('heading', { name: /Pistas de Fantasma/ })).toBeVisible()

  await escribirCodigo(page, "<?php\n\necho 'Los Pozos de Hathsin' . PHP_EOL;\necho 'Trece cuadrillas' . PHP_EOL;")
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible({ timeout: 120_000 })
})

test('en PHP, la sintaxis rota la explica PHP y los requisitos se miran por tokens', async ({ page }) => {
  await irAlReto(page, 'ceniza-03-la-cuadrilla')

  // 1. Lo que no es PHP todavía: el mensaje viene del propio motor.
  await escribirCodigo(page, '<?php function mal( { }')
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.locator('.resultados')).toContainText('syntax error', { timeout: 120_000 })

  // 2. Funciona, pero se salta la regla del reto. Lo caza `token_get_all` dentro
  // del sandbox, que es el único que sabe distinguir una llamada de una palabra
  // dentro de un comentario.
  await escribirCodigo(
    page,
    '<?php\nfunction cuantos(array $g): int { return count($g); }\nfunction sumar(array $n): int { return array_sum($n); }',
  )
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.locator('.resultados')).toContainText('array_sum')
  await expect(page.locator('.resultados')).not.toContainText('Reto superado')
})

test('Ham interrumpe en la primera era, y no aparece en la segunda', async ({ page }) => {
  // Sin la bienvenida de Wayne por medio: es lo último que se dice al arrancar
  // el juego por primera vez y pisaría al anfitrión del mundo. Aquí lo que se
  // prueba es quién interrumpe, no el orden del primer saludo de la partida.
  await page.addInitScript(() => {
    localStorage.setItem(
      'gatosYCodigo',
      JSON.stringify({
        version: 1,
        progreso: { retos: {}, vistoLaBienvenida: true, vistoLaAntesala: true, ultimaVisita: Date.now() },
      }),
    )
  })

  // La primera vez que abre la boca se presenta, sin esperar turno: si no, un
  // desconocido te haría preguntas y encima solo una de cada tres veces.
  await page.goto('#/mundo/ceniza')

  // Le recibe el anfitrión del mundo, que es Kelsier.
  await expect(page.locator('.narrador .quien')).toHaveText('Kelsier')
  // Y a los cinco segundos le corta Ham, que es lo que hace Ham.
  await expect(page.locator('.narrador .quien')).toHaveText('Ham', { timeout: 15_000 })
  await expect(page.locator('.narrador .dice')).toContainText(/pregunt/i)
  // Y con su cara, que ya tiene: una imagen y no el disco con su inicial.
  await expect(page.locator('.narrador img.avatar.retrato')).toBeVisible()

  // En la segunda era no hay nadie puesto para interrumpir, así que no
  // interrumpe nadie: el reparto lo decide, no el código.
  await page.goto('#/mundo/primer-dia')
  await expect(page.locator('.narrador')).toBeVisible()
  await expect(page.locator('.narrador .quien')).not.toHaveText('Ham')
  await page.waitForTimeout(6_000)
  await expect(page.locator('.narrador .quien')).not.toHaveText('Ham')
})

test('el editor colorea PHP como PHP, y su gramática no la paga la segunda era', async ({ page }) => {
  // Antes se coloreaba todo con la gramática de JavaScript, y `<?php` salía
  // como dos operadores y una variable.
  const pedidos = []
  page.on('request', (peticion) => pedidos.push(peticion.url()))

  await irAlReto(page, 'ceniza-01-el-primer-echo')
  await escribirCodigo(page, "<?php\n\n$metal = 'peltre';\necho $metal;")

  // La gramática se pide en diferido: se espera a que llegue el trozo.
  await expect
    .poll(() => pedidos.filter((url) => url.includes('gramatica-php')).length, { timeout: 30_000 })
    .toBeGreaterThan(0)

  // Y coloreando de verdad: CodeMirror parte el código en trozos con estilo, y
  // sin gramática no hay trozos, hay una línea de texto plano.
  const conColor = await page.locator('.cm-content .cm-line span[class]').count()
  expect(conColor, 'el editor no está coloreando nada').toBeGreaterThan(2)

  // La otra mitad: en la segunda era no se paga esa descarga.
  // La otra mitad: en la segunda era esa descarga no se paga. No hace falta
  // resolver nada -lo que se mira es la red-, solo abrir el editor y escribir.
  pedidos.length = 0
  await irAlReto(page, 'dia1-07-primera-funcion')
  await escribirCodigo(page, "function saludar(nombre) {\n  return `Hola, ${nombre}`\n}")
  // Se espera a que JavaScript esté coloreando: así ha pasado tiempo de sobra
  // para que una descarga que no debería ocurrir hubiera ocurrido ya.
  await expect(page.locator('.cm-content .cm-line span[class]').first()).toBeVisible()
  expect(pedidos.filter((url) => url.includes('gramatica-php'))).toEqual([])
})

test('un reto se puede practicar otra vez, con otros datos y sin volver a cobrar', async ({ page }) => {
  await irAlReto(page, 'ceniza-03-la-cuadrilla')

  const bien = [
    '<?php',
    'function cuantos(array $g): int { return count($g); }',
    'function sumar(array $n): int {',
    '    $t = 0;',
    '    foreach ($n as $x) { $t += $x; }',
    '    return $t;',
    '}',
  ].join('\n')

  await escribirCodigo(page, bien)
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible({ timeout: 120_000 })

  const croquetas = await page.locator('.croquetas').first().innerText()
  const intentos = await page.locator('.intentos').first().innerText()

  // Otra tanda: mismos requisitos, otros datos.
  await page.getByRole('button', { name: /Otra vez, con otros datos/ }).click()
  await expect(page.locator('.etiqueta.practica')).toContainText('práctica 1 de')
  await expect(page.getByText('Reto superado.')).toHaveCount(0)
  await expect(page.locator('.intentos')).toContainText('no se cobra')

  await escribirCodigo(page, bien)
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible({ timeout: 120_000 })

  // Y lo que importa: practicar no paga, y no cuenta como intento.
  await expect(page.locator('.croquetas').first()).toHaveText(croquetas)
  await page.getByRole('button', { name: 'Volver al reto original' }).click()
  await expect(page.locator('.intentos').first()).toHaveText(intentos)
})

/**
 * Los trozos de cuerpo de reto se llaman por su fichero: `03-la-cuadrilla-xxx.js`,
 * `07-primera-funcion-xxx.js`. Los de los apuntes llevan delante el prefijo del
 * mundo (`ceniza-03-...`), así que empezar por dos dígitos los distingue.
 */
const ES_CUERPO_DE_RETO = /\/assets\/\d\d[a-z]?-[^/]+\.js(\?|$)/

test('el cuerpo de un reto se pide al abrirlo, y solo el suyo', async ({ page }) => {
  // El catálogo lleva solo la ficha de cada reto -id, mundo, tipo, título,
  // recompensa- y el cuerpo -enunciado, solución, tests, pistas- se pide aparte.
  // Eran 234 kB de los 725 del paquete principal. Esto comprueba lo que de
  // verdad importa de ese reparto: que navegar por el juego no los descargue.
  const cuerpos = []
  page.on('request', (peticion) => {
    if (ES_CUERPO_DE_RETO.test(peticion.url())) cuerpos.push(peticion.url())
  })

  await page.goto('')
  await expect(page.getByRole('heading', { name: /Aprende a programar/ })).toBeVisible()
  await page.goto('#/itinerario/era2')
  await page.goto('#/mundo/primer-dia')
  await expect(page.getByRole('heading', { name: 'El primer día' })).toBeVisible()

  expect(cuerpos, 'la portada o la lista de un mundo han pedido cuerpos de reto').toEqual([])

  // Y al abrir uno, el suyo y nada más.
  await irAlReto(page, 'dia1-07-primera-funcion')
  await expect(page.locator('.cm-content')).toBeVisible()
  expect(cuerpos.length, `pedidos: ${cuerpos.join(', ')}`).toBe(1)
  expect(cuerpos[0]).toContain('07-primera-funcion')
})

test('el motor de PHP no se descarga jugando en la segunda era', async ({ page }) => {
  // 20 MB que solo debe pagar quien entre en la primera era. Si algún día un
  // import se cuela en el paquete principal, esto lo caza.
  const pedidos = []
  page.on('request', (peticion) => {
    if (/php_8_5|\.wasm/.test(peticion.url())) pedidos.push(peticion.url().split('/').pop())
  })

  await page.goto('#/itinerario/era2')
  await irAlReto(page, 'dia1-01-variables')
  await page.locator('.opcion').first().click()
  await page.getByRole('button', { name: 'Responder' }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible()

  expect(pedidos).toEqual([])
})

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
  await page.goto('#/itinerario/era2')

  // Están casi transparentes hasta que alguien pasa por encima: se pulsan igual.
  await expect(page.locator('.contador.sombreros')).toContainText('0/15')
  const croquetasAntes = Number(await page.locator('.contador.croquetas').textContent())

  await page.locator('.portada .sombrero-escondido').click()

  await expect(page.getByText('Sombrero encontrado')).toBeVisible()
  await expect(page.locator('.contador.sombreros')).toContainText('1/15')
  // Wayne jura que era suyo y lo paga.
  await expect
    .poll(async () => Number(await page.locator('.contador.croquetas').textContent()))
    .toBeGreaterThan(croquetasAntes)

  // Ya no está en su escondite y sí en la sombrerera.
  await expect(page.locator('.portada .sombrero-escondido')).toHaveCount(0)
  await page.goto('#/sombrerera')
  await expect(page.getByRole('heading', { name: 'El polvoriento' })).toBeVisible()
  await expect(page.getByText('1 de 15 encontrados')).toBeVisible()

  // Y sobrevive a recargar.
  await page.reload()
  await expect(page.locator('.contador.sombreros')).toContainText('1/15')
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

test('en un reto de PHP el glosario explica con PHP, no con JavaScript', async ({ page }) => {
  // El glosario es el mismo texto en los dos caminos, pero no el mismo ejemplo:
  // una variable es `const sombrero` en JavaScript y `$sombrero` en PHP. Antes
  // esto enseñaba la sintaxis del otro lenguaje dentro de un reto de PHP, que es
  // exactamente lo que más confunde cuando estás aprendiendo el primero.
  await irAlReto(page, 'ceniza-02-que-imprime')
  await page.locator('button[data-termino="variable"]').first().click()

  const ficha = page.locator('.ficha')
  await expect(ficha.locator('.quien')).toContainText('Sazed')
  await expect(ficha.locator('pre')).toContainText('$sombrero')
  await expect(ficha.locator('pre')).not.toContainText('const')

  // Y en la segunda era, la de siempre.
  await irAlReto(page, 'dia1-07-primera-funcion')
  await page.locator('button[data-termino="variable"]').first().click()
  await expect(page.locator('.ficha pre')).toContainText('const sombrero')
})

test('la página del glosario deja elegir el camino, y cambia con él', async ({ page }) => {
  // Esta página se abre desde la barra, fuera de todo mundo, así que el lenguaje
  // no se puede deducir: se elige. Sin el selector enseñaba las cien entradas
  // con los ejemplos de JavaScript, incluidos los términos que en PHP no
  // existen.
  await page.goto('#/glosario')
  await expect(page.getByRole('heading', { name: 'El glosario de Steris' })).toBeVisible()
  await expect(page.locator('.termino h3', { hasText: /^ref$/ })).toHaveCount(1)

  await page.locator('.caminos-glosario button', { hasText: 'PHP' }).click()

  await expect(page.getByRole('heading', { name: 'El glosario de Sazed' })).toBeVisible()
  // `ref` es de Vue y allí no existe; `foreach` es de PHP y aquí sí.
  await expect(page.locator('.termino h3', { hasText: /^ref$/ })).toHaveCount(0)
  await expect(page.locator('.termino h3', { hasText: /^foreach$/ })).toHaveCount(1)

  // Y el buscador sigue buscando dentro del camino elegido.
  await page.getByPlaceholder('Buscar un término…').fill('array')
  await expect(page.locator('.termino h3', { hasText: 'array asociativo' })).toHaveCount(1)
})

test('la casa de los gatos y la sombrerera son de Elendel, y no salen en la primera era', async ({
  page,
}) => {
  // La barra se pinta en todas las pantallas, así que llevaba la casa de los
  // gatos, el refugio y la sombrerera a los cuatro caminos: jugando la primera
  // era, con la ceniza cayendo sobre Luthadel, ofrecía ir a una casa con jardín
  // en Elendel. Los gatos siguen siendo tuyos y sus bonos también; lo que se
  // queda en su sitio es el sitio.
  await page.goto('#/itinerario/era2')
  await expect(page.getByRole('link', { name: 'Colonia' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Sombrerera' })).toBeVisible()

  await page.goto('#/itinerario/era1')
  await expect(page.getByRole('link', { name: 'Colonia' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Sombrerera' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Glosario' })).toBeVisible()

  // Y el rumbo se hereda: al abrir el glosario desde la primera era la barra
  // sigue siendo la de la primera era, no la del primer camino de la lista.
  await page.goto('#/glosario')
  await expect(page.getByRole('link', { name: 'Colonia' })).toHaveCount(0)
})

test('a un sitio que no existe en tu camino no se entra ni escribiendo la dirección', async ({
  page,
}) => {
  // La barra ya no ofrece la puerta, pero una dirección en favoritos sí que
  // llevaba. Sale a la portada del camino donde estabas.
  // Se espera a que la portada esté pintada antes de saltar. Quien apunta en
  // qué camino estás es la barra, al navegar, y `goto` de una almohadilla vuelve
  // en cuanto carga la página: saltando seguido, el guardián preguntaba antes de
  // que nadie le hubiera dicho dónde estabas y dejaba pasar una vez de cada
  // tres. Es carrera de la prueba y no del juego -por la barra se llega con la
  // aplicación viva, y por la dirección el camino sale de la partida guardada-.
  await page.goto('#/itinerario/era1')
  await expect(page.getByRole('heading', { name: 'La primera era' })).toBeVisible()
  await page.goto('#/colonia')

  await expect(page).toHaveURL(/#\/itinerario\/era1$/)
  await expect(page.getByRole('heading', { name: 'La primera era' })).toBeVisible()

  // Desde la segunda era, la misma dirección entra.
  await page.goto('#/itinerario/era2')
  await expect(page.getByRole('heading', { name: 'La segunda era' })).toBeVisible()
  await page.goto('#/colonia')
  await expect(page).toHaveURL(/#\/colonia$/)
})

test('en la primera era no hay sombreros escondidos, y en la segunda sí', async ({ page }) => {
  // Encontrar un sombrero y no tener dónde ponerlo es peor que no encontrarlo:
  // la sombrerera es de Elendel. Se decide en un sitio, no en las quince
  // pantallas que llevan uno escondido.
  await irAlReto(page, 'dia1-07-primera-funcion')
  await expect(page.locator('.sombrero-escondido').first()).toBeAttached()

  await irAlReto(page, 'ceniza-02-que-imprime')
  await expect(page.locator('.sombrero-escondido')).toHaveCount(0)
})

test('cerrar un mundo de la primera era manda al repaso de quien lo lleva', async ({ page }) => {
  // El botón del cierre ponía «El repaso de Marasi» a mano, y en la primera era
  // el repaso lo lleva Brisa. Se siembra La Ceniza entera menos el jefe y se
  // cierra el mundo de verdad, que es la única manera de que la tarjeta salga.
  const todos = await todosLosRetos()
  const ids = todos.ceniza
  await page.addInitScript((sinJefe) => {
    const retos = {}
    for (const id of sinJefe) {
      retos[id] = { superado: true, intentos: 1, pistasUsadas: [], superadoEn: Date.now() }
    }
    localStorage.setItem('gatosYCodigo', JSON.stringify({ version: 1, progreso: { retos } }))
  }, ids.slice(0, -1))

  await page.goto(`#/reto/${ids.at(-1)}`)
  await page.reload()

  await escribirCodigo(
    page,
    "<?php\n\nfunction informe(array $cuadrilla): string\n{\n$texto = '';\n$numero = 1;\nforeach ($cuadrilla as $persona) {\n$texto .= $numero . '. ' . $persona . PHP_EOL;\n$numero += 1;\n}\nreturn $texto;\n}",
  )
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.getByText('Reto superado.')).toBeVisible({ timeout: 20_000 })

  const cierre = page.locator('.cierre')
  await expect(cierre).toContainText('La Ceniza, terminado')
  await expect(cierre.getByRole('link', { name: /repaso de Brisa/ })).toBeVisible()
  await expect(cierre.getByRole('link', { name: /repaso de Marasi/ })).toHaveCount(0)
})

test('un término no se puede pulsar antes del mundo que lo enseña', async ({ page }) => {
  // El glosario iba por lenguaje, así que dentro de un reto ofrecía las cien
  // entradas desde el primero: en Los Áridos se podía pulsar «clase» -que se
  // enseña en El taller, un mundo después- y leer una definición que no toca.
  // La palabra sigue estando en el enunciado; lo que no está es el botón.
  await irAlReto(page, 'es6-01-const-let')
  await expect(page.locator('.enunciado')).toContainText('clase')
  await expect(page.locator('[data-termino="clase"]')).toHaveCount(0)
  // Y lo que su mundo sí ha enseñado, se pulsa.
  await expect(page.locator('[data-termino]').first()).toBeVisible()

  // Dos mundos más adelante, la misma palabra ya es suya.
  await irAlReto(page, 'taller-02-herencia')
  await expect(page.locator('[data-termino="clase"]').first()).toBeVisible()
  await page.locator('[data-termino="clase"]').first().click()
  await expect(page.locator('.ficha .definicion')).not.toBeEmpty()
})

test('la página del glosario va por mundos y en orden de juego', async ({ page }) => {
  // Ver «esto es de La Ceniza y esto de La tripulación» es media información:
  // antes eran cien tarjetas en un montón alfabético.
  await page.goto('#/glosario')
  const titulares = page.locator('.cabecera-mundo h2')
  await expect(titulares.first()).toHaveText('El primer día')
  const cuantos = await titulares.count()
  expect(cuantos).toBeGreaterThan(4)

  // En el camino de PHP, sus mundos y en su orden. Deducidos del contenido y no
  // escritos a mano: la versión escrita a mano decía «La Ceniza, La tripulación»
  // y se rompió el día que entró el tercer mundo, que es justo lo que no tiene
  // que pasar por añadir contenido.
  await page.locator('.caminos-glosario button', { hasText: 'PHP' }).click()
  await expect(page.locator('.cabecera-mundo h2')).toHaveText(
    mundosDelItinerario('era1').map((mundo) => mundo.nombre),
  )
  // `foreach` cae en La Ceniza, que es donde su apunte lo explica.
  const laCeniza = page.locator('.mundo-glosario').first()
  await expect(laCeniza.locator('.termino h3', { hasText: /^foreach$/ })).toHaveCount(1)
})

test('las preguntas de un repaso se piden al abrirlo, y solo las suyas', async ({ page }) => {
  // Los repasos iban enteros en el paquete principal -60 kB- porque los importan
  // tres pantallas y Rollup los subía al arranque. Ahora la ficha va arriba y las
  // preguntas se piden al entrar. Esto lo mira desde la red, que es el único
  // sitio donde se ve.
  const pedidos = []
  page.on('request', (peticion) => {
    const url = peticion.url()
    if (/\/assets\/.*\.js$/.test(url)) pedidos.push(url.split('/').pop())
  })

  const todos = await todosLosRetos()
  await page.addInitScript((ids) => {
    const retos = {}
    for (const id of ids) {
      retos[id] = { superado: true, intentos: 1, pistasUsadas: [], superadoEn: Date.now() }
    }
    localStorage.setItem('gatosYCodigo', JSON.stringify({
      version: 1,
      progreso: { retos, vistoLaBienvenida: true, ultimaVisita: Date.now() },
    }))
  }, todos.ceniza)
  await page.goto('#/')
  await page.reload()

  // La lista del mundo ofrece el repaso -«9 preguntas»- sin descargar ninguna.
  await page.goto('#/mundo/ceniza')
  await expect(page.locator('.caso')).toContainText('9 preguntas')
  expect(pedidos.filter((cada) => /ceniza-.*\.js/.test(cada) && !/reto/.test(cada)).length).toBeLessThan(3)

  pedidos.length = 0
  await page.locator('.caso').click()
  await expect(page.getByText('El caso de la ceniza')).toBeVisible()
  await expect(page.locator('.pregunta').first()).toBeVisible()

  // Y al entrar se ha pedido un trozo, no doce: el de este mundo.
  const cuerpos = pedidos.filter((cada) => /^(ceniza|tripulacion|pozo|primer-dia|comisaria)-/.test(cada))
  expect(cuerpos.length, `trozos de repaso pedidos: ${cuerpos.join(', ')}`).toBeLessThanOrEqual(1)
})

test('el final de la primera era son dos actos y ninguno se vende', async ({ page }) => {
  // Los dos últimos retos del itinerario van juntos y ninguno lleva pistas: si
  // el primero las tuviera, media final se podría comprar. La etiqueta lo dice
  // antes de entrar, y el panel de pistas no está.
  const todos = await todosLosRetos()
  // Se siembra con el ayudante de siempre y no a mano: el acto II pide el acto
  // I **y** el mundo abierto, que a su vez pide El kandra entero. Sembrando
  // solo los once retos de Ruina, la vista rebotaba al mundo y de ahí a la
  // portada, y las etiquetas que se ven abajo eran las de la lista del mundo.
  await sembrarLoAnterior(page, todos.ruina.at(-1))
  await page.goto('#/')
  await page.reload()

  await page.goto('#/mundo/ruina')
  await expect(page.locator('.etiqueta.acto')).toHaveCount(2)
  await expect(page.locator('.etiqueta.acto').first()).toHaveText('acto I')
  await expect(page.locator('.etiqueta.acto').last()).toHaveText('acto II')

  // El acto I: etiqueta puesta y ni una pista a la venta.
  //
  // Se recarga después de cada salto y no se salta de almohadilla en
  // almohadilla, porque la vista sale con una transición: mientras la anterior
  // se va, su DOM sigue ahí y los localizadores encuentran dos de cada cosa.
  await page.goto(`#/reto/${todos.ruina.at(-2)}`)
  await page.reload()
  await expect(page.locator('.etiqueta.acto')).toHaveText('acto I')
  // El panel de pistas está, pero no vende: no hay lista y sí el «este no te lo
  // vendo». Se mira así y no por el título, porque el título -«Pistas de
  // Fantasma»- sale igual; lo que no sale es nada que comprar.
  await expect(page.locator('.pistas .lista')).toHaveCount(0)
  await expect(page.locator('.pistas .cerrado')).toBeVisible()

  // Y el acto II es además el jefe, así que lleva las dos etiquetas.
  await page.goto(`#/reto/${todos.ruina.at(-1)}`)
  await page.reload()
  await expect(page.locator('.etiqueta.acto')).toHaveText('acto II')
  await expect(page.locator('.etiqueta.jefe')).toHaveText('jefe')
  await expect(page.locator('.pistas .lista')).toHaveCount(0)
  await expect(page.locator('.pistas .cerrado')).toBeVisible()
  // Y quien no vende aquí es Fantasma, que es quien vende en este camino: el
  // panel es compartido y antes decía «Wayne» en la letra pequeña.
  await expect(page.locator('.pistas h3')).toHaveText('Pistas de Fantasma')

  // Lo abre Vin, que es la que menos habla del juego.
  await expect(page.locator('.apunte .titulo')).toContainText('El apunte de Vin')
})

test('al acto II no se entra sin haber pasado el acto I', async ({ page }) => {
  // La otra mitad de la regla: los dos actos van juntos, y el segundo no está
  // hasta que el primero cae. Lo hace el candado normal -los retos se abren en
  // fila- y conviene fijarlo aquí, porque es lo que hace que el itinerario no
  // se pueda cerrar por el atajo.
  const todos = await todosLosRetos()
  await sembrarLoAnterior(page, todos.ruina.at(-2))

  // Con el acto I sin pasar, escribir la dirección del II devuelve a la lista
  // del mundo. Se mira la dirección y no el título, porque el título del acto
  // II **sí** sale en esa lista -con su candado-: lo que no se abre es el reto.
  await page.goto(`#/reto/${todos.ruina.at(-1)}`)
  await page.reload()
  await expect(page).toHaveURL(/#\/mundo\/ruina$/)
  await expect(page.locator('.apunte')).toHaveCount(0)

  // Y el acto I sí, que es el que toca: se queda en su dirección y trae apunte.
  await page.goto(`#/reto/${todos.ruina.at(-2)}`)
  await page.reload()
  await expect(page).toHaveURL(new RegExp(`#/reto/${todos.ruina.at(-2)}$`))
  await expect(page.locator('.apunte .titulo')).toContainText('El apunte de Vin')
})

test('una consulta de Kae se escribe, se ejecuta contra SQLite de verdad y se cobra', async ({ page }) => {
  // El recorrido completo del entorno nuevo: el panel de las tablas, el editor
  // con la gramática de SQL, la consulta ejecutándose contra un SQLite de
  // verdad dentro de un worker, el resultado en la consola y el pago.
  await irAlReto(page, 'kae-05-quedarse-con-unas-filas')

  // Lo primero que hay que poder mirar: a qué se está preguntando. El esquema
  // se ve sin desplegar nada; las filas están dobladas.
  const tablas = page.locator('.esquema')
  await expect(tablas).toContainText('CREATE TABLE habitantes')
  await expect(tablas).toContainText('1 tabla: habitantes')
  await expect(tablas.locator('.filas')).toBeHidden()
  await tablas.locator('.doblar').click()
  await expect(tablas.locator('.filas')).toContainText("'Raoden'")

  // Una consulta que devuelve filas de más: le falta la condición entera. Pasa
  // el requisito de nombrar columnas y suspende por los tests, que es el orden
  // en que el jugador tiene que leerlo.
  await escribirCodigo(page, 'SELECT nombre, oficio FROM habitantes;')
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.locator('.resultados')).toContainText('Filtra con WHERE')
  await expect(page.locator('.resultados')).not.toContainText('Reto superado')

  // Y ahora la buena. Se comprueba también que la consola trae **las filas**:
  // en SQL el resultado es la respuesta, y un panel que solo diga «tres tests
  // en verde» esconde justo lo que hay que mirar.
  const croquetasAntes = await page.locator('.contador.croquetas').textContent()
  await escribirCodigo(page, "SELECT nombre, oficio FROM habitantes WHERE barrio = 'Kae';")
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.locator('.resultados')).toContainText('Reto superado')
  await expect(page.locator('.consola')).toContainText('nombre | oficio')
  await expect(page.locator('.consola')).toContainText('Raoden | escribiente')
  await expect(page.locator('.consola')).not.toContainText('Galladon')
  expect(await page.locator('.contador.croquetas').textContent()).not.toBe(croquetasAntes)
})

test('una consulta que no se entiende se dice en castellano, y no como un test en rojo', async ({ page }) => {
  // SQLite habla inglés y a veces en clave. Y el orden importa: un error de
  // sintaxis se enseña **antes** que cualquier test, porque los tests de una
  // consulta que la base no entiende no dicen nada.
  // En el reto dos, que no exige ninguna cláusula: en el cinco el `WHERE` que
  // falta se caza **antes** de ejecutar, y entonces la consulta no llega nunca
  // a la base. Ese orden es el bueno -las normas primero- y aquí lo que se
  // quiere ver es lo que dice SQLite.
  await irAlReto(page, 'kae-02-las-columnas-que-pides')

  await escribirCodigo(page, 'SELECT nombre, oficio FROM habitantess;')
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.locator('.resultados')).toContainText('No existe ninguna tabla')
  await expect(page.locator('.resultados')).toContainText('habitantess')
  // Y manda a mirar el esquema, que está en la misma pantalla.
  await expect(page.locator('.resultados')).toContainText('esquema')
})

test('el editor de un reto de SQL colorea SQL, y el wasm de SQLite no viaja en el arranque', async ({ page }) => {
  const pedidos = []
  page.on('request', (peticion) => pedidos.push(peticion.url()))

  // La portada de la primera era no pide nada de SQL: ni la gramática ni el
  // motor. Es la comprobación que ya se hace con PHP, por el otro lado.
  await page.goto('#/itinerario/era1')
  await expect(page.getByRole('heading', { name: 'La primera era' })).toBeVisible()
  expect(pedidos.filter((cada) => /sql-wasm|gramatica-sql/.test(cada))).toEqual([])

  await irAlReto(page, 'kae-02-las-columnas-que-pides')
  await escribirCodigo(page, "SELECT nombre, oficio FROM habitantes WHERE barrio = 'Kae';")

  // La gramática se pide en diferido: se espera a que llegue el trozo.
  await expect
    .poll(() => pedidos.filter((url) => url.includes('gramatica-sql')).length, { timeout: 30_000 })
    .toBeGreaterThan(0)

  // Y coloreando de verdad: CodeMirror parte el código en trozos con estilo, y
  // sin gramática no hay trozos, hay una línea de texto plano.
  const conColor = await page.locator('.cm-content .cm-line span[class]').count()
  expect(conColor, 'el editor no está coloreando nada').toBeGreaterThan(2)
  // Y el wasm de PHP no se descarga jugando aquí.
  expect(pedidos.filter((cada) => /php_8_5\.wasm/.test(cada))).toEqual([])
})

test('el final de Elantris son dos actos, y el segundo es el que más paga del juego', async ({ page }) => {
  // La misma forma que el final de la primera era, medida en el camino nuevo: la
  // etiqueta del acto se ve antes de entrar, ninguno de los dos vende pistas, y
  // el acto II es el jefe. Se siembra con el ayudante, que sabe que el acto II
  // pide además los cinco mundos anteriores.
  const todos = await todosLosRetos()
  await sembrarLoAnterior(page, todos.linea.at(-1))
  await page.goto('#/')
  await page.reload()

  await page.goto('#/mundo/linea')
  await expect(page.locator('.etiqueta.acto')).toHaveCount(2)
  await expect(page.locator('.etiqueta.acto').first()).toHaveText('acto I')
  await expect(page.locator('.etiqueta.acto').last()).toHaveText('acto II')

  // Se recarga después de cada salto porque la vista sale con una transición:
  // mientras la anterior se va, su DOM sigue ahí y los localizadores encuentran
  // dos de cada cosa.
  await page.goto(`#/reto/${todos.linea.at(-2)}`)
  await page.reload()
  await expect(page.locator('.etiqueta.acto')).toHaveText('acto I')
  await expect(page.locator('.pistas .lista')).toHaveCount(0)
  await expect(page.locator('.pistas .cerrado')).toBeVisible()

  await page.goto(`#/reto/${todos.linea.at(-1)}`)
  await page.reload()
  await expect(page.locator('.etiqueta.acto')).toHaveText('acto II')
  await expect(page.locator('.etiqueta.jefe')).toHaveText('jefe')
  await expect(page.locator('.pistas .lista')).toHaveCount(0)
  // Y quien no vende aquí es Karata, que es quien trae las pistas en Elantris.
  await expect(page.locator('.pistas h3')).toHaveText('Pistas de Karata')

  // Los apuntes de este camino los firma Raoden.
  await expect(page.locator('.apunte .titulo')).toContainText('El apunte de Raoden')
})

test('la pestaña tiene su icono, y no hay un 404 en cada carga', async ({ page }) => {
  // El sitio no declaraba ninguno, así que el navegador pedía /favicon.ico por
  // su cuenta -en la raíz del dominio, que no es nuestra- y se llevaba un 404
  // en cada visita.
  const fallidas = []
  page.on('response', (respuesta) => {
    if (respuesta.status() >= 400 && /favicon|apple-touch/.test(respuesta.url())) {
      fallidas.push(`${respuesta.status()} ${respuesta.url()}`)
    }
  })

  await page.goto('')
  const icono = page.locator('link[rel="icon"]')
  await expect(icono).toHaveCount(1)

  // Y el fichero está de verdad donde el enlace dice, con la base del sitio
  // delante: en Pages la raíz no es nuestra.
  const donde = await icono.getAttribute('href')
  const traido = await page.request.get(new URL(donde, page.url()).href)
  expect(traido.status()).toBe(200)
  expect(await traido.text()).toContain('<svg')
  expect(fallidas).toEqual([])
})

test('la antesala explica de qué va todo esto', async ({ page }) => {
  await page.goto('')
  // Mientras no se haya leído, la entrada la ofrece.
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

  await page.goto('#/itinerario/era2')
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
