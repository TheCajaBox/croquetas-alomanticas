import { codigo, pista } from '../comun.js'
import { PUESTOS } from '../tablas-de-elantris.js'

export default {
  id: "kae-11-ponles-nombre",
  mundo: "kae",
  entorno: "sql",
  tipo: "completar",
  titulo: "Ponles nombre a las columnas",
  enunciado: codigo(
    "Una consulta puede devolver columnas que no están en ninguna tabla: una cuenta, un texto",
    "pegado, lo que haga falta. Y entonces hay que **ponerles nombre**, porque si no, la",
    "columna se llama como la expresión que la creó y lo que la lea después se vuelve ilegible.",
    "",
    "Eso se hace con `AS`, y se llama **alias**. No cambia los datos: cambia cómo se llama lo",
    "que sale.",
    "",
    "Faltan tres piezas. Elige la ficha y pulsa el hueco donde va.",
  ),
  esquema: PUESTOS.esquema,
  datos: PUESTOS.datos,
  plantilla: codigo(
    "SELECT nombre ___ puesto, monedas * 2 ___ el_doble",
    "FROM puestos",
    "ORDER BY monedas ___",
    "LIMIT 3;",
  ),
  fichas: ["AS", "DESC", "ASC", "IS", "LIKE", "LIMIT", "="],
  solucion: codigo(
    "SELECT nombre AS puesto, monedas * 2 AS el_doble",
    "FROM puestos",
    "ORDER BY monedas DESC",
    "LIMIT 3;",
  ),
  tests: [
    {
      nombre: "las columnas se llaman como les has puesto",
      codigo: "esperar(columnas, 'las columnas').igualA(['puesto', 'el_doble'])",
    },
    { nombre: "y salen tres filas", codigo: "esperar(filas, 'las filas').tieneLongitud(3)" },
    {
      nombre: "las tres que más recaudan, de mayor a menor",
      codigo: "esperar(filas.map((f) => f.puesto), 'los puestos').igualA(['Los dos ríos', 'El caldero', 'El yunque'])",
    },
    {
      nombre: "y el doble es el doble",
      codigo: "esperar(filas.map((f) => f.el_doble), 'los dobles').igualA([640, 420, 360])",
    },
  ],
  pistas: [
    pista("Los dos primeros huecos hacen lo mismo: dar nombre a una columna del resultado.", 0),
    pista("El tercero decide el sentido del orden, y el enunciado pide «las que más». De menor a mayor saldrían las tres más pequeñas.", 1),
    pista("`AS`, `AS` y `DESC`. Y fíjate en `monedas * 2`: sin alias, esa columna se llamaría literalmente `monedas * 2`, que es horrible de leer y peor de usar desde otro sitio.", 2),
  ],
  recompensa: { croquetas: 7 },
}
