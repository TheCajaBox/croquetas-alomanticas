import { codigo, pista } from '../comun.js'
import { TRAZOS } from '../tablas-de-elantris.js'

export default {
  id: "trazos-05-cerrar-un-puesto",
  mundo: "trazos",
  entorno: "sql",
  tipo: "codigo",
  titulo: "Cerrar un puesto, y solo uno",
  enunciado: codigo(
    "El gremio de los canteros ha decidido cerrar `La muralla`, que no vende nada.",
    "",
    "Escribe el `UPDATE` que le pone `abierto` a 0. **Solo a ese puesto.**",
    "",
    "```sql",
    "UPDATE tabla SET columna = valor WHERE condicion;",
    "```",
    "",
    "Filtra por el `id`, que es lo que identifica una fila y no se repite. Filtrar por el",
    "nombre funcionaría aquí -la columna es `UNIQUE`- y es una costumbre peor: el día que dos",
    "cosas se llamen parecido, un `UPDATE` por nombre toca lo que no debe.",
    "",
    "Y la norma de la casa, que está puesta como requisito: **una sola orden**. La costumbre",
    "de mirar antes con un `SELECT` es buena y se hace **fuera** del envío.",
  ),
  esquema: TRAZOS.esquema,
  datos: TRAZOS.datos,
  inicial: codigo(
    "-- Antes de escribir esto, pruébalo como SELECT y mira cuántas filas salen.",
    "UPDATE puestos SET ",
  ),
  solucion: "UPDATE puestos SET abierto = 0 WHERE id = 5;",
  requisitos: [
    { tipo: "usaPalabra", valor: "UPDATE", texto: "Cambia la fila con `UPDATE`" },
    { tipo: "usaPalabra", valor: "WHERE", texto: "Y ponle un `WHERE`: sin él cambia todas" },
    { tipo: "unaSolaConsulta", texto: "Una sola orden" },
  ],
  tests: [
    {
      nombre: "La muralla queda cerrada",
      codigo: "esperar(consulta(\"SELECT abierto FROM puestos WHERE nombre = 'La muralla'\")[0].abierto, 'su abierto').igualA(0)",
    },
    {
      nombre: "y solo hay dos puestos cerrados: ese y el que ya lo estaba",
      codigo: codigo(
        "const cerrados = consulta('SELECT nombre FROM puestos WHERE abierto = 0 ORDER BY id').map((f) => f.nombre)",
        "esperar(cerrados, 'los cerrados').igualA(['Aon Ien', 'La muralla'])",
      ),
    },
    {
      nombre: "los otros cuatro siguen abiertos",
      codigo: "esperar(consulta('SELECT COUNT(*) AS n FROM puestos WHERE abierto = 1')[0].n, 'los abiertos').igualA(4)",
    },
    {
      nombre: "sigue habiendo seis puestos: un UPDATE no borra ni añade",
      codigo: "esperar(cuantas('puestos'), 'los puestos').igualA(6)",
    },
    {
      nombre: "no se ha tocado ninguna otra columna",
      codigo: codigo(
        "const muralla = consulta(\"SELECT nombre, gremio_id FROM puestos WHERE id = 5\")[0]",
        "esperar(muralla, 'la fila entera').igualA({ nombre: 'La muralla', gremio_id: 2 })",
      ),
    },
    {
      nombre: "y las ventas están intactas",
      codigo: "esperar(cuantas('ventas'), 'las ventas').igualA(6)",
    },
  ],
  variantes: [
    {
      titulo: "Cerrar un puesto · otra tanda",
      datos: codigo(
        'INSERT INTO gremios (id, nombre) VALUES',
        "  (1, 'escribas'), (2, 'canteros'), (3, 'cocineros'), (4, 'aones');",
        '',
        'INSERT INTO puestos (id, nombre, gremio_id, abierto) VALUES',
        "  (1, 'Aon Aon',      1, 1),",
        "  (2, 'La piedra',    2, 1),",
        "  (3, 'El caldero',   3, 1),",
        "  (4, 'Aon Ien',      1, 1),",
        "  (5, 'La muralla',   2, 1),",
        "  (6, 'El tenderete', NULL, 1),",
        "  (7, 'Aon Ashe',     1, 0);",
        '',
        'INSERT INTO ventas (id, puesto_id, dia, monedas) VALUES',
        "  (1, 1, 'lunes', 10), (2, 5, 'lunes', 20);",
      ),
      tests: [
        {
          nombre: "La muralla queda cerrada",
          codigo: "esperar(consulta('SELECT abierto FROM puestos WHERE id = 5')[0].abierto).igualA(0)",
        },
        {
          nombre: "y los cerrados son esos dos",
          codigo: codigo(
            "esperar(consulta('SELECT nombre FROM puestos WHERE abierto = 0 ORDER BY id').map((f) => f.nombre))",
            "  .igualA(['La muralla', 'Aon Ashe'])",
          ),
        },
        { nombre: "siguen siendo siete puestos", codigo: "esperar(cuantas('puestos')).igualA(7)" },
        {
          nombre: "cinco abiertos",
          codigo: "esperar(consulta('SELECT COUNT(*) AS n FROM puestos WHERE abierto = 1')[0].n).igualA(5)",
        },
      ],
    },
  ],
  pistas: [
    pista("`UPDATE`, la tabla, `SET` la columna igual al valor nuevo, y `WHERE` la condición.", 0),
    pista("La condición identifica una fila. Mira en la tabla de abajo qué `id` tiene La muralla.", 1),
    pista("Y una costumbre que merece más que este reto: antes de ejecutar cualquier `UPDATE` o `DELETE`, escribe la misma condición en un `SELECT` y **cuenta las filas**. Si salen más de las que esperabas, acabas de ahorrarte un disgusto que no se deshace.", 2),
  ],
  recompensa: { croquetas: 8 },
}
