/**
 * El corazón del sandbox de SQL, aparte del cartero.
 *
 * Está separado de `entorno-sql.js` por un motivo muy concreto: las pruebas
 * ejecutan **este mismo fichero** en node contra `sql.js`, para comprobar que
 * la consulta de referencia de cada reto resuelve de verdad sus tests. Si la
 * lógica viviera dentro del worker, la prueba tendría que reimplementarla, y
 * entonces estaría comprobando su propia copia y no lo que juega la gente.
 *
 * Aquí está: montar la base del reto, ejecutar la consulta, traducir lo que
 * SQLite se queje y armar el ámbito de los tests. El worker solo pone los
 * mensajes.
 *
 * Es un script clásico, como sus vecinos: lo carga `importScripts` desde
 * public/ y no puede importar nada del paquete.
 */
;(function (global) {
  'use strict'

  /**
   * Una fila como objeto, con sus columnas por nombre.
   *
   * sql.js devuelve `{ columns: [...], values: [[...], ...] }` -columnas aparte
   * y filas como listas-, que es cómodo para pintar una tabla y muy incómodo
   * para escribir un test. Los tests comparan `{ nombre: 'Raoden', aones: 3 }`,
   * que es como se lee una fila en voz alta.
   */
  function comoObjetos(resultado) {
    if (!resultado) return []
    return resultado.values.map(function (fila) {
      var objeto = {}
      for (var i = 0; i < resultado.columns.length; i++) objeto[resultado.columns[i]] = fila[i]
      return objeto
    })
  }

  /**
   * Si lo que SQLite se queja es de que no entiende la consulta.
   *
   * Importa la diferencia: un error de sintaxis se le enseña al jugador **antes
   * que cualquier test**, porque los tests de una consulta que no se entiende
   * no dicen nada. Una columna que no existe cuenta como sintaxis a propósito:
   * es una errata, y se lee mejor arriba que sepultada entre comprobaciones.
   */
  function esDeSintaxis(mensaje) {
    return /syntax error|no such column|no such table|no such function|incomplete input|unrecognized token|ambiguous column/i.test(
      mensaje,
    )
  }

  /**
   * Traduce al español lo que dice SQLite, que habla en inglés y a veces en
   * clave. Lo que no se reconoce se pasa tal cual: es más útil el mensaje
   * original que un «algo ha fallado».
   */
  function enCastellano(mensaje) {
    var texto = String(mensaje || '')
    var traducciones = [
      [/^near "(.+?)": syntax error$/i, 'Hay un error de sintaxis junto a «$1». Mira lo que va justo antes.'],
      [/^unrecognized token: (.+)$/i, 'Ahí hay algo que SQLite no sabe leer: $1. ¿Una comilla suelta?'],
      [/^no such table: (.+)$/i, 'No existe ninguna tabla que se llame «$1». Mira el esquema, que lo tienes debajo del enunciado.'],
      [/^no such column: (.+)$/i, 'No existe ninguna columna que se llame «$1». Puede ser una errata, o puede estar en la otra tabla.'],
      [/^no such function: (.+)$/i, 'SQLite no conoce ninguna función que se llame «$1».'],
      [/^incomplete input$/i, 'La consulta se queda a medias. ¿Te falta cerrar un paréntesis, una comilla o un `END`?'],
      [/^ambiguous column name: (.+)$/i, 'La columna «$1» está en las dos tablas y no sé a cuál te refieres. Ponle la tabla delante.'],
      [/UNIQUE constraint failed: (.+)/i, 'Ya hay una fila con ese valor en $1, y ahí no se admiten repetidos.'],
      [/FOREIGN KEY constraint failed/i, 'Estás apuntando a una fila que no existe -o borrando una a la que otras apuntan-. La clave ajena no lo permite.'],
      [/NOT NULL constraint failed: (.+)/i, 'La columna $1 no puede quedarse vacía, y la estás dejando sin valor.'],
      [/CHECK constraint failed: (.+)/i, 'El valor no pasa la comprobación que la tabla tiene puesta en $1.'],
    ]
    for (var i = 0; i < traducciones.length; i++) {
      if (traducciones[i][0].test(texto)) return texto.replace(traducciones[i][0], traducciones[i][1])
    }
    return texto
  }

  /**
   * Monta la base del reto: el esquema, los datos y las claves ajenas puestas.
   *
   * SQLite trae las claves ajenas **apagadas** por omisión, herencia de sus
   * versiones antiguas. Sin encenderlas, el mundo que las enseña las enseñaría
   * como un adorno: se podría insertar un hijo de un padre que no existe y no
   * pasaría nada.
   */
  function montarBase(SQL, esquema, datos) {
    var base = new SQL.Database()
    base.run('PRAGMA foreign_keys = ON;')
    if (esquema) base.run(esquema)
    if (datos) base.run(datos)
    return base
  }

  /**
   * El resultado de una consulta, escrito como se lee: cabecera y filas,
   * separadas por barras.
   *
   * Esto no es un adorno. En SQL el resultado **es** la respuesta, y un panel
   * que solo diga «tres tests en verde» esconde justo lo que hay que mirar:
   * cuántas filas han salido, en qué orden y con qué columnas. En una consola de
   * verdad esto sale siempre, así que aquí también.
   *
   * Se separa con ` | ` y sin alinear a propósito: los retos de predecir
   * comparan el texto con los espacios ya encogidos, así que una tabla alineada
   * a mano y otra alineada por el ancho de sus datos tienen que dar lo mismo.
   */
  function comoTabla(resultado) {
    if (!resultado || resultado.values.length === 0) return '(sin filas)'
    var lineas = [resultado.columns.join(' | ')]
    for (var i = 0; i < resultado.values.length; i++) {
      lineas.push(
        resultado.values[i]
          .map(function (celda) {
            return celda === null ? 'NULL' : String(celda)
          })
          .join(' | '),
      )
    }
    return lineas.join('\n')
  }

  /**
   * Lo que se les pone a los tests en el ámbito.
   *
   * - `filas` y `columnas`: el **último** resultado de la consulta del jugador.
   *   El último y no el primero porque un trazo de varias sentencias acaba con
   *   el `SELECT` que comprueba lo que ha hecho.
   * - `resultados`: todos, para los retos que devuelven más de una tabla.
   * - `consulta(sql)`: pregúntale tú a la base. Es lo que permite comprobar que
   *   un `UPDATE` ha cambiado lo que tenía que cambiar **y nada más**, porque un
   *   `UPDATE` no devuelve filas.
   * - `plan(sql)`: el `EXPLAIN QUERY PLAN` en una lista de frases, para el mundo
   *   de los índices: ahí lo que se aprende no es el resultado, es el camino.
   * - `cuantas(tabla)`: el contar de toda la vida, que se escribe cien veces.
   * - `consultaEscrita`: el texto tal cual, para los tests que hablan de la
   *   forma de la consulta y no de lo que devuelve.
   */
  function utilesDe(base, resultados, escrita) {
    var ultimo = resultados.length > 0 ? resultados[resultados.length - 1] : null

    function consulta(sql) {
      return comoObjetos(base.exec(sql)[0])
    }

    return {
      filas: comoObjetos(ultimo),
      columnas: ultimo ? ultimo.columns.slice() : [],
      resultados: resultados.map(function (cada) {
        return { columnas: cada.columns.slice(), filas: comoObjetos(cada) }
      }),
      consulta: consulta,
      plan: function (sql) {
        return consulta('EXPLAIN QUERY PLAN ' + sql).map(function (paso) {
          return paso.detail
        })
      },
      cuantas: function (tabla) {
        return consulta('SELECT COUNT(*) AS n FROM ' + tabla)[0].n
      },
      consultaEscrita: String(escrita == null ? '' : escrita),
    }
  }

  /**
   * El ámbito de los tests.
   *
   * Aquí el código del jugador **no entra**, y esa es la diferencia con
   * `runner-comun.js`: es SQL, no compilaría dentro de una función de
   * JavaScript. Lo que entra es su resultado.
   */
  function construirTests(tests) {
    var llamadas = tests
      .map(function (test) {
        return (
          'await __api.registrar(' + JSON.stringify(test.nombre) + ', async function () {\n' +
          test.codigo + '\n});'
        )
      })
      .join('\n')

    var fuente =
      '"use strict";\n' +
      'return (async function (__api, __sql) {\n' +
      'const esperar = __api.esperar, consola = __api.consola;\n' +
      'const filas = __sql.filas, columnas = __sql.columnas, resultados = __sql.resultados;\n' +
      'const consulta = __sql.consulta, plan = __sql.plan, cuantas = __sql.cuantas;\n' +
      'const consultaEscrita = __sql.consultaEscrita;\n' +
      llamadas + '\n' +
      '});'

    return new Function(fuente)()
  }

  /**
   * Corrige un envío de principio a fin, con la base recién montada.
   *
   * **De cero en cada envío**, y no es una precaución teórica: un reto de
   * `UPDATE` que se ejecuta dos veces sumaría dos veces, y el segundo intento
   * fallaría por lo que hizo el primero.
   *
   * @param {object} SQL el módulo que devuelve `initSqlJs`
   * @param {{codigo: string, esquema?: string, datos?: string, tests?: Array}} envio
   * @param {object} api lo que devuelve `crearAserciones`
   */
  function corregir(SQL, envio, api) {
    var base = montarBase(SQL, envio.esquema, envio.datos)

    return Promise.resolve()
      .then(function () {
        var resultados
        try {
          resultados = base.exec(envio.codigo)
        } catch (error) {
          var mensaje = (error && error.message) || String(error)
          var fallo = new Error(enCastellano(mensaje))
          fallo.sintaxis = esDeSintaxis(mensaje)
          throw fallo
        }
        // Lo que ha devuelto, a la consola, antes de comprobar nada: si un test
        // falla, lo primero que hay que poder mirar es qué ha salido de verdad.
        // Una consulta que no devuelve filas -un `UPDATE`- no imprime nada.
        for (var i = 0; i < resultados.length; i++) console.log(comoTabla(resultados[i]))
        return construirTests(envio.tests || [])(api, utilesDe(base, resultados, envio.codigo))
      })
      .then(
        function () {
          base.close()
        },
        function (error) {
          try { base.close() } catch (e) { /* si ya estaba cerrada, mejor */ }
          throw error
        },
      )
  }

  global.nucleoSql = {
    comoObjetos: comoObjetos,
    comoTabla: comoTabla,
    esDeSintaxis: esDeSintaxis,
    enCastellano: enCastellano,
    montarBase: montarBase,
    utilesDe: utilesDe,
    construirTests: construirTests,
    corregir: corregir,
  }
})(typeof self !== 'undefined' ? self : this)
