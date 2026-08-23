import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "mercado-05-el-total-de-cada-puesto",
  mundo: "mercado",
  entorno: "sql",
  tipo: "codigo",
  titulo: "El total de cada puesto, con su nombre",
  enunciado: codigo(
    "Agrupar y unir se llevan bien, y hacen falta juntos casi siempre: los números están en una",
    "tabla y los nombres en otra.",
    "",
    "Escribe una consulta que devuelva, para cada puesto que haya vendido algo, tres columnas:",
    "",
    "- `puesto` — el nombre del puesto.",
    "- `ventas` — cuántas ventas hizo.",
    "- `total` — lo que recaudó en total.",
    "",
    "De más recaudado a menos.",
    "",
    "Agrupa por el `id` del puesto y no por su nombre: dos puestos podrían llamarse igual, y",
    "entonces agrupar por el nombre los juntaría en uno.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  inicial: codigo(
    "SELECT",
    "FROM ventas AS v",
    "JOIN puestos AS p ON v.puesto_id = p.id",
  ),
  solucion: codigo(
    "SELECT p.nombre AS puesto, COUNT(*) AS ventas, SUM(v.monedas) AS total",
    "FROM ventas AS v",
    "JOIN puestos AS p ON v.puesto_id = p.id",
    "GROUP BY p.id",
    "ORDER BY total DESC;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "GROUP BY", texto: "Agrupa con `GROUP BY`" },
    { tipo: "usaPalabra", valor: "SUM", texto: "Suma con `SUM`" },
    { tipo: "usaPalabra", valor: "COUNT", texto: "Y cuenta con `COUNT`" },
    { tipo: "usaPalabra", valor: "JOIN", texto: "El nombre está en la otra tabla: hay que unir" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas del `SELECT`" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta" },
  ],
  tests: [
    { nombre: "las tres columnas", codigo: "esperar(columnas, 'las columnas').igualA(['puesto', 'ventas', 'total'])" },
    { nombre: "ocho filas: los puestos con ventas", codigo: "esperar(filas, 'las filas').tieneLongitud(8)" },
    {
      nombre: "Los dos ríos es el que más recauda",
      codigo: "esperar(filas[0], 'la primera').igualA({ puesto: 'Los dos ríos', ventas: 2, total: 320 })",
    },
    {
      nombre: "y los totales, de mayor a menor",
      codigo: "esperar(filas.map((f) => f.total), 'los totales').igualA([320, 210, 180, 165, 140, 105, 95, 60])",
    },
    {
      nombre: "Aon Aon hizo tres ventas de 140 en total",
      codigo: "esperar(filas.find((f) => f.puesto === 'Aon Aon'), 'Aon Aon').igualA({ puesto: 'Aon Aon', ventas: 3, total: 140 })",
    },
    {
      nombre: "La muralla no está: no ha vendido nada",
      codigo: codigo(
        "// Y esa es la trampa del reto once: con un `JOIN` normal, un puesto sin",
        "// ventas no aparece en ningún montón, así que desaparece del informe.",
        "esperar(filas.map((f) => f.puesto), 'los puestos').noContiene('La muralla')",
      ),
    },
    {
      nombre: "los totales suman las 1.275 monedas del mercado",
      codigo: "esperar(filas.reduce((s, f) => s + f.total, 0), 'la suma de los totales').igualA(1275)",
    },
  ],
  variantes: [
    {
      titulo: "El total de cada puesto · otra tanda",
      datos: codigo(
        'INSERT INTO gremios (id, nombre, maestro) VALUES',
        "  (1, 'escribas', 'Adien'), (2, 'canteros', 'Karata'), (3, 'cocineros', NULL),",
        "  (4, 'herreros', 'Saolin'), (5, 'comercio', 'Roial'), (6, 'aones', 'Raoden');",
        '',
        'INSERT INTO puestos (id, nombre, gremio_id) VALUES',
        "  (1, 'Aon Aon', 1), (2, 'La piedra', 2), (3, 'El caldero', 3),",
        "  (4, 'Aon Ien', 1), (5, 'El yunque', 4), (6, 'Los dos ríos', 5),",
        "  (7, 'Aon Ashe', 1), (8, 'La muralla', 2), (9, 'El tenderete', NULL);",
        '',
        'INSERT INTO ventas (id, puesto_id, dia, monedas) VALUES',
        "  (1, 8, 'lunes', 200), (2, 8, 'martes', 200), (3, 8, 'miércoles', 100),",
        "  (4, 2, 'lunes', 150), (5, 2, 'martes', 150),",
        "  (6, 5, 'lunes', 90),",
        "  (7, 9, 'lunes', 45), (8, 9, 'martes', 45);",
      ),
      tests: [
        { nombre: "las tres columnas", codigo: "esperar(columnas).igualA(['puesto', 'ventas', 'total'])" },
        { nombre: "cuatro puestos han vendido", codigo: "esperar(filas).tieneLongitud(4)" },
        {
          nombre: "aquí La muralla es la que más recauda, con tres ventas",
          codigo: "esperar(filas[0]).igualA({ puesto: 'La muralla', ventas: 3, total: 500 })",
        },
        {
          nombre: "y los totales de mayor a menor",
          codigo: "esperar(filas.map((f) => f.total)).igualA([500, 300, 90, 90])",
        },
        {
          nombre: "Aon Aon ahora es el que no ha vendido, y no sale",
          codigo: "esperar(filas.map((f) => f.puesto)).noContiene('Aon Aon')",
        },
      ],
    },
  ],
  pistas: [
    pista("La unión ya está escrita en el código de partida. Falta el `SELECT`, el `GROUP BY` y el orden.", 0),
    pista("En el `SELECT` de una consulta agrupada solo pueden ir dos clases de cosas: columnas por las que agrupas, y agregados. Cualquier otra columna no tiene una respuesta única dentro del montón.", 1),
    pista("Agrupa por `p.id`. Aunque en el `SELECT` pidas `p.nombre`, agrupar por el identificador es lo correcto: el nombre depende del id, así que dentro de cada montón el nombre es siempre el mismo y la base lo acepta.", 2),
  ],
  recompensa: { croquetas: 9 },
}
