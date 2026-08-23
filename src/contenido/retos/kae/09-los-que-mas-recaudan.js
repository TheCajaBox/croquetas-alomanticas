import { codigo, pista } from '../comun.js'
import { PUESTOS } from '../tablas-de-elantris.js'

export default {
  id: "kae-09-los-que-mas-recaudan",
  mundo: "kae",
  entorno: "sql",
  tipo: "codigo",
  titulo: "Los tres que más recaudan",
  enunciado: codigo(
    "«Los tres que más» es una de las preguntas que más veces se hacen en la vida real, y se",
    "responde con dos cláusulas que van siempre juntas: `ORDER BY` para poner las filas en",
    "orden y `LIMIT` para quedarse con las primeras.",
    "",
    "Escribe una consulta sobre `puestos` que devuelva el `nombre` y las `monedas` de los",
    "**tres puestos que más recaudaron**, de mayor a menor.",
    "",
    "`ORDER BY` ordena de menor a mayor si no le dices nada -eso se llama `ASC`-, así que",
    "para el otro sentido hay que pedirlo: `DESC`.",
  ),
  esquema: PUESTOS.esquema,
  datos: PUESTOS.datos,
  inicial: codigo(
    "SELECT nombre, monedas",
    "FROM puestos",
    "-- Ordena, y luego corta.",
  ),
  solucion: codigo(
    "SELECT nombre, monedas",
    "FROM puestos",
    "ORDER BY monedas DESC",
    "LIMIT 3;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "ORDER BY", texto: "Ordena con `ORDER BY`" },
    { tipo: "usaPalabra", valor: "LIMIT", texto: "Y corta con `LIMIT`" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta" },
  ],
  tests: [
    { nombre: "tres filas y no ocho", codigo: "esperar(filas, 'las filas').tieneLongitud(3)" },
    {
      nombre: "los tres que más, en orden",
      codigo: "esperar(filas.map((f) => f.nombre), 'los nombres').igualA(['Los dos ríos', 'El caldero', 'El yunque'])",
    },
    {
      nombre: "y con sus cifras",
      codigo: "esperar(filas.map((f) => f.monedas), 'las monedas').igualA([320, 210, 180])",
    },
    { nombre: "las dos columnas pedidas", codigo: "esperar(columnas).igualA(['nombre', 'monedas'])" },
    {
      nombre: "de mayor a menor y no al revés",
      codigo: codigo(
        "// Con `ASC` en vez de `DESC` saldrían tres filas también, y tres nombres",
        "// creíbles. Es el fallo que más se cuela en este reto.",
        "esperar(filas[0].monedas, 'el primero').igualA(320)",
      ),
    },
    {
      nombre: "el cuarto no ha entrado",
      codigo: "esperar(filas.map((f) => f.nombre)).noContiene('Aon Aon')",
    },
  ],
  variantes: [
    {
      titulo: "Los tres que más · otra tanda",
      // Otro día de mercado: las mismas columnas y otras cifras, así que la
      // consulta buena sigue siendo la misma y el resultado no.
      datos: codigo(
        'INSERT INTO puestos (id, nombre, gremio, monedas) VALUES',
        "  (1, 'Aon Aon',      'escribas',   275),",
        "  (2, 'La piedra',    'canteros',   130),",
        "  (3, 'El caldero',   'cocineros',   90),",
        "  (4, 'Aon Ien',      'escribas',   240),",
        "  (5, 'El yunque',    'herreros',    55),",
        "  (6, 'Los dos ríos', 'comercio',   115),",
        "  (7, 'Aon Ashe',     'escribas',   300),",
        "  (8, 'La muralla',   'canteros',    20);",
      ),
      tests: [
        { nombre: "tres filas", codigo: "esperar(filas).tieneLongitud(3)" },
        {
          nombre: "hoy el mercado es de los escribas",
          codigo: "esperar(filas.map((f) => f.nombre)).igualA(['Aon Ashe', 'Aon Aon', 'Aon Ien'])",
        },
        { nombre: "con sus cifras", codigo: "esperar(filas.map((f) => f.monedas)).igualA([300, 275, 240])" },
      ],
    },
    {
      titulo: "Los tres que más · y otra",
      datos: codigo(
        'INSERT INTO puestos (id, nombre, gremio, monedas) VALUES',
        "  (1, 'Aon Aon',      'escribas',    70),",
        "  (2, 'La piedra',    'canteros',   410),",
        "  (3, 'El caldero',   'cocineros',  155),",
        "  (4, 'Aon Ien',      'escribas',    30),",
        "  (5, 'El yunque',    'herreros',   410),",
        "  (6, 'Los dos ríos', 'comercio',   155),",
        "  (7, 'Aon Ashe',     'escribas',    12),",
        "  (8, 'La muralla',   'canteros',   200);",
      ),
      tests: [
        { nombre: "tres filas", codigo: "esperar(filas).tieneLongitud(3)" },
        {
          nombre: "los dos primeros empatan a 410 y el tercero es la muralla",
          codigo: codigo(
            "esperar(filas.map((f) => f.monedas), 'las monedas').igualA([410, 410, 200])",
            "esperar(filas[2].nombre, 'el tercero').igualA('La muralla')",
          ),
        },
        {
          nombre: "y con un empate arriba, cuál sale primero no lo promete nadie",
          codigo: codigo(
            "// Los dos de 410 pueden salir en cualquier orden: `ORDER BY monedas` solo",
            "// ordena por monedas, y entre iguales la base hace lo que quiere. Por eso",
            "// aquí se comprueba el conjunto y no la posición: pedir lo segundo sería",
            "// escribir un test que un día falla sin que nadie haya tocado nada.",
            "esperar(filas.slice(0, 2).map((f) => f.nombre).sort(), 'los dos de arriba')",
            "  .igualA(['El yunque', 'La piedra'])",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Dos líneas más debajo del `FROM`: una que ordene y otra que corte.", 0),
    pista("`ORDER BY monedas` ordena de menor a mayor. Para el otro sentido, `DESC` detrás.", 1),
    pista("Las dos líneas van en un orden y no en el otro, y el motivo es el de siempre: cortar antes de ordenar dejaría tres puestos cualesquiera. Ordena primero, corta después. Y si dudas de si has puesto bien el sentido, ejecútala sin la línea del corte y mira la fila de arriba: tiene que ser la más grande de la tabla.", 2),
  ],
  recompensa: { croquetas: 8 },
}
