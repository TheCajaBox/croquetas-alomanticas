import { describe, expect, it } from 'vitest'

import { comprobarRequisitosSql, cuentaPalabra, esqueletoSql, sentenciasDe } from '../src/motor/lenguajes/sql.js'
import { cargarTodosLosRetos, cuantasVariantes, enVariante } from '../src/contenido/retos/index.js'
import { SIN_CODIGO, codigoDeReferencia } from './revisarRetos.js'
import { sandboxSql } from './ayudaSql.js'
import { normalizar } from '../src/almacen/juego.js'

/**
 * Las consultas de referencia de los retos de SQL, **ejecutando SQLite de verdad**.
 *
 * Con `sql.js`, que es el mismo SQLite compilado a WebAssembly que carga el
 * navegador desde `public/vendor/`: mismo binario y misma versión, así que lo
 * que pasa aquí pasa allí. Y con el mismo fichero de lógica que usa el worker
 * -`public/sandbox/nucleo-sql.js`-, leído de su sitio.
 *
 * Sin esto, los tests de un reto de SQL serían texto que nadie ha ejecutado
 * nunca: pasarían por buenos hasta que alguien jugara. Y en SQL escuece más que
 * en otros sitios, porque una consulta mal escrita casi nunca revienta: devuelve
 * **otra cosa**, y otra cosa se cuela.
 */
const RETOS = await cargarTodosLosRetos()

const retosDeSql = RETOS.filter((reto) => reto.entorno === 'sql' && !SIN_CODIGO.includes(reto.tipo))

describe('las consultas de referencia de los retos de SQL resuelven sus retos', () => {
  it('hay retos de SQL', () => {
    expect(retosDeSql.length).toBeGreaterThan(0)
  })

  /** El mismo examen para el reto y para cada una de sus tandas de práctica. */
  async function comprobar(reto) {
    const sandbox = await sandboxSql()
    const consulta = codigoDeReferencia(reto)

    // Las reglas del reto se miran fuera del sandbox, igual que en el juego: es
    // `motor/lenguajes/sql.js` quien lo hace, y aquí se le pregunta a él.
    const incumplidos = comprobarRequisitosSql(consulta, reto.requisitos)
      .filter((r) => !r.cumplido)
      .map((r) => `${r.tipo}${r.valor ? ` ${r.valor}` : ''}`)
    expect(incumplidos, 'la consulta de referencia no cumple los requisitos del propio reto').toEqual([])

    const informe = await sandbox.corregir({
      codigo: consulta,
      esquema: reto.esquema,
      datos: reto.datos,
      tests: reto.tests ?? [],
      entradas: reto.entradas,
    })

    expect(informe.error, 'la consulta de referencia revienta').toBe(null)
    const rojos = informe.tests.filter((t) => !t.ok)
    expect(rojos.map((t) => `${t.nombre}: ${t.mensaje}`), 'tests en rojo').toEqual([])
    expect(informe.tests.length, 'un reto de escribir sin tests no comprueba nada').toBeGreaterThan(0)
  }

  for (const reto of retosDeSql) {
    it(`${reto.id}: ${reto.titulo}`, () => comprobar(reto), 30_000)

    for (let i = 1; i <= cuantasVariantes(reto); i += 1) {
      it(`${reto.id}: práctica ${i} de ${cuantasVariantes(reto)}`, () => comprobar(enVariante(reto, i)), 30_000)
    }
  }
})

describe('todo reto de SQL trae la base con la que hablar', () => {
  const todosLosDeSql = RETOS.filter((reto) => reto.entorno === 'sql')

  it('cada uno declara su esquema', () => {
    // Un reto de SQL sin `esquema` no es un reto difícil: es un reto imposible,
    // porque la consulta le pregunta a una base vacía. Y el panel de las tablas
    // se apoya en el mismo campo, así que sin él el jugador tampoco vería a qué
    // está preguntando.
    const sinTablas = todosLosDeSql
      .filter((reto) => !/CREATE\s+TABLE/i.test(reto.esquema ?? ''))
      .map((reto) => reto.id)
    expect(sinTablas).toEqual([])
  })

  it('los datos son datos y no esquema', () => {
    // `datos` se enseña doblado bajo «las filas que hay dentro». Un `CREATE`
    // metido ahí funcionaría igual y saldría en el sitio equivocado, así que la
    // división se fija aquí.
    const mezclados = todosLosDeSql
      .filter((reto) => /CREATE\s+TABLE/i.test(reto.datos ?? ''))
      .map((reto) => reto.id)
    expect(mezclados).toEqual([])
  })

  it('las tablas del esquema son las que la consulta de referencia usa', async () => {
    // Sin esto, un reto podía traer el esquema de otro -copiar y pegar el de al
    // lado es lo que se hace al escribir doce- y solo se notaría al jugarlo.
    const sandbox = await sandboxSql()
    for (const reto of retosDeSql) {
      const informe = await sandbox.corregir({
        codigo: codigoDeReferencia(reto),
        esquema: reto.esquema,
        datos: reto.datos,
        tests: [],
      })
      expect(informe.error, `${reto.id}: ${informe.error?.mensaje}`).toBe(null)
    }
  }, 60_000)
})

describe('el frente de SQL mira las palabras y no el texto suelto', () => {
  it('un JOIN dentro de una cadena o de un comentario no es un JOIN', () => {
    // Es el motivo entero de que exista `esqueletoSql`: buscar `/JOIN/i` sobre
    // la consulta encuentra dos aquí y ninguno de los dos es código.
    const disimulando = "SELECT nombre FROM aones WHERE nota = 'sin JOIN' -- ojo al JOIN"
    expect(cuentaPalabra(disimulando, 'JOIN')).toBe(0)
    expect(cuentaPalabra('SELECT * FROM a JOIN b ON a.id = b.a_id', 'JOIN')).toBe(1)
  })

  it('tachar no mueve las líneas', () => {
    // El esqueleto se usa también para contar sentencias y para señalar dónde
    // está el fallo: si al tachar un comentario de dos líneas se perdieran los
    // saltos, el número de línea del error dejaría de cuadrar con el editor.
    const consulta = "SELECT 1 /* uno\ndos */\nFROM t"
    expect(esqueletoSql(consulta).split('\n').length).toBe(consulta.split('\n').length)
    expect(esqueletoSql(consulta).length).toBe(consulta.length)
  })

  it('dos comillas seguidas dentro de una cadena no la cierran', () => {
    expect(cuentaPalabra("SELECT 'un JOIN'' y otro JOIN' AS x", 'JOIN')).toBe(0)
  })

  it('cuenta las sentencias de verdad, sin contar el punto y coma final', () => {
    expect(sentenciasDe('SELECT 1;')).toBe(1)
    expect(sentenciasDe('SELECT 1')).toBe(1)
    expect(sentenciasDe('SELECT 1; SELECT 2;')).toBe(2)
    // Un punto y coma dentro de una cadena no separa nada.
    expect(sentenciasDe("SELECT 'a;b'")).toBe(1)
  })

  it('«GROUP BY» se encuentra partido en dos líneas', () => {
    expect(cuentaPalabra('SELECT a FROM t GROUP\n   BY a', 'GROUP BY')).toBe(1)
  })

  it('prohibeAsterisco caza el `SELECT *` y el `t.*`, y deja pasar la multiplicación', () => {
    const norma = [{ tipo: 'prohibeAsterisco' }]
    const cumple = (consulta) => comprobarRequisitosSql(consulta, norma)[0].cumplido
    expect(cumple('SELECT * FROM t')).toBe(false)
    expect(cumple('SELECT t.* FROM t')).toBe(false)
    expect(cumple('SELECT precio * 2 AS doble FROM t')).toBe(true)
    // Y un asterisco dentro de un comentario tampoco cuenta.
    expect(cumple('SELECT a FROM t -- antes ponía SELECT *')).toBe(true)
  })

  it('la norma se explica con las palabras del reto, no con las del catálogo', () => {
    // El campo se llama `texto` en los 350 requisitos escritos en
    // `contenido/retos/`, y ni uno lo llama `mensaje`. Leyendo solo `mensaje`
    // -que es lo que hacía el comprobador de JavaScript- cada norma que un reto
    // se había tomado la molestia de explicar salía con la frase genérica, y no
    // fallaba nada: salía otra cosa.
    const [norma] = comprobarRequisitosSql('SELECT * FROM t', [
      { tipo: 'prohibeAsterisco', texto: 'Nombra las columnas, que para eso están' },
    ])
    expect(norma.cumplido).toBe(false)
    expect(norma.mensaje).toBe('Nombra las columnas, que para eso están')

    // Y si el reto no la explica, la explica el catálogo.
    const [sinTexto] = comprobarRequisitosSql('SELECT * FROM t', [{ tipo: 'prohibeAsterisco' }])
    expect(sinTexto.mensaje).toContain('SELECT *')
  })

  it('un requisito desconocido revienta en vez de darse por bueno', () => {
    // Callarse sería lo peor: el reto se publicaría sin la norma que su
    // enunciado promete, y el jugador aprobaría por el camino que se le prohibió.
    expect(() => comprobarRequisitosSql('SELECT 1', [{ tipo: 'usaMagia' }])).toThrow(/desconocido/)
  })
})

describe('el sandbox de SQL distingue lo que tiene que distinguir', () => {
  const esquema = 'CREATE TABLE t (id INTEGER PRIMARY KEY, n INTEGER);'
  const datos = 'INSERT INTO t (n) VALUES (1), (2), (3);'

  it('la sintaxis rota es sintaxis rota, no un test en rojo', async () => {
    const sandbox = await sandboxSql()
    const informe = await sandbox.corregir({
      codigo: 'SELEC n FROM t',
      esquema,
      datos,
      tests: [{ nombre: 'da tres', codigo: 'esperar(filas).tieneLongitud(3)' }],
    })
    expect(informe.error?.sintaxis).toBe(true)
    expect(informe.tests).toEqual([])
  })

  it('una tabla que no existe se dice en castellano y manda al esquema', async () => {
    const sandbox = await sandboxSql()
    const informe = await sandbox.corregir({ codigo: 'SELECT n FROM tt', esquema, datos, tests: [] })
    expect(informe.error.mensaje).toContain('No existe ninguna tabla')
    expect(informe.error.mensaje).toContain('esquema')
  })

  it('un test que falla lo dice con las mismas palabras que en JavaScript', async () => {
    const sandbox = await sandboxSql()
    const informe = await sandbox.corregir({
      codigo: 'SELECT n FROM t WHERE n > 1',
      esquema,
      datos,
      tests: [{ nombre: 'da tres', codigo: 'esperar(filas.length, "cuántas filas").igualA(3)' }],
    })
    expect(informe.tests[0].ok).toBe(false)
    expect(informe.tests[0].mensaje).toBe('Esperaba que cuántas filas fuera 3, pero es 2.')
  })

  it('la base se monta de cero en cada envío', async () => {
    // Si se reutilizara, un reto de `UPDATE` sumaría dos veces al segundo
    // intento y el jugador fallaría por lo que hizo antes, no por lo que ha
    // escrito ahora.
    const sandbox = await sandboxSql()
    const envio = {
      codigo: 'UPDATE t SET n = n + 10; SELECT n FROM t ORDER BY n;',
      esquema,
      datos,
      tests: [{ nombre: 'once, doce y trece', codigo: 'esperar(filas.map((f) => f.n)).igualA([11, 12, 13])' }],
    }
    expect((await sandbox.corregir(envio)).ok).toBe(true)
    expect((await sandbox.corregir(envio)).ok, 'el segundo envío ve lo que hizo el primero').toBe(true)
  })

  it('las claves ajenas están encendidas, que no es lo que SQLite hace de serie', async () => {
    const sandbox = await sandboxSql()
    const informe = await sandbox.corregir({
      esquema: codigoSql(
        'CREATE TABLE padres (id INTEGER PRIMARY KEY);',
        'CREATE TABLE hijos (id INTEGER PRIMARY KEY, padre_id INTEGER REFERENCES padres(id));',
      ),
      datos: 'INSERT INTO padres (id) VALUES (1);',
      codigo: 'INSERT INTO hijos (padre_id) VALUES (99);',
      tests: [],
    })
    expect(informe.error.mensaje).toContain('clave ajena')
  })

  it('`consulta` mira la base después, que es la única forma de comprobar un UPDATE', async () => {
    const sandbox = await sandboxSql()
    const informe = await sandbox.corregir({
      codigo: 'UPDATE t SET n = 0 WHERE n = 2',
      esquema,
      datos,
      tests: [
        { nombre: 'el dos vale cero', codigo: "esperar(consulta('SELECT n FROM t ORDER BY id').map((f) => f.n)).igualA([1, 0, 3])" },
        { nombre: 'y no se ha perdido ninguna fila', codigo: "esperar(cuantas('t')).igualA(3)" },
      ],
    })
    expect(informe.tests.filter((t) => !t.ok).map((t) => t.mensaje)).toEqual([])
  })
})

const codigoSql = (...lineas) => lineas.join('\n')

/**
 * Las entradas: el mundo de la inyección, con la base delante.
 *
 * Un reto de inyección solo enseña algo si el ataque **distingue**: la consulta
 * parametrizada tiene que rebotarlo y la pegada con comillas tiene que caer. Si
 * las dos hacen lo mismo, el reto es un dibujo de un ataque y no un ataque.
 *
 * Esto se comprueba aquí y no en `tests/seguridad.test.js` porque ese ejecuta
 * JavaScript en un `vm` de node y estos retos son SQL: hace falta SQLite.
 */
describe('las entradas se atan como parámetros de verdad', () => {
  const ESQUEMA = 'CREATE TABLE cuentas (usuario TEXT, secreto TEXT);'
  const DATOS =
    "INSERT INTO cuentas VALUES ('shai', 'el sello'), ('gaotona', 'el original'), ('hanshuxen', 'la muralla');"
  const HOSTIL = "' OR 1=1 --"

  const contar = (informe) => informe.tests.filter((t) => t.ok).length

  it('con `:nombre`, la entrada hostil es un nombre que no existe', async () => {
    const informe = await (await sandboxSql()).corregir({
      codigo: 'SELECT usuario, secreto FROM cuentas WHERE usuario = :quien;',
      esquema: ESQUEMA,
      datos: DATOS,
      entradas: { quien: HOSTIL },
      tests: [{ nombre: 'cero filas', codigo: "esperar(filas, 'las filas').tieneLongitud(0)" }],
    })
    expect(informe.error).toBe(null)
    expect(contar(informe)).toBe(1)
  })

  it('pegada con comillas, el ataque entra y se lleva la tabla', async () => {
    const informe = await (await sandboxSql()).corregir({
      codigo: "SELECT usuario, secreto FROM cuentas WHERE usuario = '" + HOSTIL + "';",
      esquema: ESQUEMA,
      datos: DATOS,
      entradas: { quien: HOSTIL },
      tests: [{ nombre: 'las tres filas', codigo: "esperar(filas, 'las filas').tieneLongitud(3)" }],
    })
    expect(informe.error).toBe(null)
    expect(contar(informe)).toBe(1)
  })

  it('con el nombre de alguien de verdad, la parametrizada devuelve su fila', async () => {
    const informe = await (await sandboxSql()).corregir({
      codigo: 'SELECT usuario, secreto FROM cuentas WHERE usuario = :quien;',
      esquema: ESQUEMA,
      datos: DATOS,
      entradas: { quien: 'gaotona' },
      tests: [
        { nombre: 'una fila', codigo: "esperar(filas, 'las filas').tieneLongitud(1)" },
        { nombre: 'la suya', codigo: "esperar(filas[0].secreto, 'el secreto').igualA('el original')" },
      ],
    })
    expect(informe.error).toBe(null)
    expect(contar(informe)).toBe(2)
  })

  it('los tests pueden leer lo que se ha metido, por nombre', async () => {
    const informe = await (await sandboxSql()).corregir({
      codigo: 'SELECT usuario FROM cuentas WHERE usuario = :quien;',
      esquema: ESQUEMA,
      datos: DATOS,
      entradas: { quien: HOSTIL },
      tests: [
        {
          nombre: 'la entrada está en el ámbito',
          codigo: "esperar(entradas.quien, 'lo que se ha colado').igualA(\"' OR 1=1 --\")",
        },
      ],
    })
    expect(informe.error).toBe(null)
    expect(contar(informe)).toBe(1)
  })

  it('pasar entradas a una consulta que no las usa no es un error', async () => {
    // Y hace falta que no lo sea: si lo fuera, la versión mala del reto no se
    // podría ni ejecutar y el jugador vería un error del motor en vez del
    // ataque funcionando, que es lo que tiene que ver.
    const informe = await (await sandboxSql()).corregir({
      codigo: 'SELECT usuario FROM cuentas;',
      esquema: ESQUEMA,
      datos: DATOS,
      entradas: { quien: HOSTIL },
      tests: [{ nombre: 'las tres', codigo: "esperar(filas, 'las filas').tieneLongitud(3)" }],
    })
    expect(informe.error).toBe(null)
    expect(contar(informe)).toBe(1)
  })
})

/**
 * Los retos de predecir de SQL: que la tabla esperada sea la que de verdad sale.
 *
 * Un reto de predecir no se corrige ejecutando: se compara lo que has escrito con
 * `respuestaEsperada` (ver `normalizar` en `almacen/juego.js`). En SQL lo que se
 * predice es **el resultado**, escrito como lo escribe `comoTabla` en
 * `nucleo-sql.js`: la línea de las columnas y una por fila, separadas por ` | `,
 * con los nulos como `NULL`.
 *
 * Si esa cadena no es lo que la consulta devuelve, **quien acierta recibe un
 * «no»** y encima con la tabla real al lado contradiciendo el veredicto. Sus
 * propios `tests` no lo cazan: miran `filas` y `columnas` por separado, no el
 * texto contra el que se corrige.
 */
describe('lo que hay que predecir en SQL es la tabla que de verdad sale', () => {
  const aPredecir = RETOS.filter((reto) => reto.tipo === 'prediccion' && reto.entorno === 'sql')

  /**
   * Los dos que **no** piden reproducir la salida, sino contestar algo sobre
   * ella. Ahí la respuesta esperada no puede ser el texto entero de la consola,
   * y exigirlo sería exigir que el reto fuera otro reto.
   *
   * De esos se comprueba lo que sí tiene que cumplirse: que cada línea de la
   * respuesta **aparezca** en lo que de verdad sale. Es más flojo que la
   * igualdad, y sigue cazando el fallo que importa -una respuesta que la
   * realidad contradice-.
   */
  const RESPONDEN_UNA_PREGUNTA = {
    'trazos-03-que-deja-la-orden':
      'son dos órdenes y solo se predice lo que devuelve la segunda; la consola enseña las dos',
    'grieta-05-el-union-que-se-lleva-otra-tabla':
      'no se pide la salida sino cuántas filas y de qué tabla, que son dos palabras que la salida contiene',
  }

  it('hay retos de predecir en SQL', () => {
    expect(aPredecir.length).toBeGreaterThan(0)
  })

  it('la lista de excepciones no tiene fantasmas', () => {
    // Un id mal escrito aquí dejaría a un reto sin comprobar y a la excepción
    // protegiendo a nadie.
    for (const id of Object.keys(RESPONDEN_UNA_PREGUNTA)) {
      expect(aPredecir.some((reto) => reto.id === id), `${id} no es un reto de predecir de SQL`).toBe(true)
    }
  })

  for (const reto of aPredecir) {
    it(
      `${reto.id}: ${reto.titulo}`,
      async () => {
        const sandbox = await sandboxSql()
        const informe = await sandbox.corregir({
          codigo: codigoDeReferencia(reto),
          esquema: reto.esquema,
          datos: reto.datos,
          tests: reto.tests ?? [],
          entradas: reto.entradas,
        })
        expect(informe.error, 'la consulta mostrada revienta').toBe(null)
        const real = (informe.consola ?? []).map((linea) => linea.texto).join('\n')
        const porque = RESPONDEN_UNA_PREGUNTA[reto.id]

        if (!porque) {
          expect(
            normalizar(real),
            `la tabla real no es la respuesta esperada:\n--- real ---\n${real}\n--- esperada ---\n${reto.respuestaEsperada}`,
          ).toBe(normalizar(reto.respuestaEsperada))
          return
        }

        for (const linea of normalizar(reto.respuestaEsperada).split('\n')) {
          expect(
            normalizar(real).split('\n'),
            `${porque}; y «${linea}» no sale por ninguna parte:\n--- real ---\n${real}`,
          ).toContain(linea)
        }
      },
      30_000,
    )
  }
})
