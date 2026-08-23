import { codigo, pista } from '../comun.js'
import { HABITANTES } from '../tablas-de-kae.js'

export default {
  id: "kae-03-que-devuelve-esto",
  mundo: "kae",
  entorno: "sql",
  tipo: "prediccion",
  titulo: "Lo que devuelve, antes de ejecutarlo",
  enunciado: codigo(
    "Aquí no se escribe: se lee y se predice. Y es el ejercicio más útil de todo el mundo,",
    "porque en SQL una consulta mal escrita casi nunca revienta: **devuelve otra cosa**. Si",
    "no sabes qué esperabas, no puedes darte cuenta.",
    "",
    "Esta consulta trae una palabra nueva, `WHERE`: se le da una condición y la base la",
    "prueba fila por fila. Las que la cumplen salen; las que no, no.",
    "",
    "Escribe abajo, tal cual, lo que va a devolver: **primero la línea de las columnas** y",
    "después una línea por fila, con los valores separados por ` | `. En el orden en que",
    "están en la tabla, que es en el que salen cuando nadie pide otro.",
  ),
  esquema: HABITANTES.esquema,
  datos: HABITANTES.datos,
  codigoMostrado: codigo(
    "SELECT nombre, edad",
    "FROM habitantes",
    "WHERE barrio = 'Muralla';",
  ),
  respuestaEsperada: codigo(
    "nombre | edad",
    "Galladon | 41",
    "Shuden | 30",
    "Adien | 19",
  ),
  tests: [
    {
      nombre: "las filas de la Muralla son las tres que había que predecir",
      codigo: codigo(
        "esperar(filas.map((f) => f.nombre), 'los nombres').igualA(['Galladon', 'Shuden', 'Adien'])",
        "esperar(columnas, 'las columnas').igualA(['nombre', 'edad'])",
      ),
    },
  ],
  pistas: [
    pista("Busca en la tabla de abajo las filas cuyo `barrio` sea exactamente `Muralla`. Ni Kae ni Puerta.", 0),
    pista("Son tres. Y de cada una sale lo que pide el `SELECT`: el nombre y la edad, en ese orden y nada más.", 1),
    pista("Salen en el orden en que están en la tabla, porque no hay ningún `ORDER BY`. Primero la fila 2, después la 7 y después la 10.", 2),
  ],
  recompensa: { croquetas: 6 },
}
