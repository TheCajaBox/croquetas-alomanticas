import { codigo, pista } from '../comun.js'
import { TRAZOS } from '../tablas-de-elantris.js'

export default {
  id: "trazos-03-que-deja-la-orden",
  mundo: "trazos",
  entorno: "sql",
  tipo: "prediccion",
  titulo: "Lo que deja la orden",
  enunciado: codigo(
    "Aquí se predice el **estado de la tabla después**, que es lo que hay que aprender a ver",
    "cuando se escribe en una base.",
    "",
    "Son dos órdenes seguidas y la segunda es un `SELECT` que enseña el resultado. Predice lo",
    "que devuelve ese `SELECT`: la línea de las columnas y una línea por fila, con los valores",
    "separados por ` | `.",
    "",
    "Fíjate en el `WHERE` del `UPDATE` con cuidado. Y acuérdate de que el gremio del tenderete",
    "está a nulo.",
  ),
  esquema: TRAZOS.esquema,
  datos: TRAZOS.datos,
  codigoMostrado: codigo(
    "UPDATE puestos SET abierto = 0 WHERE gremio_id <> 1;",
    "",
    "SELECT nombre, abierto",
    "FROM puestos",
    "ORDER BY id;",
  ),
  respuestaEsperada: codigo(
    "nombre | abierto",
    "Aon Aon | 1",
    "La piedra | 0",
    "El caldero | 0",
    "Aon Ien | 0",
    "La muralla | 0",
    "El tenderete | 1",
  ),
  tests: [
    {
      nombre: "cierra cuatro y deja abiertos los escribas y el que no tiene gremio",
      codigo: codigo(
        "esperar(filas.map((f) => f.abierto), 'los abiertos').igualA([1, 0, 0, 0, 0, 1])",
        "esperar(filas.filter((f) => f.abierto === 1).map((f) => f.nombre), 'los que siguen abiertos')",
        "  .igualA(['Aon Aon', 'El tenderete'])",
      ),
    },
  ],
  pistas: [
    pista("El `UPDATE` cierra los que **no** son del gremio 1. Recorre los seis puestos y decide para cada uno si su comparación es verdadera.", 0),
    pista("Aon Ien ya estaba cerrado antes, y es del gremio 1: mira si el `UPDATE` lo toca o no, y qué valor tiene al final de todas formas.", 1),
    pista("Y el tenderete tiene el gremio a nulo. `NULL <> 1` no es verdadero, así que el `UPDATE` no lo toca: se queda como estaba, abierto. Es la fila que hace que esta predicción no sea trivial.", 2),
  ],
  recompensa: { croquetas: 8 },
}
