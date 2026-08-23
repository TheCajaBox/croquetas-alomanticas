import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "dor-11-el-acumulado-del-dia",
  mundo: "dor",
  entorno: "sql",
  tipo: "codigo",
  titulo: "El acumulado del día",
  enunciado: codigo(
    "Las funciones de ventana no solo numeran: cualquier agregado puede llevar un `OVER`, y",
    "entonces en vez de resumir el montón, **acompaña a cada fila**.",
    "",
    "```sql",
    "SUM(monedas) OVER (ORDER BY id) -- la suma de esta fila y todas las anteriores",
    "```",
    "",
    "Eso es un acumulado, y con un `ORDER BY` dentro del `OVER` sale gratis: la ventana va",
    "creciendo fila a fila.",
    "",
    "Escribe una consulta que devuelva **las dieciséis ventas** con cuatro columnas:",
    "",
    "- `dia` — el día.",
    "- `monedas` — lo que se hizo en esa venta.",
    "- `acumulado` — lo que llevaba el mercado hasta esa venta incluida, contando desde la",
    "  primera de todas.",
    "- `del_dia` — lo mismo pero contando solo dentro de su día: **se reinicia cada día**.",
    "",
    "En el orden de la tabla, es decir por `id`.",
    "",
    "El acumulado general y el del día se diferencian en una sola cosa dentro del `OVER`.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  inicial: codigo(
    "SELECT",
    "  dia,",
    "  monedas",
    "FROM ventas",
    "ORDER BY id ASC;",
  ),
  solucion: codigo(
    "SELECT",
    "  dia,",
    "  monedas,",
    "  SUM(monedas) OVER (ORDER BY id) AS acumulado,",
    "  SUM(monedas) OVER (PARTITION BY dia ORDER BY id) AS del_dia",
    "FROM ventas",
    "ORDER BY id ASC;",
  ),
  requisitos: [
    { tipo: "alMenos", valor: "OVER", veces: 2, texto: "Dos ventanas: la general y la del día" },
    { tipo: "usaPalabra", valor: "PARTITION BY", texto: "El acumulado del día se reinicia: eso es un `PARTITION BY`" },
    { tipo: "prohibePalabra", valor: "GROUP BY", texto: "Aquí no se agrupa: salen las dieciséis ventas" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta" },
  ],
  tests: [
    {
      nombre: "las cuatro columnas",
      codigo: "esperar(columnas, 'las columnas').igualA(['dia', 'monedas', 'acumulado', 'del_dia'])",
    },
    { nombre: "las dieciséis ventas: no se agrupa nada", codigo: "esperar(filas, 'las filas').tieneLongitud(16)" },
    {
      nombre: "el acumulado general empieza por la primera venta y acaba en el total",
      codigo: codigo(
        "esperar(filas[0].acumulado, 'el primero').igualA(40)",
        "esperar(filas.at(-1).acumulado, 'el último').igualA(1275)",
      ),
    },
    {
      nombre: "y crece siempre, porque no hay ventas negativas",
      codigo: codigo(
        "const crece = filas.every((f, i) => i === 0 || f.acumulado >= filas[i - 1].acumulado)",
        "esperar(crece, 'que el acumulado no baje nunca').esVerdadero()",
      ),
    },
    {
      nombre: "el del día se reinicia: la primera venta de cada día vale lo que ella misma",
      codigo: codigo(
        "// El miércoles solo tiene una venta, de 35, así que su acumulado del día es 35",
        "// mientras el general va por 1.110. Es la comprobación que distingue las dos",
        "// ventanas: sin el `PARTITION BY`, las dos columnas serían iguales.",
        "const miercoles = filas.filter((f) => f.dia === 'miércoles')",
        "esperar(miercoles, 'las del miércoles').tieneLongitud(1)",
        "esperar(miercoles[0].del_dia, 'el acumulado del miércoles').igualA(35)",
        "esperar(miercoles[0].acumulado, 'el acumulado general en ese punto').igualA(1110)",
      ),
    },
    {
      nombre: "el último del lunes son las 730 monedas del lunes",
      codigo: codigo(
        "const delLunes = filas.filter((f) => f.dia === 'lunes')",
        "esperar(delLunes.at(-1).del_dia, 'el cierre del lunes').igualA(730)",
        "esperar(delLunes[0].del_dia, 'la primera del lunes').igualA(40)",
      ),
    },
    {
      nombre: "y el cierre de cada día suma el total",
      codigo: codigo(
        "const cierres = ['lunes', 'martes', 'miércoles'].map((d) => filas.filter((f) => f.dia === d).at(-1).del_dia)",
        "esperar(cierres, 'los cierres').igualA([730, 510, 35])",
        "esperar(cierres.reduce((s, n) => s + n, 0), 'lo que suman').igualA(1275)",
      ),
    },
  ],
  variantes: [
    {
      titulo: "El acumulado del día · otra tanda",
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
        "  (1, 1, 'jueves', 10), (2, 2, 'jueves', 20), (3, 3, 'jueves', 30),",
        "  (4, 4, 'viernes', 100), (5, 5, 'viernes', 200);",
      ),
      tests: [
        {
          nombre: "las cuatro columnas",
          codigo: "esperar(columnas).igualA(['dia', 'monedas', 'acumulado', 'del_dia'])",
        },
        { nombre: "cinco ventas", codigo: "esperar(filas).tieneLongitud(5)" },
        {
          nombre: "el acumulado general va 10, 30, 60, 160, 360",
          codigo: "esperar(filas.map((f) => f.acumulado)).igualA([10, 30, 60, 160, 360])",
        },
        {
          nombre: "y el del día se reinicia el viernes",
          codigo: "esperar(filas.map((f) => f.del_dia)).igualA([10, 30, 60, 100, 300])",
        },
      ],
    },
  ],
  pistas: [
    pista("Dos columnas nuevas y las dos son `SUM(monedas) OVER (...)`. Lo que cambia es lo que va dentro del paréntesis.", 0),
    pista("Un `ORDER BY` dentro del `OVER` es lo que convierte una suma en un acumulado: la ventana no es todo el montón, es «desde el principio hasta esta fila».", 1),
    pista("Y para que se reinicie en cada día hace falta lo mismo que en el reto siete: decirle cuáles son los grupos de la ventana. Es la única diferencia entre las dos columnas.", 2),
  ],
  recompensa: { croquetas: 11 },
}
