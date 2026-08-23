import { codigo, pista } from '../comun.js'
import { TRAZOS } from '../tablas-de-elantris.js'

export default {
  id: "trazos-11-por-que-tarda",
  mundo: "trazos",
  entorno: "sql",
  tipo: "codigo",
  titulo: "Por qué tarda, y qué hacer",
  enunciado: codigo(
    "Hasta ahora todo contestaba al instante porque hay seis filas. Con seis millones, la",
    "diferencia entre una consulta bien pensada y una mal pensada son horas.",
    "",
    "Y no se adivina: **se pregunta**. `EXPLAIN QUERY PLAN` delante de cualquier consulta cuenta",
    "lo que la base va a hacer:",
    "",
    "```sql",
    "EXPLAIN QUERY PLAN SELECT nombre FROM puestos WHERE gremio_id = 1;",
    "-- SCAN puestos                        <- recorre la tabla entera",
    "-- SEARCH puestos USING INDEX …         <- va directo",
    "```",
    "",
    "Un **índice** es una copia ordenada de una columna que la base mantiene al día para poder",
    "buscar sin recorrerlo todo. Acelera las lecturas que puedan usarlo y encarece **todas** las",
    "escrituras, porque hay que mantenerlo.",
    "",
    "La columna `puestos.gremio_id` es una clave ajena, y **SQLite no le pone índice por su",
    "cuenta**. Así que todo `JOIN` por ahí recorre la tabla entera.",
    "",
    "Escribe **dos órdenes**: crea un índice llamado `idx_puestos_gremio` sobre `gremio_id` de",
    "la tabla `puestos`, y después un `SELECT` de los nombres de los puestos del gremio 1,",
    "ordenados alfabéticamente.",
    "",
    "```sql",
    "CREATE INDEX nombre ON tabla(columna);",
    "```",
  ),
  esquema: TRAZOS.esquema,
  datos: TRAZOS.datos,
  inicial: codigo(
    "-- Primero el índice.",
    "",
    "",
    "-- Y después la consulta que lo va a usar.",
    "",
  ),
  solucion: codigo(
    "CREATE INDEX idx_puestos_gremio ON puestos(gremio_id);",
    "",
    "SELECT nombre",
    "FROM puestos",
    "WHERE gremio_id = 1",
    "ORDER BY nombre ASC;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "CREATE INDEX", texto: "Crea el índice con `CREATE INDEX`" },
    { tipo: "alMenosSentencias", veces: 2, texto: "Dos órdenes: el índice y la consulta" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas del `SELECT`" },
  ],
  tests: [
    {
      nombre: "el SELECT devuelve los dos puestos de los escribas, en orden",
      codigo: codigo(
        "esperar(columnas, 'las columnas').igualA(['nombre'])",
        "esperar(filas.map((f) => f.nombre), 'los nombres').igualA(['Aon Aon', 'Aon Ien'])",
      ),
    },
    {
      nombre: "el índice existe y se llama como se pedía",
      codigo: codigo(
        "const indices = consulta(\"SELECT name FROM sqlite_master WHERE type = 'index' AND name NOT LIKE 'sqlite_%'\")",
        "esperar(indices.map((f) => f.name), 'los índices').contiene('idx_puestos_gremio')",
      ),
    },
    {
      nombre: "y la base lo usa: el plan dice SEARCH y no SCAN",
      codigo: codigo(
        "// Esta es la comprobación que importa. Un índice que existe y que la base no",
        "// usa es espacio y trabajo de más a cambio de nada, y no hay manera de saberlo",
        "// mirando el índice: hay que mirar el plan.",
        "const pasos = plan('SELECT nombre FROM puestos WHERE gremio_id = 1').join(' | ')",
        "esperar(pasos, 'el plan').contiene('idx_puestos_gremio')",
        "esperar(pasos, 'el plan').contiene('SEARCH')",
      ),
    },
    {
      nombre: "una columna sin índice sigue recorriendo la tabla entera",
      codigo: codigo(
        "// `abierto` no tiene índice: no hay por dónde empezar a buscar, así que hay",
        "// que mirar todas las filas. Con seis da igual; con seis millones, no.",
        "esperar(plan('SELECT nombre FROM puestos WHERE abierto = 0').join(' | '), 'el plan sin índice')",
        "  .contiene('SCAN')",
      ),
    },
    {
      nombre: "y en ventas no hacía falta ninguno: el UNIQUE ya trae el suyo",
      codigo: codigo(
        "// La restricción `UNIQUE (puesto_id, dia)` obliga a la base a mantener un",
        "// índice para poder comprobarla, y ese índice empieza por `puesto_id`, así que",
        "// sirve también para buscar por ahí. Crear otro sobre `puesto_id` sería",
        "// trabajo y espacio de más sin ganar nada, y nadie te lo diría.",
        "const enVentas = plan('SELECT dia FROM ventas WHERE puesto_id = 3').join(' | ')",
        "esperar(enVentas, 'el plan en ventas').contiene('INDEX')",
        "esperar(enVentas, 'el plan en ventas').contiene('sqlite_autoindex')",
      ),
    },
    {
      nombre: "el índice no cambia los datos",
      codigo: codigo(
        "esperar(cuantas('puestos'), 'los puestos').igualA(6)",
        "esperar(cuantas('ventas'), 'las ventas').igualA(6)",
      ),
    },
  ],
  variantes: [
    {
      titulo: "Por qué tarda · otra tanda",
      datos: codigo(
        'INSERT INTO gremios (id, nombre) VALUES',
        "  (1, 'escribas'), (2, 'canteros'), (3, 'cocineros'), (4, 'aones');",
        '',
        'INSERT INTO puestos (id, nombre, gremio_id, abierto) VALUES',
        "  (1, 'Aon Aon',    1, 1),",
        "  (2, 'La piedra',  2, 1),",
        "  (3, 'El caldero', 3, 1),",
        "  (4, 'Aon Ien',    1, 1),",
        "  (5, 'Aon Ashe',   1, 0);",
        '',
        'INSERT INTO ventas (id, puesto_id, dia, monedas) VALUES',
        "  (1, 3, 'jueves', 70), (2, 1, 'jueves', 10);",
      ),
      tests: [
        {
          nombre: "aquí los escribas son tres, en orden alfabético",
          codigo: codigo(
            "esperar(columnas).igualA(['nombre'])",
            "esperar(filas.map((f) => f.nombre)).igualA(['Aon Aon', 'Aon Ashe', 'Aon Ien'])",
          ),
        },
        {
          nombre: "el índice está y se usa",
          codigo: codigo(
            "esperar(plan('SELECT nombre FROM puestos WHERE gremio_id = 1').join(' | ')).contiene('idx_puestos_gremio')",
          ),
        },
        {
          nombre: "y el cerrado sale igual: el índice no filtra, solo busca",
          codigo: codigo(
            "// `Aon Ashe` está cerrado y es de los escribas, así que sale: la consulta no",
            "// pedía los abiertos. Un índice no cambia lo que devuelve una consulta.",
            "esperar(filas).tieneLongitud(3)",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Dos órdenes separadas por punto y coma. La primera crea el índice, la segunda es un `SELECT` de los de Kae.", 0),
    pista("`CREATE INDEX nombre ON tabla(columna)`. El nombre lo pones tú, y la costumbre es que diga de qué es: tabla y columna.", 1),
    pista("Y la comprobación que importa no es que el índice exista: es que la base lo **use**. Eso solo se sabe poniendo `EXPLAIN QUERY PLAN` delante de la consulta y leyendo si dice `SCAN` o `SEARCH`. Un índice que nadie usa es trabajo de más a cambio de nada.", 2),
  ],
  recompensa: { croquetas: 11 },
}
