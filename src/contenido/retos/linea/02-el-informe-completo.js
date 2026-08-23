import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "linea-02-el-informe-completo",
  mundo: "linea",
  entorno: "sql",
  tipo: "codigo",
  titulo: "El informe de siempre, entero",
  enunciado: codigo(
    "Para empezar, la consulta que has escrito de cinco maneras distintas en cinco mundos, esta",
    "vez de una vez y sin ayuda.",
    "",
    "Devuelve **todos los gremios** con tres columnas: `gremio`, `puestos` -cuántos puestos",
    "suyos, tengan ventas o no- y `total` -lo que recaudaron entre todos, o cero-.",
    "",
    "Ordenado por total de mayor a menor y, empatados, por nombre.",
    "",
    "Nada nuevo. Lo que hay que acordarse es de las tres trampas: la unión que no puede perder",
    "gremios, el `COUNT` que no puede contar filas vacías, y el hueco que hay que decidir.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  inicial: codigo(
    "SELECT",
    "FROM gremios AS g",
  ),
  solucion: codigo(
    "SELECT",
    "  g.nombre AS gremio,",
    "  COUNT(DISTINCT p.id) AS puestos,",
    "  COALESCE(SUM(v.monedas), 0) AS total",
    "FROM gremios AS g",
    "LEFT JOIN puestos AS p ON p.gremio_id = g.id",
    "LEFT JOIN ventas AS v ON v.puesto_id = p.id",
    "GROUP BY g.id",
    "ORDER BY total DESC, gremio ASC;",
  ),
  requisitos: [
    { tipo: "alMenos", valor: "LEFT JOIN", veces: 2, texto: "Dos uniones, y ninguna puede perder un gremio" },
    { tipo: "usaPalabra", valor: "GROUP BY", texto: "Agrupa con `GROUP BY`" },
    { tipo: "usaPalabra", valor: "DISTINCT", texto: "Contar puestos después de unir con las ventas los cuenta una vez por venta" },
    { tipo: "usaPalabra", valor: "COALESCE", texto: "El hueco del total se decide" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta" },
  ],
  tests: [
    { nombre: "las tres columnas", codigo: "esperar(columnas, 'las columnas').igualA(['gremio', 'puestos', 'total'])" },
    { nombre: "los seis gremios, ninguno perdido", codigo: "esperar(filas, 'las filas').tieneLongitud(6)" },
    {
      nombre: "en orden por total y, empatados, por nombre",
      codigo: codigo(
        "esperar(filas.map((f) => f.gremio), 'los gremios')",
        "  .igualA(['comercio', 'escribas', 'cocineros', 'herreros', 'canteros', 'aones'])",
      ),
    },
    {
      nombre: "los escribas: tres puestos y 305 monedas",
      codigo: "esperar(filas.find((f) => f.gremio === 'escribas'), 'los escribas').igualA({ gremio: 'escribas', puestos: 3, total: 305 })",
    },
    {
      nombre: "los canteros tienen dos puestos y solo uno ha vendido",
      codigo: "esperar(filas.find((f) => f.gremio === 'canteros'), 'los canteros').igualA({ gremio: 'canteros', puestos: 2, total: 95 })",
    },
    {
      nombre: "el gremio de los aones sale con todo a cero",
      codigo: "esperar(filas.find((f) => f.gremio === 'aones'), 'los aones').igualA({ gremio: 'aones', puestos: 0, total: 0 })",
    },
    {
      nombre: "ni un nulo en el informe",
      codigo: codigo(
        "const conNulos = filas.filter((f) => Object.values(f).some((valor) => valor === null))",
        "esperar(conNulos.map((f) => f.gremio), 'las filas con algún nulo').igualA([])",
      ),
    },
    {
      nombre: "y las 165 del tenderete no son de ningún gremio",
      codigo: "esperar(filas.reduce((s, f) => s + f.total, 0), 'lo que suma el informe').igualA(1110)",
    },
  ],
  variantes: [
    {
      titulo: "El informe de siempre · otra tanda",
      datos: codigo(
        'INSERT INTO gremios (id, nombre, maestro) VALUES',
        "  (1, 'escribas', 'Adien'), (2, 'canteros', 'Karata'), (3, 'cocineros', NULL),",
        "  (4, 'herreros', 'Saolin'), (5, 'comercio', 'Roial'), (6, 'aones', 'Raoden');",
        '',
        'INSERT INTO puestos (id, nombre, gremio_id) VALUES',
        "  (1, 'Aon Aon', 6), (2, 'La piedra', 6), (3, 'El caldero', 3),",
        "  (4, 'Aon Ien', 6), (5, 'El yunque', 4), (6, 'Los dos ríos', 5),",
        "  (7, 'Aon Ashe', 6), (8, 'La muralla', 2), (9, 'El tenderete', NULL);",
        '',
        'INSERT INTO ventas (id, puesto_id, dia, monedas) VALUES',
        "  (1, 1, 'lunes', 100), (2, 2, 'lunes', 100), (3, 4, 'lunes', 100),",
        "  (4, 3, 'lunes', 50),",
        "  (5, 9, 'lunes', 700);",
      ),
      tests: [
        { nombre: "las tres columnas", codigo: "esperar(columnas).igualA(['gremio', 'puestos', 'total'])" },
        { nombre: "los seis gremios", codigo: "esperar(filas).tieneLongitud(6)" },
        {
          nombre: "los aones tienen cuatro puestos y 300 monedas",
          codigo: "esperar(filas[0]).igualA({ gremio: 'aones', puestos: 4, total: 300 })",
        },
        {
          nombre: "los cuatro gremios a cero se ordenan por nombre",
          codigo: codigo(
            "// Cuatro maneras de valer cero: canteros tiene un puesto que no vendió,",
            "// comercio también, herreros lo mismo, y escribas no tiene ni un puesto.",
            "esperar(filas.filter((f) => f.total === 0).map((f) => f.gremio))",
            "  .igualA(['canteros', 'comercio', 'escribas', 'herreros'])",
          ),
        },
        {
          nombre: "y los escribas tienen cero puestos, no cero ventas",
          codigo: "esperar(filas.find((f) => f.gremio === 'escribas').puestos).igualA(0)",
        },
      ],
    },
  ],
  pistas: [
    pista("Cinco cláusulas: `SELECT`, `FROM`, dos uniones, `GROUP BY` y `ORDER BY`. La tabla del `FROM` es la que no puede perder filas.", 0),
    pista("El `DISTINCT` del `COUNT` es lo que evita que un puesto con tres ventas cuente como tres puestos. Sin él, los escribas dirían siete.", 1),
    pista("Y monta la consulta por pasos contando filas: seis gremios después de la primera unión y **seis** después de agrupar. Si en algún paso son cinco, alguna unión no es `LEFT`.", 2),
  ],
  recompensa: { croquetas: 11 },
}
