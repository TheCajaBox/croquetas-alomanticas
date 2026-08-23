import { codigo, pista } from '../comun.js'
import { SELLOS } from '../tablas-de-sel.js'

export default {
  id: "grieta-08-el-informe-que-se-cuela",
  mundo: "grieta",
  entorno: "sql",
  tipo: "bug",
  titulo: "El informe que se cuela",
  enunciado: codigo(
    "Un informe de firmas **públicas** por día. Lo que entra es el día, y hoy lo que entra es",
    "esto:",
    "",
    "```",
    "01-03' OR secreto = 1 --",
    "```",
    "",
    "La consulta de abajo pega el día dentro, así que el `OR` anula el filtro de `secreto` y",
    "el informe publica las tres firmas secretas.",
    "",
    "Arréglala. Tiene que devolver `documento` y `dia` de las firmas **no secretas** del día",
    "que entre, ordenadas por `documento`. Lo que entra se escribe `:dia`.",
  ),
  esquema: SELLOS.esquema,
  datos: SELLOS.datos,
  entradas: { dia: "01-03' OR secreto = 1 --" },
  inicial: codigo(
    "-- Lo que entra es:  01-03' OR secreto = 1 --",
    "-- Pegado dentro, el OR se lleva por delante el filtro de secreto.",
    "SELECT documento, dia",
    "FROM firmas",
    "WHERE secreto = 0 AND dia = '01-03' OR secreto = 1 --'",
    "ORDER BY documento;",
  ),
  solucion: codigo(
    "SELECT documento, dia",
    "FROM firmas",
    "WHERE secreto = 0 AND dia = :dia",
    "ORDER BY documento;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: ":dia", texto: "El día entra como parámetro" },
    { tipo: "usaPalabra", valor: "ORDER BY", texto: "Ordenado por documento" },
    { tipo: "prohibeAsterisco", texto: "Las dos columnas, por su nombre" },
    { tipo: "unaSolaConsulta", texto: "Una consulta" },
  ],
  tests: [
    {
      nombre: "el ataque no saca ni una firma secreta",
      codigo: codigo(
        "const secretas = consulta('SELECT documento FROM firmas WHERE secreto = 1').map((f) => f.documento)",
        "for (const cual of secretas) {",
        "  esperar(filas.map((f) => f.documento), 'lo que sale').noContiene(cual)",
        "}",
      ),
    },
    {
      nombre: "y de hecho no saca nada: no hay ningún día que se llame así",
      codigo: "esperar(filas, 'las filas').tieneLongitud(0)",
    },
    {
      nombre: "la consulta no lleva el ataque pegado dentro",
      codigo: codigo(
        "esperar(consultaEscrita, 'la consulta').noContiene('OR secreto = 1')",
        "esperar(consultaEscrita, 'la consulta').noContiene('01-03')",
      ),
    },
    {
      nombre: "el filtro de secreto sigue escrito",
      codigo: "esperar(consultaEscrita.replace(/\\s+/g, ' '), 'la consulta').contiene('secreto = 0')",
    },
  ],
  variantes: [
    {
      titulo: "El informe que se cuela · con un día de verdad",
      entradas: { dia: "02-03" },
      tests: [
        {
          nombre: "el día 02-03 tiene una firma pública y una secreta: sale una",
          codigo: codigo(
            "esperar(filas, 'las filas').tieneLongitud(1)",
            "esperar(filas[0].documento, 'el documento').igualA('permiso de obra')",
          ),
        },
        {
          nombre: "el ataque de la secreta de ese día no sale",
          codigo: "esperar(filas.map((f) => f.documento), 'lo que sale').noContiene('traslado de la guardia')",
        },
      ],
    },
    {
      titulo: "El informe que se cuela · con un día de dos firmas",
      entradas: { dia: "05-03" },
      tests: [
        {
          nombre: "del 05-03 sale solo la pública",
          codigo: codigo(
            "esperar(filas, 'las filas').tieneLongitud(1)",
            "esperar(filas[0].documento, 'el documento').igualA('copia del catastro')",
          ),
        },
        {
          nombre: "el ataque del plano de la muralla, que es secreto, no sale",
          codigo: "esperar(filas.map((f) => f.documento), 'lo que sale').noContiene('plano de la muralla norte')",
        },
      ],
    },
  ],
  pistas: [
    pista("La consulta ya tiene la forma buena. Lo único que hay que cambiar es de dónde sale el día.", 0),
    pista(
      "Fíjate en que el problema no es el `WHERE`: el `WHERE` está bien escrito. El problema es que el texto del usuario **es parte** de él.",
      1,
    ),
    pista(
      "Sustituye todo lo que va después de `dia = ` por el parámetro, sin comillas. El resto de la consulta —el filtro de secreto, el orden— se queda tal cual.",
      2,
    ),
  ],
  recompensa: { croquetas: 7 },
}
