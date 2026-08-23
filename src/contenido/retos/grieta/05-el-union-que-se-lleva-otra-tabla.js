import { codigo, pista } from '../comun.js'
import { SELLOS } from '../tablas-de-sel.js'

export default {
  id: "grieta-05-el-union-que-se-lleva-otra-tabla",
  mundo: "grieta",
  entorno: "sql",
  tipo: "prediccion",
  titulo: "El UNION que se lleva otra tabla",
  enunciado: codigo(
    "Un buscador de firmas por día. El programa pega el día dentro de la consulta:",
    "",
    "```js",
    "const sql = \"SELECT documento, dia FROM firmas WHERE dia = '\" + dia + \"'\"",
    "```",
    "",
    "Y alguien escribe en el campo del día esto:",
    "",
    "```",
    "' UNION SELECT nombre, rango FROM arbitradores --",
    "```",
    "",
    "Abajo está la consulta que sale. Di **cuántas filas** devuelve y **de qué tabla** son.",
    "Dos líneas: primero el número, después el nombre de la tabla.",
  ),
  esquema: SELLOS.esquema,
  datos: SELLOS.datos,
  codigoMostrado: codigo(
    "-- La consulta que ha quedado, y es válida. El punto y coma va en la línea de",
    "-- abajo porque el `--` del ataque comenta el resto de **su** línea, y eso",
    "-- incluiría el punto y coma: es otra cosa que el ataque se lleva por delante.",
    "SELECT documento, dia FROM firmas",
    "WHERE dia = '' UNION SELECT nombre, rango FROM arbitradores --'",
    ";",
    "",
    "-- Para verlo: cuántas filas salen y de dónde.",
    "SELECT COUNT(*) AS cuantas FROM (",
    "  SELECT documento, dia FROM firmas",
    "  WHERE dia = '' UNION SELECT nombre, rango FROM arbitradores",
    ");",
    "SELECT 'arbitradores' AS de_donde;",
  ),
  respuestaEsperada: codigo("5", "arbitradores"),
  tests: [
    {
      nombre: "salen cinco filas, y son las de otra tabla",
      codigo: codigo(
        "esperar(resultados, 'los tres resultados').tieneLongitud(3)",
        "esperar(resultados[0].filas, 'lo que se lleva el ataque').tieneLongitud(5)",
        "esperar(resultados[1].filas[0].cuantas, 'cuántas filas').igualA(5)",
        "esperar(resultados[2].filas[0].de_donde, 'de dónde').igualA('arbitradores')",
        "// Y no es que la tabla de firmas tenga cinco: tiene ocho.",
        "esperar(cuantas('firmas'), 'cuántas firmas hay').igualA(8)",
      ),
    },
  ],
  pistas: [
    pista("`WHERE dia = ''` no encuentra ninguna firma: no hay ningún día vacío. Así que la primera mitad del `UNION` aporta cero filas.", 0),
    pista(
      "La segunda mitad del `UNION` no habla de firmas: habla de arbitradores. Cuenta cuántos hay.",
      1,
    ),
    pista(
      "Lo interesante es lo que no se ve: el programa pedía documentos y días de la tabla de firmas, y ha devuelto **nombres y rangos de otra tabla**, sin que el programa se enterase. Eso es un `UNION` inyectado, y con la tabla de contraseñas al lado se llama filtración.",
      2,
    ),
  ],
  recompensa: { croquetas: 6 },
}
