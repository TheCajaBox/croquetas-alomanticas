import { codigo, pista } from '../comun.js'
import { SELLOS } from '../tablas-de-sel.js'

export default {
  id: "grieta-10-los-sellos-de-un-arbitrador",
  mundo: "grieta",
  entorno: "sql",
  tipo: "codigo",
  titulo: "Los sellos de un arbitrador",
  enunciado: codigo(
    "Ahora una consulta de verdad, con una unión, un filtro y dos entradas. Y las dos entradas",
    "traen ataque.",
    "",
    "Devuelve, para cada sello **no revocado** de la persona cuyo nombre entra en `:quien` y",
    "de la clase que entra en `:clase`: el `id` del sello y su `clase`. Ordenado por `id`.",
    "",
    "Las dos entradas van como parámetros. Ninguna se pega dentro de la consulta.",
  ),
  esquema: SELLOS.esquema,
  datos: SELLOS.datos,
  entradas: { quien: "Gaotona' OR '1'='1", clase: "imperial' --" },
  inicial: codigo(
    "-- Lo que entra:",
    "--   quien  = Gaotona' OR '1'='1",
    "--   clase  = imperial' --",
    "-- Pegado dentro, cada uno abre su propia grieta.",
    "SELECT s.id, s.clase",
    "FROM sellos s",
    "JOIN arbitradores a ON a.id = s.arbitrador_id",
    "WHERE s.revocado = 0 AND a.nombre = 'Gaotona' OR '1'='1' AND s.clase = 'imperial' --'",
    "ORDER BY s.id;",
  ),
  solucion: codigo(
    "SELECT s.id, s.clase",
    "FROM sellos s",
    "JOIN arbitradores a ON a.id = s.arbitrador_id",
    "WHERE s.revocado = 0",
    "  AND a.nombre = :quien",
    "  AND s.clase = :clase",
    "ORDER BY s.id;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: ":quien", texto: "El nombre entra como parámetro" },
    { tipo: "usaPalabra", valor: ":clase", texto: "Y la clase también" },
    { tipo: "usaPalabra", valor: "JOIN", texto: "Los sellos se unen con sus arbitradores" },
    { tipo: "prohibeAsterisco", texto: "Las dos columnas, por su nombre" },
  ],
  tests: [
    {
      nombre: "con las dos entradas hostiles no sale nada",
      codigo: "esperar(filas, 'las filas').tieneLongitud(0)",
    },
    {
      nombre: "el ataque del OR no se ha colado en la consulta",
      codigo: codigo(
        "esperar(consultaEscrita, 'la consulta').noContiene(\"'1'='1\")",
        "esperar(consultaEscrita, 'la consulta').noContiene('Gaotona')",
      ),
    },
    {
      nombre: "ni el del comentario",
      codigo: "esperar(consultaEscrita, 'la consulta').noContiene('--')",
    },
    {
      nombre: "el filtro de revocado sigue escrito",
      codigo: "esperar(consultaEscrita.replace(/\\s+/g, ' '), 'la consulta').contiene('revocado = 0')",
    },
  ],
  variantes: [
    {
      titulo: "Los sellos de un arbitrador · Gaotona, imperiales",
      entradas: { quien: "Gaotona", clase: "imperial" },
      tests: [
        {
          nombre: "Gaotona tiene un sello imperial en pie",
          codigo: codigo(
            "esperar(filas, 'las filas').tieneLongitud(1)",
            "esperar(filas[0].id, 'el id').igualA(1)",
            "esperar(filas[0].clase, 'la clase').igualA('imperial')",
          ),
        },
      ],
    },
    {
      titulo: "Los sellos de un arbitrador · Frava, imperiales",
      entradas: { quien: "Frava", clase: "imperial" },
      tests: [
        {
          nombre: "el de Frava está revocado, así que no sale",
          codigo: "esperar(filas, 'las filas').tieneLongitud(0)",
        },
        {
          nombre: "y no es que Frava no tenga sello: tiene uno, revocado",
          codigo: codigo(
            "const todos = consulta(\"SELECT s.id FROM sellos s JOIN arbitradores a ON a.id = s.arbitrador_id WHERE a.nombre = 'Frava'\")",
            "esperar(todos, 'los sellos de Frava').tieneLongitud(1)",
          ),
        },
      ],
    },
    {
      titulo: "Los sellos de un arbitrador · un nombre con apóstrofo",
      entradas: { quien: "d'Alai", clase: "menor" },
      tests: [
        {
          nombre: "el apóstrofo no rompe nada y su sello sale",
          codigo: codigo(
            "esperar(filas, 'las filas').tieneLongitud(1)",
            "esperar(filas[0].id, 'el id').igualA(5)",
            "esperar(filas[0].clase, 'la clase').igualA('menor')",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("La consulta de partida ya tiene la unión y las columnas. Lo que falla son los dos valores.", 0),
    pista(
      "Fíjate también en los paréntesis que faltan en la versión mala: con `AND` y `OR` mezclados sin paréntesis, el `OR` de en medio parte la condición en dos y la segunda mitad se cumple sola.",
      1,
    ),
    pista(
      "Cada valor pegado se sustituye por su parámetro, sin comillas. Y las tres condiciones se unen con `AND`, cada una en su línea: así se lee y no hay dudas de prioridad.",
      2,
    ),
  ],
  recompensa: { croquetas: 8 },
}
