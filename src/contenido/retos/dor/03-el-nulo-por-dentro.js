import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "dor-03-el-nulo-por-dentro",
  mundo: "dor",
  entorno: "sql",
  tipo: "prediccion",
  titulo: "El nulo, por dentro",
  enunciado: codigo(
    "Llevas tres mundos tropezando con el nulo y sabiendo una regla: **no es igual a nada**.",
    "Ahora toca ver por qué, porque de ahí sale todo lo demás.",
    "",
    "En SQL una condición no vale verdadero o falso: vale verdadero, falso o **desconocido**. Y",
    "en cuanto hay un nulo por medio, sale lo tercero.",
    "",
    "Esta consulta pide cuatro comparaciones. Predice lo que devuelve: la línea de las columnas",
    "y una línea con los cuatro valores separados por ` | `. Lo desconocido se pinta `NULL`, y",
    "lo verdadero, en SQLite, se pinta `1`.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  codigoMostrado: codigo(
    "SELECT",
    "  1 = NULL     AS uno_igual_nulo,",
    "  1 <> NULL    AS uno_distinto_nulo,",
    "  NULL = NULL  AS nulo_igual_nulo,",
    "  NULL IS NULL AS nulo_es_nulo;",
  ),
  respuestaEsperada: codigo(
    "uno_igual_nulo | uno_distinto_nulo | nulo_igual_nulo | nulo_es_nulo",
    "NULL | NULL | NULL | 1",
  ),
  tests: [
    {
      nombre: "las tres comparaciones son desconocidas, y solo IS NULL contesta",
      codigo: codigo(
        "esperar(filas, 'las filas').tieneLongitud(1)",
        "esperar(filas[0].uno_igual_nulo, '1 = NULL').igualA(null)",
        "esperar(filas[0].uno_distinto_nulo, '1 <> NULL').igualA(null)",
        "esperar(filas[0].nulo_igual_nulo, 'NULL = NULL').igualA(null)",
        "esperar(filas[0].nulo_es_nulo, 'NULL IS NULL').igualA(1)",
      ),
    },
  ],
  pistas: [
    pista("Piensa el nulo como «no lo sé» en vez de como «vacío». ¿Es uno igual a algo que no sabes? No se sabe.", 0),
    pista("Y por eso la tercera también es desconocida: dos cosas que no sabes cuáles son pueden ser la misma o no. Nadie puede decirlo.", 1),
    pista("`IS NULL` no compara: **pregunta si falta**. Esa sí tiene respuesta, y es verdadera. Es la única manera de preguntar por un nulo, y de ahí sale que exista.", 2),
  ],
  recompensa: { croquetas: 7 },
}
