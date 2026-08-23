import { codigo } from '../comun.js'
import { MUROS } from '../tablas-de-elantris.js'

export default {
  id: "muros-12-el-censo-del-mercado",
  mundo: "muros",
  entorno: "sql",
  tipo: "codigo",
  jefe: true,
  titulo: "Jefe: el censo del mercado",
  enunciado: codigo(
    "Aquí no hay pistas. Todo lo que hace falta lo has visto en los once retos de antes.",
    "",
    "El consejo quiere un censo del mercado: **todos los puestos**, tengan gremio o no, con el",
    "gremio al que pertenecen y quién lo dirige. Cuatro columnas, con estos nombres exactos y",
    "en este orden:",
    "",
    "- `puesto` — el nombre del puesto.",
    "- `gremio` — el nombre de su gremio, o nulo si no tiene.",
    "- `maestro` — el maestro de ese gremio, o nulo.",
    "- `monedas` — lo que recaudó.",
    "",
    "Solo los puestos que hayan recaudado más de 50 monedas. Ordenados por lo que recaudan, de",
    "mayor a menor.",
    "",
    "Y una cosa que se comprueba: **no se puede perder ningún puesto** por no tener gremio. Si",
    "el censo dice que hay siete puestos y hay ocho, el censo está mal.",
  ),
  esquema: MUROS.esquema,
  datos: MUROS.datos,
  inicial: codigo(
    "SELECT",
    "FROM puestos AS p",
  ),
  solucion: codigo(
    "SELECT p.nombre AS puesto, g.nombre AS gremio, g.maestro AS maestro, p.monedas AS monedas",
    "FROM puestos AS p",
    "LEFT JOIN gremios AS g ON p.gremio_id = g.id",
    "WHERE p.monedas > 50",
    "ORDER BY p.monedas DESC;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "LEFT JOIN", texto: "No se puede perder ningún puesto: `LEFT JOIN`" },
    { tipo: "usaPalabra", valor: "ON", texto: "Y su `ON`, que dice por dónde se unen" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas: nada de `SELECT *`" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta, no dos" },
    { tipo: "alMenos", valor: "AS", veces: 6, texto: "Las cuatro columnas y las dos tablas llevan alias" },
    { tipo: "usaPalabra", valor: "ORDER BY", texto: "Ordena con `ORDER BY`" },
  ],
  tests: [
    {
      nombre: "las cuatro columnas, con sus nombres y en su orden",
      codigo: "esperar(columnas, 'las columnas').igualA(['puesto', 'gremio', 'maestro', 'monedas'])",
    },
    {
      nombre: "ocho filas: los que pasan de cincuenta, y el sin gremio entre ellos",
      codigo: "esperar(filas, 'las filas').tieneLongitud(8)",
    },
    {
      nombre: "de mayor a menor",
      codigo: codigo(
        "esperar(filas.map((f) => f.monedas), 'las monedas').igualA([320, 210, 180, 165, 140, 105, 95, 60])",
      ),
    },
    {
      nombre: "La muralla recaudó 45 y se queda fuera: el filtro es «más de 50»",
      codigo: "esperar(filas.map((f) => f.puesto), 'los puestos').noContiene('La muralla')",
    },
    {
      nombre: "y el tenderete, que no tiene gremio, sí está: con gremio y maestro a nulo",
      codigo: codigo(
        "// Aquí está la mitad del reto. Con un `JOIN` normal esta fila desaparece y",
        "// la consulta devuelve siete: un censo que se deja fuera justo el puesto",
        "// por el que se pidió el censo.",
        "const tenderete = filas.find((f) => f.puesto === 'El tenderete')",
        "esperar(tenderete, 'la fila del tenderete').existe()",
        "esperar(tenderete.gremio, 'su gremio').igualA(null)",
        "esperar(tenderete.maestro, 'su maestro').igualA(null)",
      ),
    },
    {
      nombre: "los cocineros salen con el maestro a nulo, y el gremio con su nombre",
      codigo: codigo(
        "const caldero = filas.find((f) => f.puesto === 'El caldero')",
        "esperar(caldero.gremio, 'su gremio').igualA('cocineros')",
        "esperar(caldero.maestro, 'su maestro').igualA(null)",
      ),
    },
    {
      nombre: "cada puesto una sola vez: nada se ha multiplicado",
      codigo: codigo(
        "const nombres = filas.map((f) => f.puesto)",
        "esperar(new Set(nombres).size, 'puestos distintos').igualA(nombres.length)",
      ),
    },
    {
      nombre: "y los tres de los escribas están los tres, con su maestro",
      codigo: codigo(
        "const escribas = filas.filter((f) => f.gremio === 'escribas')",
        "esperar(escribas, 'los de escribas').tieneLongitud(3)",
        "esperar(escribas.every((f) => f.maestro === 'Adien'), 'que todos tengan a su maestro').esVerdadero()",
      ),
    },
    {
      nombre: "el filtro es sobre las monedas y no sobre el gremio",
      codigo: codigo(
        "// Con la condición puesta en el `ON` en vez de en el `WHERE`, la consulta",
        "// devuelve las nueve filas: el `LEFT JOIN` salva a los que no emparejan.",
        "// Es el fallo simétrico al del reto ocho y merece su comprobación.",
        "esperar(filas.every((f) => f.monedas > 50), 'que ninguna baje de cincuenta').esVerdadero()",
        "esperar(cuantas('puestos'), 'las filas de la tabla').igualA(9)",
      ),
    },
  ],
  variantes: [
    {
      titulo: "El censo del mercado · otro mercado",
      datos: codigo(
        'INSERT INTO gremios (id, nombre, maestro) VALUES',
        "  (1, 'escribas',  'Adien'),",
        "  (2, 'canteros',  NULL),",
        "  (3, 'cocineros', 'Mareshe'),",
        "  (4, 'herreros',  'Saolin'),",
        "  (5, 'comercio',  'Roial'),",
        "  (6, 'aones',     'Raoden');",
        '',
        'INSERT INTO puestos (id, nombre, gremio_id, monedas) VALUES',
        "  (1, 'Aon Rao',      6,    260),",
        "  (2, 'El cincel',    2,    150),",
        "  (3, 'La brasa',     3,     45),",
        "  (4, 'Aon Dii',      6,    115),",
        "  (5, 'El fuelle',    4,    200),",
        "  (6, 'La balanza',   5,    340),",
        "  (7, 'El tenderete', NULL, 300),",
        "  (8, 'La esquina',   NULL,  20);",
      ),
      tests: [
        {
          nombre: "las cuatro columnas",
          codigo: "esperar(columnas).igualA(['puesto', 'gremio', 'maestro', 'monedas'])",
        },
        { nombre: "seis filas", codigo: "esperar(filas).tieneLongitud(6)" },
        {
          nombre: "aquí el puesto sin gremio es el segundo que más recauda, y no se pierde",
          codigo: codigo(
            "esperar(filas[1].puesto, 'el segundo').igualA('El tenderete')",
            "esperar(filas[1].gremio, 'su gremio').igualA(null)",
            "esperar(filas[1].maestro, 'su maestro').igualA(null)",
          ),
        },
        {
          nombre: "de mayor a menor",
          codigo: "esperar(filas.map((f) => f.monedas)).igualA([340, 300, 260, 200, 150, 115])",
        },
        {
          nombre: "y el cincel sale con gremio y sin maestro",
          codigo: codigo(
            "const cincel = filas.find((f) => f.puesto === 'El cincel')",
            "esperar(cincel.gremio).igualA('canteros')",
            "esperar(cincel.maestro).igualA(null)",
          ),
        },
      ],
    },
  ],
  recompensa: { croquetas: 13 },
}
