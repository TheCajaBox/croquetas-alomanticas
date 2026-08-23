import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "mercado-11-el-que-no-vendio-nada",
  mundo: "mercado",
  entorno: "sql",
  tipo: "codigo",
  titulo: "El que no vendió nada",
  enunciado: codigo(
    "Todos los informes de este mundo se han dejado fuera a `La muralla`, y es el puesto que más",
    "le interesa al consejo: es el que no ha vendido nada.",
    "",
    "Agrupar la tabla de ventas nunca va a sacarlo, porque de ese puesto no hay ni una fila que",
    "meter en un montón. Hay que empezar por `puestos` y unir hacia las ventas sin perder a",
    "nadie.",
    "",
    "Escribe una consulta que devuelva **los nueve puestos** con tres columnas:",
    "",
    "- `puesto` — el nombre.",
    "- `ventas` — cuántas ventas hizo. Cero si no hizo ninguna, y **cero de verdad**.",
    "- `media` — la media de sus ventas, redondeada a un decimal, o `0` si no vendió nada.",
    "",
    "Ordenadas por número de ventas de mayor a menor y, cuando empaten, por nombre.",
    "",
    "Dos avisos, que son el reto entero: `COUNT(*)` va a contar uno donde hay cero, y `AVG` y",
    "`SUM` van a devolver nulo en vez de cero. Lo primero es un número falso; lo segundo es un",
    "hueco honrado que hay que rellenar a mano con `COALESCE(algo, 0)`. Y para redondear,",
    "`ROUND(numero, 1)`.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  inicial: codigo(
    "SELECT",
    "FROM puestos AS p",
    "-- Sin perder ningún puesto.",
  ),
  solucion: codigo(
    "SELECT",
    "  p.nombre AS puesto,",
    "  COUNT(v.id) AS ventas,",
    "  COALESCE(ROUND(AVG(v.monedas), 1), 0) AS media",
    "FROM puestos AS p",
    "LEFT JOIN ventas AS v ON v.puesto_id = p.id",
    "GROUP BY p.id",
    "ORDER BY ventas DESC, puesto ASC;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "LEFT JOIN", texto: "No se puede perder ningún puesto: `LEFT JOIN`" },
    { tipo: "usaPalabra", valor: "GROUP BY", texto: "Agrupa con `GROUP BY`" },
    { tipo: "usaPalabra", valor: "AVG", texto: "La media, con `AVG`" },
    { tipo: "usaPalabra", valor: "COALESCE", texto: "Y el hueco de la media, tapado con `COALESCE`" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas del `SELECT`: aquí `COUNT(*)` además cuenta mal" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta" },
  ],
  tests: [
    { nombre: "las tres columnas", codigo: "esperar(columnas, 'las columnas').igualA(['puesto', 'ventas', 'media'])" },
    { nombre: "los nueve puestos, ninguno perdido", codigo: "esperar(filas, 'las filas').tieneLongitud(9)" },
    {
      nombre: "La muralla sale con cero ventas y media cero",
      codigo: codigo(
        "const muralla = filas.find((f) => f.puesto === 'La muralla')",
        "esperar(muralla, 'la fila de La muralla').existe()",
        "esperar(muralla.ventas, 'sus ventas').igualA(0)",
        "esperar(muralla.media, 'su media').igualA(0)",
      ),
    },
    {
      nombre: "y va última, que es lo que dice el orden",
      codigo: "esperar(filas.at(-1).puesto, 'el último').igualA('La muralla')",
    },
    {
      nombre: "los dos de tres ventas van primero, por nombre entre ellos",
      codigo: "esperar(filas.slice(0, 2).map((f) => f.puesto), 'los primeros').igualA(['Aon Aon', 'Aon Ashe'])",
    },
    {
      nombre: "la media de Aon Aon son 46,7 monedas: 140 entre 3, redondeado",
      codigo: "esperar(filas.find((f) => f.puesto === 'Aon Aon').media, 'la media de Aon Aon').igualA(46.7)",
    },
    {
      nombre: "y la de Aon Ashe es exacta, porque sus tres ventas son iguales",
      codigo: "esperar(filas.find((f) => f.puesto === 'Aon Ashe').media, 'la media de Aon Ashe').igualA(35)",
    },
    {
      nombre: "ninguna media es nula",
      codigo: codigo(
        "// Sin el `COALESCE`, La muralla sale con la media a nulo. No es falso, pero un",
        "// informe con un hueco donde debería haber un cero se lee mal y se copia peor.",
        "esperar(filas.every((f) => f.media !== null), 'que ninguna media sea nula').esVerdadero()",
      ),
    },
    {
      nombre: "las ventas suman dieciséis",
      codigo: "esperar(filas.reduce((s, f) => s + f.ventas, 0), 'las ventas contadas').igualA(16)",
    },
  ],
  variantes: [
    {
      titulo: "El que no vendió nada · otra tanda",
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
        "  (1, 3, 'lunes', 10), (2, 3, 'lunes', 20),",
        "  (3, 6, 'lunes', 100);",
      ),
      tests: [
        { nombre: "los nueve puestos siguen saliendo", codigo: "esperar(filas).tieneLongitud(9)" },
        {
          nombre: "siete de ellos con cero ventas y media cero",
          codigo: codigo(
            "const vacios = filas.filter((f) => f.ventas === 0)",
            "esperar(vacios).tieneLongitud(7)",
            "esperar(vacios.every((f) => f.media === 0), 'que todas las medias sean cero').esVerdadero()",
          ),
        },
        {
          nombre: "El caldero hizo dos ventas y su media es 15",
          codigo: "esperar(filas[0]).igualA({ puesto: 'El caldero', ventas: 2, media: 15 })",
        },
        {
          nombre: "y los siete vacíos van ordenados por nombre al final",
          codigo: "esperar(filas.slice(2).map((f) => f.puesto)[0]).igualA('Aon Aon')",
        },
      ],
    },
  ],
  pistas: [
    pista("La tabla del `FROM` es la que no se pierde, así que empieza por `puestos`. Y la unión tiene que salvar a los que no encuentran ventas.", 0),
    pista("`COUNT(*)` cuenta filas, y el montón de un puesto sin ventas tiene una fila -la que fabricó el `LEFT JOIN`, con todo a nulo-. Cuenta una columna que solo tenga valor cuando haya venta de verdad.", 1),
    pista("`AVG` se salta los nulos, así que en ese montón no promedia nada y devuelve nulo. `COALESCE(valor, 0)` devuelve el primero que no sea nulo, y `ROUND` va por dentro: primero se redondea el número y después se tapa el hueco.", 2),
  ],
  recompensa: { croquetas: 11 },
}
