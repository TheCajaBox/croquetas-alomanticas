import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "linea-04-tres-trampas-a-la-vez",
  mundo: "linea",
  entorno: "sql",
  tipo: "prediccion",
  titulo: "Tres trampas a la vez",
  enunciado: codigo(
    "Esta consulta tiene tres de las trampas del camino puestas al mismo tiempo, y devuelve un",
    "resultado perfectamente creíble.",
    "",
    "Predice lo que devuelve: la línea de las columnas y una línea por fila, con los valores",
    "separados por ` | `. Los huecos se pintan `NULL`.",
    "",
    "Mira el `JOIN` -no es `LEFT`-, mira qué se cuenta, y mira la condición del `WHERE`.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  codigoMostrado: codigo(
    "SELECT p.nombre AS puesto, COUNT(*) AS ventas",
    "FROM puestos AS p",
    "JOIN ventas AS v ON v.puesto_id = p.id",
    "WHERE p.gremio_id <> 1",
    "GROUP BY p.id",
    "ORDER BY p.nombre ASC;",
  ),
  respuestaEsperada: codigo(
    "puesto | ventas",
    "El caldero | 2",
    "El yunque | 2",
    "La piedra | 1",
    "Los dos ríos | 2",
  ),
  tests: [
    {
      nombre: "cuatro filas: se caen los escribas, el que no vendió y el que no tiene gremio",
      codigo: codigo(
        "esperar(filas.map((f) => f.puesto), 'los puestos')",
        "  .igualA(['El caldero', 'El yunque', 'La piedra', 'Los dos ríos'])",
        "esperar(filas.map((f) => f.ventas), 'las cuentas').igualA([2, 2, 1, 2])",
      ),
    },
  ],
  pistas: [
    pista("Empieza por el `JOIN`, que no es `LEFT`: eso ya se lleva un puesto, el que no ha vendido nada.", 0),
    pista("Después el `WHERE`. Se lleva los tres escribas... y uno más, por el nulo. `NULL <> 1` no es verdadero.", 1),
    pista("Y el `COUNT(*)` aquí **no** miente, porque con un `JOIN` normal no hay filas vacías en ningún montón: todos los que quedan tienen ventas de verdad. Es la única de las tres trampas que en esta consulta no hace daño, y saber por qué es media lección.", 2),
  ],
  recompensa: { croquetas: 9 },
}
