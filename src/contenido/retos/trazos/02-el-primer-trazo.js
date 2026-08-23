import { codigo, pista } from '../comun.js'
import { TRAZOS } from '../tablas-de-elantris.js'

export default {
  id: "trazos-02-el-primer-trazo",
  mundo: "trazos",
  entorno: "sql",
  tipo: "codigo",
  titulo: "El primer trazo",
  enunciado: codigo(
    "Ha llegado un puesto nuevo al mercado: se llama `Aon Ashe`, es del gremio de los escribas",
    "-el número 1- y abre hoy.",
    "",
    "Escribe el `INSERT` que lo mete. Nombra las columnas que rellenas:",
    "",
    "```sql",
    "INSERT INTO tabla (columna, columna) VALUES (valor, valor);",
    "```",
    "",
    "No hace falta darle un `id`: la columna es `INTEGER PRIMARY KEY`, así que la base pone el",
    "siguiente. Y tampoco hace falta el `abierto`, que tiene `DEFAULT 1`.",
    "",
    "Los tests comprueban la tabla **después** de tu orden, porque un `INSERT` no devuelve",
    "filas: lo que devuelve es cuántas ha cambiado.",
  ),
  esquema: TRAZOS.esquema,
  datos: TRAZOS.datos,
  inicial: codigo(
    "INSERT INTO puestos ",
  ),
  solucion: "INSERT INTO puestos (nombre, gremio_id) VALUES ('Aon Ashe', 1);",
  requisitos: [
    { tipo: "usaPalabra", valor: "INSERT", texto: "Mete la fila con `INSERT`" },
    { tipo: "prohibeAsterisco", texto: "Nada de asteriscos aquí" },
    { tipo: "unaSolaConsulta", texto: "Una sola orden" },
  ],
  tests: [
    {
      nombre: "ahora hay siete puestos",
      codigo: "esperar(cuantas('puestos'), 'los puestos').igualA(7)",
    },
    {
      nombre: "y el nuevo está, con su gremio",
      codigo: codigo(
        "const nuevo = consulta(\"SELECT nombre, gremio_id, abierto FROM puestos WHERE nombre = 'Aon Ashe'\")",
        "esperar(nuevo, 'las filas que se llaman Aon Ashe').tieneLongitud(1)",
        "esperar(nuevo[0].gremio_id, 'su gremio').igualA(1)",
      ),
    },
    {
      nombre: "abierto, porque la columna tiene valor por omisión",
      codigo: codigo(
        "// Sin decir nada, `abierto` vale 1. Eso lo dice el esquema y es una decisión",
        "// del que hizo la tabla: un puesto nuevo se supone abierto.",
        "esperar(consulta(\"SELECT abierto FROM puestos WHERE nombre = 'Aon Ashe'\")[0].abierto, 'abierto').igualA(1)",
      ),
    },
    {
      nombre: "con un id que la base ha puesto sola",
      codigo: codigo(
        "const suyo = consulta(\"SELECT id FROM puestos WHERE nombre = 'Aon Ashe'\")[0].id",
        "esperar(suyo, 'su id').existe()",
        "esperar(suyo > 6, 'que el id sea nuevo').esVerdadero()",
      ),
    },
    {
      nombre: "y los seis de antes siguen igual",
      codigo: codigo(
        "esperar(consulta('SELECT nombre FROM puestos WHERE id <= 6').map((f) => f.nombre), 'los de antes')",
        "  .igualA(['Aon Aon', 'La piedra', 'El caldero', 'Aon Ien', 'La muralla', 'El tenderete'])",
      ),
    },
    {
      nombre: "los escribas pasan a tener tres puestos",
      codigo: "esperar(consulta('SELECT COUNT(*) AS n FROM puestos WHERE gremio_id = 1')[0].n, 'los de escribas').igualA(3)",
    },
  ],
  variantes: [
    {
      titulo: "El primer trazo · otra tanda",
      // Otro mercado de partida: el mismo `INSERT` mete la misma fila y los
      // números de alrededor son otros.
      datos: codigo(
        'INSERT INTO gremios (id, nombre) VALUES',
        "  (1, 'escribas'), (2, 'canteros'), (3, 'cocineros'), (4, 'aones');",
        '',
        'INSERT INTO puestos (id, nombre, gremio_id, abierto) VALUES',
        "  (1, 'Aon Aon',    1, 1),",
        "  (2, 'Aon Ien',    1, 1),",
        "  (3, 'La piedra',  2, 0);",
        '',
        'INSERT INTO ventas (id, puesto_id, dia, monedas) VALUES',
        "  (1, 1, 'lunes', 50);",
      ),
      tests: [
        { nombre: "ahora hay cuatro puestos", codigo: "esperar(cuantas('puestos')).igualA(4)" },
        {
          nombre: "y Aon Ashe está, del gremio 1 y abierto",
          codigo: codigo(
            "const nuevo = consulta(\"SELECT gremio_id, abierto FROM puestos WHERE nombre = 'Aon Ashe'\")",
            "esperar(nuevo).tieneLongitud(1)",
            "esperar(nuevo[0]).igualA({ gremio_id: 1, abierto: 1 })",
          ),
        },
        {
          nombre: "los escribas pasan de dos a tres",
          codigo: "esperar(consulta('SELECT COUNT(*) AS n FROM puestos WHERE gremio_id = 1')[0].n).igualA(3)",
        },
        {
          nombre: "y no se ha tocado ninguna venta",
          codigo: "esperar(cuantas('ventas')).igualA(1)",
        },
      ],
    },
  ],
  pistas: [
    pista("`INSERT INTO`, el nombre de la tabla, entre paréntesis las columnas, `VALUES` y entre paréntesis los valores en el mismo orden.", 0),
    pista("El nombre es un texto, así que entre comillas simples. El gremio es un número, así que sin comillas.", 1),
    pista("Y no le pongas `id`: la columna es `INTEGER PRIMARY KEY` y la base pone el siguiente número sola. Ponerlo a mano funciona y es la manera de chocar con la clave primaria el día que te equivoques.", 2),
  ],
  recompensa: { croquetas: 7 },
}
