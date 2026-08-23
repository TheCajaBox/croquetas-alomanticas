import { codigo, pista } from '../comun.js'
import { PUESTOS } from '../tablas-de-elantris.js'

export default {
  id: "kae-08-cada-cosa-en-su-sitio",
  mundo: "kae",
  entorno: "sql",
  tipo: "ordenar",
  titulo: "Cada cosa en su sitio",
  enunciado: codigo(
    "Cambiamos de tabla: los `puestos` del mercado y lo que hizo cada uno el día de mercado.",
    "",
    "Estas cinco líneas son una consulta buena, desordenada. El orden de las cláusulas en SQL",
    "**no se negocia**: si una se sale de sitio, la base no entiende nada. Colócalas con las",
    "flechas y ejecútalo.",
    "",
    "Y si te equivocas, no pasa nada: se ejecuta igual y verás qué dice la base.",
  ),
  esquema: PUESTOS.esquema,
  datos: PUESTOS.datos,
  lineas: [
    "SELECT nombre, monedas",
    "FROM puestos",
    "WHERE gremio <> 'escribas'",
    "ORDER BY monedas DESC",
    "LIMIT 2;",
  ],
  tests: [
    {
      nombre: "salen dos puestos, los que más recaudan sin ser de escribas",
      codigo: codigo(
        "esperar(filas, 'las filas').tieneLongitud(2)",
        "esperar(filas.map((f) => f.nombre), 'los nombres').igualA(['Los dos ríos', 'El caldero'])",
      ),
    },
    {
      nombre: "con las dos columnas pedidas y en su orden",
      codigo: "esperar(columnas, 'las columnas').igualA(['nombre', 'monedas'])",
    },
    {
      nombre: "y de mayor a menor, que es lo que dice el DESC",
      codigo: "esperar(filas[0].monedas > filas[1].monedas, 'que el primero recaude más').esVerdadero()",
    },
  ],
  pistas: [
    pista("Empieza por lo único que puede ir primero. Después de `SELECT` va siempre `FROM`.", 0),
    pista("Después de decir de dónde, se filtra. Después de filtrar, se ordena. Y cortar es siempre lo último, porque no tendría sentido cortar antes de ordenar.", 1),
    pista("`SELECT` → `FROM` → `WHERE` → `ORDER BY` → `LIMIT`. Ese orden exacto, y es el mismo en cualquier consulta que escribas en tu vida.", 2),
  ],
  recompensa: { croquetas: 6 },
}
