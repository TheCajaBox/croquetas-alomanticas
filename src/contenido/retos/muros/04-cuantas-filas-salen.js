import { codigo, pista } from '../comun.js'
import { MUROS } from '../tablas-de-elantris.js'

export default {
  id: "muros-04-cuantas-filas-salen",
  mundo: "muros",
  entorno: "sql",
  tipo: "prediccion",
  titulo: "Cuántas filas salen de una unión",
  enunciado: codigo(
    "Nueve puestos y seis gremios. La consulta une las dos tablas y pide dos columnas.",
    "",
    "Escribe abajo, tal cual, lo que va a devolver: primero la línea de las columnas y después",
    "una línea por fila, con los valores separados por ` | `. Sin ordenar nada, así que en el",
    "orden en que la base las tenga a mano, que aquí es el de la tabla de la izquierda.",
    "",
    "Piénsalo despacio, que la respuesta no son nueve filas ni son seis.",
  ),
  esquema: MUROS.esquema,
  datos: MUROS.datos,
  codigoMostrado: codigo(
    "SELECT p.nombre AS puesto, g.maestro AS maestro",
    "FROM puestos AS p",
    "JOIN gremios AS g ON p.gremio_id = g.id;",
  ),
  respuestaEsperada: codigo(
    "puesto | maestro",
    "Aon Aon | Adien",
    "La piedra | Karata",
    "El caldero | NULL",
    "Aon Ien | Adien",
    "El yunque | Saolin",
    "Los dos ríos | Roial",
    "Aon Ashe | Adien",
    "La muralla | Karata",
  ),
  tests: [
    {
      nombre: "ocho filas, y el maestro de los cocineros es nulo",
      codigo: codigo(
        "esperar(filas, 'las filas').tieneLongitud(8)",
        "esperar(filas.map((f) => f.puesto), 'los puestos').noContiene('El tenderete')",
        "esperar(filas.find((f) => f.puesto === 'El caldero').maestro, 'el maestro de El caldero').igualA(null)",
      ),
    },
  ],
  pistas: [
    pista("Un `JOIN` con `ON` empareja. Recorre los nueve puestos y pregúntate, para cada uno, si encuentra su gremio.", 0),
    pista("Hay un puesto cuyo `gremio_id` está a nulo. Nulo no es igual a ningún número, ni siquiera a nulo, así que ese puesto no encuentra pareja y **no sale**.", 1),
    pista("Y hay una segunda cosa: el gremio de los cocineros existe y tiene pareja, pero su columna `maestro` está vacía. Esa fila sale, con la columna del maestro a `NULL`. Son dos nulos distintos: uno impide la unión y el otro es un dato que falta.", 2),
  ],
  recompensa: { croquetas: 7 },
}
