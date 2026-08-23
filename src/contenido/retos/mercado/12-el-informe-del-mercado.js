import { codigo } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "mercado-12-el-informe-del-mercado",
  mundo: "mercado",
  entorno: "sql",
  tipo: "codigo",
  jefe: true,
  titulo: "Jefe: el informe del mercado",
  enunciado: codigo(
    "Aquí no hay pistas. Todo lo que hace falta lo has visto en los once retos de antes.",
    "",
    "El consejo quiere el cierre del mercado **por gremios**, y quiere que salgan **todos los",
    "gremios**, incluidos los que no han vendido nada. Cinco columnas, con estos nombres exactos",
    "y en este orden:",
    "",
    "- `gremio` — el nombre del gremio.",
    "- `puestos` — cuántos puestos suyos han vendido algo. Cero si ninguno.",
    "- `ventas` — cuántas ventas entre todos. Cero si ninguna.",
    "- `total` — lo que recaudaron. Cero si nada.",
    "- `mejor` — la venta más alta de sus puestos. Cero si no hay ninguna.",
    "",
    "Solo se cuentan las ventas de **40 monedas o más**: las de menos no se registran.",
    "",
    "Ordenado por lo recaudado de mayor a menor y, cuando empaten, por el nombre del gremio.",
    "",
    "Tres cosas que se comprueban, y las tres han tenido su reto:",
    "",
    "- **Ningún gremio se pierde**, ni el que no tiene puestos.",
    "- **Ningún cero es un uno**, ni ningún cero es un hueco.",
    "- **El tenderete no es un gremio.** No pertenece a ninguno, así que sus monedas no suman",
    "  en ninguna fila y su nulo no puede salir como si fuera un gremio más.",
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
    "  COUNT(v.id) AS ventas,",
    "  COALESCE(SUM(v.monedas), 0) AS total,",
    "  COALESCE(MAX(v.monedas), 0) AS mejor",
    "FROM gremios AS g",
    "LEFT JOIN puestos AS p ON p.gremio_id = g.id",
    "LEFT JOIN ventas AS v ON v.puesto_id = p.id AND v.monedas >= 40",
    "GROUP BY g.id",
    "ORDER BY total DESC, gremio ASC;",
  ),
  requisitos: [
    { tipo: "alMenos", valor: "LEFT JOIN", veces: 2, texto: "Dos uniones, y ninguna puede perder un gremio: `LEFT JOIN` las dos" },
    { tipo: "usaPalabra", valor: "GROUP BY", texto: "Agrupa con `GROUP BY`" },
    { tipo: "usaPalabra", valor: "COALESCE", texto: "Los huecos se rellenan con `COALESCE`" },
    { tipo: "usaPalabra", valor: "DISTINCT", texto: "Contar puestos después de unir con las ventas necesita `DISTINCT`" },
    { tipo: "usaPalabra", valor: "MAX", texto: "La venta más alta, con `MAX`" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas: aquí `COUNT(*)` además cuenta mal" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta" },
    { tipo: "usaPalabra", valor: "ORDER BY", texto: "Ordena con `ORDER BY`" },
  ],
  tests: [
    {
      nombre: "las cinco columnas, con sus nombres y en su orden",
      codigo: "esperar(columnas, 'las columnas').igualA(['gremio', 'puestos', 'ventas', 'total', 'mejor'])",
    },
    {
      nombre: "los seis gremios, ninguno perdido",
      codigo: "esperar(filas, 'las filas').tieneLongitud(6)",
    },
    {
      nombre: "el orden: por total y, empatados, por nombre",
      codigo: codigo(
        "esperar(filas.map((f) => f.gremio), 'los gremios')",
        "  .igualA(['comercio', 'cocineros', 'escribas', 'herreros', 'canteros', 'aones'])",
      ),
    },
    {
      nombre: "el gremio de los aones sale con todo a cero",
      codigo: codigo(
        "const aones = filas.find((f) => f.gremio === 'aones')",
        "esperar(aones, 'la fila de los aones').existe()",
        "esperar([aones.puestos, aones.ventas, aones.total, aones.mejor], 'sus cuatro cifras').igualA([0, 0, 0, 0])",
      ),
    },
    {
      nombre: "los escribas: tres puestos, y solo cuatro ventas registradas de las siete",
      codigo: codigo(
        "// Las tres ventas de Aon Ashe son de 35 monedas y no se registran. El puesto",
        "// sí cuenta -existe y es suyo- y sus ventas no.",
        "const escribas = filas.find((f) => f.gremio === 'escribas')",
        "esperar(escribas.puestos, 'sus puestos').igualA(3)",
        "esperar(escribas.ventas, 'sus ventas registradas').igualA(4)",
        "esperar(escribas.total, 'su total').igualA(200)",
      ),
    },
    {
      nombre: "los canteros tienen dos puestos y una sola venta",
      codigo: codigo(
        "const canteros = filas.find((f) => f.gremio === 'canteros')",
        "esperar(canteros.puestos, 'sus puestos').igualA(2)",
        "esperar(canteros.ventas, 'sus ventas').igualA(1)",
        "esperar(canteros.total, 'su total').igualA(95)",
        "esperar(canteros.mejor, 'su mejor venta').igualA(95)",
      ),
    },
    {
      nombre: "la mejor venta de comercio son las 200 monedas del lunes",
      codigo: "esperar(filas.find((f) => f.gremio === 'comercio').mejor, 'la mejor de comercio').igualA(200)",
    },
    {
      nombre: "ni un nulo en todo el informe",
      codigo: codigo(
        "const conNulos = filas.filter((f) => Object.values(f).some((valor) => valor === null))",
        "esperar(conNulos.map((f) => f.gremio), 'las filas con algún nulo').igualA([])",
      ),
    },
    {
      nombre: "el tenderete no sale como si fuera un gremio",
      codigo: codigo(
        "// Sus 165 monedas no pertenecen a ninguno, así que no están en el informe. Un",
        "// séptimo grupo con el nombre a nulo sería un gremio inventado.",
        "esperar(filas.map((f) => f.gremio), 'los gremios').noContiene(null)",
        "esperar(filas.reduce((s, f) => s + f.total, 0), 'lo que suma el informe').igualA(1005)",
      ),
    },
    {
      nombre: "y las tablas siguen intactas",
      codigo: codigo(
        "esperar(cuantas('ventas'), 'las ventas').igualA(16)",
        "esperar(cuantas('puestos'), 'los puestos').igualA(9)",
      ),
    },
  ],
  variantes: [
    {
      titulo: "El informe del mercado · otro mercado",
      datos: codigo(
        'INSERT INTO gremios (id, nombre, maestro) VALUES',
        "  (1, 'escribas', 'Adien'), (2, 'canteros', 'Karata'), (3, 'cocineros', NULL),",
        "  (4, 'herreros', 'Saolin'), (5, 'comercio', 'Roial'), (6, 'aones', 'Raoden');",
        '',
        'INSERT INTO puestos (id, nombre, gremio_id) VALUES',
        "  (1, 'Aon Aon', 6), (2, 'La piedra', 2), (3, 'El caldero', 3),",
        "  (4, 'Aon Ien', 6), (5, 'El yunque', 4), (6, 'Los dos ríos', 5),",
        "  (7, 'Aon Ashe', 6), (8, 'La muralla', 2), (9, 'El tenderete', NULL);",
        '',
        'INSERT INTO ventas (id, puesto_id, dia, monedas) VALUES',
        "  (1, 1, 'lunes', 30), (2, 4, 'lunes', 30), (3, 7, 'lunes', 30),",
        "  (4, 2, 'lunes', 250), (5, 8, 'martes', 50),",
        "  (6, 5, 'lunes', 90), (7, 5, 'martes', 110),",
        "  (8, 9, 'lunes', 400);",
      ),
      tests: [
        {
          nombre: "las cinco columnas",
          codigo: "esperar(columnas).igualA(['gremio', 'puestos', 'ventas', 'total', 'mejor'])",
        },
        { nombre: "los seis gremios", codigo: "esperar(filas).tieneLongitud(6)" },
        {
          nombre: "los aones tienen tres puestos y ninguna venta registrada: todas eran de 30",
          codigo: codigo(
            "const aones = filas.find((f) => f.gremio === 'aones')",
            "esperar(aones.puestos, 'sus puestos').igualA(3)",
            "esperar(aones.ventas, 'sus ventas').igualA(0)",
            "esperar(aones.total, 'su total').igualA(0)",
            "esperar(aones.mejor, 'su mejor').igualA(0)",
          ),
        },
        {
          nombre: "los canteros van primero, con 300 entre sus dos puestos",
          codigo: codigo(
            "esperar(filas[0].gremio).igualA('canteros')",
            "esperar(filas[0].total).igualA(300)",
            "esperar(filas[0].mejor).igualA(250)",
          ),
        },
        {
          nombre: "y los cuatro gremios a cero se ordenan por nombre",
          codigo: codigo(
            "// Cuatro y no tres: los aones tienen tres puestos y ninguna venta que",
            "// llegue al mínimo, los cocineros y comercio no vendieron nada, y los",
            "// escribas no tienen ni un puesto. Cuatro maneras de valer cero.",
            "const aCero = filas.filter((f) => f.total === 0).map((f) => f.gremio)",
            "esperar(aCero).igualA(['aones', 'cocineros', 'comercio', 'escribas'])",
          ),
        },
      ],
    },
  ],
  recompensa: { croquetas: 14 },
}
