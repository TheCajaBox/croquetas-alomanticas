import { codigo, pista } from '../comun.js'
import { MUROS } from '../tablas-de-elantris.js'

export default {
  id: "muros-10-monta-la-union",
  mundo: "muros",
  entorno: "sql",
  tipo: "completar",
  titulo: "Monta la unión",
  enunciado: codigo(
    "La consulta quiere los puestos de los canteros, con el nombre del maestro del gremio.",
    "Aquí solo interesan los que **tienen** gremio, así que una unión normal vale.",
    "",
    "Faltan cuatro piezas. Elige la ficha y pulsa el hueco donde va.",
  ),
  esquema: MUROS.esquema,
  datos: MUROS.datos,
  plantilla: codigo(
    "SELECT p.nombre ___ puesto, g.maestro AS maestro",
    "FROM puestos AS p",
    "___ gremios AS g",
    "  ___ p.gremio_id = g.id",
    "WHERE ___ = 'canteros'",
    "ORDER BY p.nombre ASC;",
  ),
  fichas: ["AS", "JOIN", "ON", "g.nombre", "p.nombre", "WHERE", "LEFT JOIN", "g.id"],
  solucion: codigo(
    "SELECT p.nombre AS puesto, g.maestro AS maestro",
    "FROM puestos AS p",
    "JOIN gremios AS g",
    "  ON p.gremio_id = g.id",
    "WHERE g.nombre = 'canteros'",
    "ORDER BY p.nombre ASC;",
  ),
  tests: [
    { nombre: "las dos columnas", codigo: "esperar(columnas, 'las columnas').igualA(['puesto', 'maestro'])" },
    { nombre: "los dos puestos de los canteros", codigo: "esperar(filas, 'las filas').tieneLongitud(2)" },
    {
      nombre: "La muralla y La piedra, en orden",
      codigo: "esperar(filas.map((f) => f.puesto), 'los puestos').igualA(['La muralla', 'La piedra'])",
    },
    {
      nombre: "los dos con el mismo maestro, que es el del gremio",
      codigo: "esperar(filas.map((f) => f.maestro), 'los maestros').igualA(['Karata', 'Karata'])",
    },
  ],
  pistas: [
    pista("El primer hueco es el de siempre: dar nombre a una columna del resultado.", 0),
    pista("El tercer hueco es la palabra que introduce la costura. Y el cuarto tiene que comparar con `'canteros'`, que es un **nombre** de gremio: piensa qué columna guarda eso.", 1),
    pista("Cuidado con el segundo hueco: hay dos fichas que encajarían y solo una es la que pide el enunciado. Aquí interesan los puestos que **tienen** gremio, así que no hace falta salvar a nadie.", 2),
  ],
  recompensa: { croquetas: 7 },
}
