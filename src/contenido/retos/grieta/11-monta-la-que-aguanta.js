import { codigo, pista } from '../comun.js'
import { SELLOS } from '../tablas-de-sel.js'

export default {
  id: "grieta-11-monta-la-que-aguanta",
  mundo: "grieta",
  entorno: "sql",
  tipo: "completar",
  titulo: "Monta la que aguanta",
  enunciado: codigo(
    "Un listado de firmas por clase de sello y por día, con las dos cosas entrando desde",
    "fuera. Faltan cuatro piezas.",
    "",
    "Entre las fichas hay dos que son el mismo valor escrito de dos maneras: como parámetro y",
    "pegado entre comillas. Elige bien.",
    "",
    "Lo que entra es `:clase` = `menor` y `:dia` = `05-03`.",
  ),
  esquema: SELLOS.esquema,
  datos: SELLOS.datos,
  entradas: { clase: "menor", dia: "05-03" },
  plantilla: codigo(
    "SELECT f.documento, s.clase",
    "FROM firmas f",
    "___ sellos s ON s.id = f.sello_id",
    "WHERE s.clase = ___",
    "  AND f.dia = ___",
    "___ f.documento;",
  ),
  fichas: [
    "JOIN",
    ":clase",
    ":dia",
    "ORDER BY",
    "'menor'",
    "'05-03'",
    "GROUP BY",
    "LEFT JOIN",
  ],
  solucion: codigo(
    "SELECT f.documento, s.clase",
    "FROM firmas f",
    "JOIN sellos s ON s.id = f.sello_id",
    "WHERE s.clase = :clase",
    "  AND f.dia = :dia",
    "ORDER BY f.documento;",
  ),
  tests: [
    {
      nombre: "las dos columnas",
      codigo: "esperar(columnas, 'las columnas').igualA(['documento', 'clase'])",
    },
    {
      nombre: "el 05-03 con sello menor: la copia del catastro",
      codigo: codigo(
        "esperar(filas, 'las filas').tieneLongitud(1)",
        "esperar(filas[0].documento, 'el documento').igualA('copia del catastro')",
        "esperar(filas[0].clase, 'la clase').igualA('menor')",
      ),
    },
    {
      nombre: "el ataque no está: los valores no se han pegado dentro",
      codigo: codigo(
        "esperar(consultaEscrita, 'la consulta').contiene(':clase')",
        "esperar(consultaEscrita, 'la consulta').contiene(':dia')",
        "esperar(consultaEscrita, 'la consulta').noContiene(\"'menor'\")",
        "esperar(consultaEscrita, 'la consulta').noContiene(\"'05-03'\")",
      ),
    },
  ],
  pistas: [
    pista("Sobran cuatro fichas. Dos de las que sobran son valores escritos entre comillas.", 0),
    pista(
      "La primera pieza une dos tablas y tiene que dejar fuera las firmas cuyo sello no exista. La última ordena.",
      1,
    ),
    pista(
      "Las dos del medio son los valores, y aquí está el reto: `'menor'` y `:clase` dan hoy el mismo resultado. Mañana, con otro valor dentro, no.",
      2,
    ),
  ],
  recompensa: { croquetas: 6 },
}
