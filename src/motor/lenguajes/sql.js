/**
 * El frente de SQL: qué se mira en una consulta antes de ejecutarla.
 *
 * Aquí sí se puede mirar desde el juego, y no como en PHP. No porque haya un
 * analizador de SQL en el paquete -no lo hay-, sino porque lo que estos retos
 * exigen se decide **con las palabras**: que haya un `JOIN`, que no haya un
 * `SELECT *`, que la respuesta sea una sola consulta y no tres seguidas. Para
 * eso no hace falta un árbol; hace falta saber qué trozos del texto son código
 * y cuáles no.
 *
 * Y eso es justo lo que no se puede hacer con una expresión regular a pelo:
 *
 *     SELECT nombre FROM aones WHERE nota = 'sin JOIN'  -- ojo al JOIN
 *
 * Un `/JOIN/i` encuentra dos, y ninguno es un `JOIN`. Así que primero se tacha
 * lo que no es código -comentarios y literales- y se busca sobre el resto.
 *
 * Si la consulta no se entiende, lo dice SQLite dentro del sandbox, igual que
 * en PHP: quien sabe de SQL es SQL.
 */

/** Un espacio por cada carácter tachado, para no mover columnas ni líneas. */
function tachar(largo, original) {
  let hueco = ''
  for (let i = 0; i < largo; i += 1) hueco += original[i] === '\n' ? '\n' : ' '
  return hueco
}

/**
 * Deja el esqueleto de la consulta: el código, y en el sitio de los
 * comentarios y de los literales, espacios.
 *
 * Se tachan y no se borran para que el número de línea de un error siga
 * cuadrando con lo que el jugador tiene escrito en el editor.
 */
export function esqueletoSql(codigo) {
  const texto = String(codigo ?? '')
  let salida = ''
  let i = 0

  while (i < texto.length) {
    const dos = texto.slice(i, i + 2)

    // Comentario de línea: -- hasta el salto.
    if (dos === '--') {
      const fin = texto.indexOf('\n', i)
      const hasta = fin === -1 ? texto.length : fin
      salida += tachar(hasta - i, texto.slice(i, hasta))
      i = hasta
      continue
    }

    // Comentario de bloque: /* … */, que puede llevar saltos dentro.
    if (dos === '/*') {
      const fin = texto.indexOf('*/', i + 2)
      const hasta = fin === -1 ? texto.length : fin + 2
      salida += tachar(hasta - i, texto.slice(i, hasta))
      i = hasta
      continue
    }

    // Cadenas ('…'), identificadores entre comillas ("…") y los corchetes y
    // acentos graves que SQLite también acepta para nombrar columnas. Dentro de
    // una cadena, '' es una comilla escapada y no el final.
    const abre = texto[i]
    const cierra = abre === '[' ? ']' : abre
    if (abre === "'" || abre === '"' || abre === '`' || abre === '[') {
      let j = i + 1
      while (j < texto.length) {
        if (texto[j] === cierra) {
          if (texto[j + 1] === cierra) { j += 2; continue }
          j += 1
          break
        }
        j += 1
      }
      salida += tachar(j - i, texto.slice(i, j))
      i = j
      continue
    }

    salida += abre
    i += 1
  }

  return salida
}

/**
 * En cuántas sentencias va la respuesta.
 *
 * Hace falta para poder exigir una sola: media dificultad de un `JOIN` se
 * esquiva sacando las dos tablas por separado, y del `GROUP BY` igual. El
 * punto y coma final no cuenta como una sentencia vacía.
 */
export function sentenciasDe(codigo) {
  return esqueletoSql(codigo)
    .split(';')
    .map((cada) => cada.trim())
    .filter(Boolean).length
}

/** Cuántas veces sale una palabra -o una pareja como `GROUP BY`- en el código. */
export function cuentaPalabra(codigo, palabra) {
  const buscada = String(palabra ?? '').trim()
  if (!buscada) return 0
  // Los espacios de dentro valen por cualquier espacio en blanco, para que
  // `GROUP BY` encuentre un `GROUP\n  BY` escrito en dos líneas.
  const partes = buscada.split(/\s+/).map((cada) => cada.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const patron = new RegExp(`(?<![\\w$])${partes.join('\\s+')}(?![\\w$])`, 'gi')
  return (esqueletoSql(codigo).match(patron) ?? []).length
}

/**
 * Catálogo de requisitos de SQL, con la voz de quien los pide.
 *
 * Son los mismos verbos que en PHP -`usaPalabra`, `prohibePalabra`, `alMenos`,
 * `comoMucho`- más los tres que solo tienen sentido aquí.
 */
export const COMPROBACIONES_SQL = {
  usaPalabra: {
    mensaje: (valor) => `Aquí hace falta \`${valor}\`. Sin eso, la consulta puede dar el resultado y no ser la consulta que te pido.`,
    cumple: (codigo, valor) => cuentaPalabra(codigo, valor) > 0,
  },
  prohibePalabra: {
    mensaje: (valor) => `\`${valor}\` está prohibido en este trazo. Es justo el atajo que te estoy quitando.`,
    cumple: (codigo, valor) => cuentaPalabra(codigo, valor) === 0,
  },
  alMenos: {
    mensaje: (valor, veces) => `\`${valor}\` tiene que salir al menos ${veces} ${veces === 1 ? 'vez' : 'veces'}.`,
    cumple: (codigo, valor, veces) => cuentaPalabra(codigo, valor) >= veces,
  },
  comoMucho: {
    mensaje: (valor, veces) => `\`${valor}\` no puede salir más de ${veces} ${veces === 1 ? 'vez' : 'veces'}.`,
    cumple: (codigo, valor, veces) => cuentaPalabra(codigo, valor) <= veces,
  },

  /**
   * Ni `SELECT *` ni `SELECT t.*`.
   *
   * Es la mala costumbre que el primer mundo entero se dedica a quitar: pides
   * lo que no sabes que te van a dar, y el día que la tabla gana una columna tu
   * informe cambia solo. Se mira sobre el esqueleto, así que un `*` dentro de
   * una cadena o de un comentario no cuenta -ni tampoco una multiplicación,
   * que no lleva `SELECT` ni punto delante-.
   */
  prohibeAsterisco: {
    mensaje: () => 'Sin `SELECT *`. Nombra las columnas que quieres, una a una: pedir «todo» es pedir lo que todavía no existe.',
    cumple: (codigo) => !/(select\s+|\.)\*/i.test(esqueletoSql(codigo)),
  },

  /** Una consulta, no dos. Sacar las tablas por separado no es unirlas. */
  unaSolaConsulta: {
    mensaje: () => 'Esto se resuelve con **una** consulta. Sacar los datos en dos y juntarlos a ojo es hacer a mano lo que la base de datos hace mejor.',
    cumple: (codigo) => sentenciasDe(codigo) === 1,
  },

  /** Y al revés, para los trazos que sí piden varias: una transacción, por ejemplo. */
  alMenosSentencias: {
    mensaje: (valor, veces) => `Aquí hacen falta al menos ${veces} sentencias, separadas por \`;\`.`,
    cumple: (codigo, valor, veces) => sentenciasDe(codigo) >= veces,
  },
}

/**
 * @param {string} codigo la consulta del jugador
 * @param {Array<{tipo: string, valor?: string, veces?: number, mensaje?: string}>} requisitos
 */
export function comprobarRequisitosSql(codigo, requisitos = []) {
  if (requisitos.length === 0) return []

  return requisitos.map((requisito) => {
    const comprobacion = COMPROBACIONES_SQL[requisito.tipo]
    if (!comprobacion) {
      throw new Error(`Requisito de SQL desconocido: "${requisito.tipo}"`)
    }
    const veces = requisito.veces ?? 1
    return {
      tipo: requisito.tipo,
      cumplido: comprobacion.cumple(codigo, requisito.valor, veces),
      // `texto` primero, que es el campo que usan los retos. Ver el comentario
      // largo en `motor/chequeosEstaticos.js`.
      mensaje: requisito.texto ?? requisito.mensaje ?? comprobacion.mensaje(requisito.valor, veces),
    }
  })
}

export default {
  id: 'sql',

  revisar(codigo, reto) {
    return {
      requisitos: comprobarRequisitosSql(codigo, reto.requisitos),
      // Sin tocar: la consulta va al sandbox tal y como está escrita. No hay
      // guarda de bucles que inyectar -un `WITH RECURSIVE` que no termina lo
      // corta el `terminate()` del puente- y el esqueleto es solo para mirar.
      codigo,
    }
  },

  /**
   * Aquí sí hay oído fino, y sale gratis: las reglas de un reto de SQL se miran
   * sobre el texto, así que lo que se comprueba al ejecutar se puede comprobar
   * igual mientras se escribe. No hay nada que pueda reventar -no hay que
   * parsear nada- así que nunca se devuelve `null`.
   */
  enVivo(codigo, reto) {
    return comprobarRequisitosSql(codigo, reto.requisitos).filter((r) => !r.cumplido)
  },
}
