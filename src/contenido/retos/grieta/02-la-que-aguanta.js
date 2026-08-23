import { codigo, pista } from '../comun.js'
import { SELLOS } from '../tablas-de-sel.js'

export default {
  id: "grieta-02-la-que-aguanta",
  mundo: "grieta",
  entorno: "sql",
  tipo: "codigo",
  titulo: "La que aguanta",
  enunciado: codigo(
    "Ahora la escribes tú, y el buscador ya tiene el ataque dentro: lo que entra en la",
    "consulta es `' OR 1=1 --`.",
    "",
    "Escribe la consulta que busca **el nombre y el rango** del arbitrador que se llame como",
    "lo que entra. Y que aguante: con un ataque dentro tiene que devolver **cero filas**, y con",
    "un nombre de verdad, la fila de esa persona.",
    "",
    "Lo que entra se escribe `:buscado`. Así, con los dos puntos delante y sin comillas",
    "alrededor: es un **parámetro**, y la base lo recibe por su propio canal.",
  ),
  esquema: SELLOS.esquema,
  datos: SELLOS.datos,
  entradas: { buscado: "' OR 1=1 --" },
  inicial: codigo(
    "-- Lo que entra en la consulta es:  ' OR 1=1 --",
    "-- Esta versión lo pega dentro, y por eso cae.",
    "SELECT nombre, rango FROM arbitradores WHERE nombre = '' OR 1=1 --';",
  ),
  solucion: codigo(
    "SELECT nombre, rango",
    "FROM arbitradores",
    "WHERE nombre = :buscado;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: ":buscado", texto: "Lo que entra va como parámetro, con `:buscado`" },
    { tipo: "prohibeAsterisco", texto: "Las columnas que hacen falta, por su nombre" },
    { tipo: "unaSolaConsulta", texto: "Una consulta" },
  ],
  tests: [
    {
      nombre: "el ataque no devuelve ni una fila",
      codigo: "esperar(filas, 'las filas').tieneLongitud(0)",
    },
    {
      nombre: "y no es que la consulta no funcione: con un nombre de verdad, contesta",
      codigo: codigo(
        "const suyas = consulta(\"SELECT nombre, rango FROM arbitradores WHERE nombre = 'Gaotona'\")",
        "esperar(suyas, 'las filas de Gaotona').tieneLongitud(1)",
        "esperar(suyas[0].rango, 'su rango').igualA('arbitrador')",
      ),
    },
    {
      nombre: "pide las columnas por su nombre y no la tabla entera",
      codigo: codigo(
        "// Con cero filas SQLite no devuelve ni la cabecera, así que aquí no hay",
        "// `columnas` que mirar: se mira la consulta escrita.",
        "esperar(consultaEscrita, 'la consulta').contiene('nombre')",
        "esperar(consultaEscrita, 'la consulta').contiene('rango')",
        "esperar(consultaEscrita, 'la consulta').noContiene('*')",
      ),
    },
    {
      nombre: "el ataque va por el parámetro, que es donde tiene que ir",
      codigo: "esperar(entradas.buscado, 'lo que entra').igualA(\"' OR 1=1 --\")",
    },
    {
      nombre: "la consulta no lleva el ataque pegado dentro",
      codigo: "esperar(consultaEscrita, 'la consulta').noContiene('OR 1=1')",
    },
  ],
  variantes: [
    {
      titulo: "La que aguanta · con otro nombre",
      entradas: { buscado: "d'Alai" },
      tests: [
        {
          nombre: "un nombre con apóstrofo se encuentra sin romper nada",
          codigo: codigo(
            "esperar(filas, 'las filas').tieneLongitud(1)",
            "esperar(filas[0].nombre, 'el nombre').igualA(\"d'Alai\")",
            "esperar(filas[0].rango, 'el rango').igualA('escriba')",
          ),
        },
        {
          nombre: "y sigue pidiendo dos columnas",
          codigo: "esperar(columnas, 'las columnas').igualA(['nombre', 'rango'])",
        },
      ],
    },
    {
      titulo: "La que aguanta · con un nombre que parece un ataque",
      entradas: { buscado: "Robert'); DROP TABLE sellos; --" },
      tests: [
        {
          nombre: "alguien que se llama así también tiene derecho a que le encuentren",
          codigo: codigo(
            "esperar(filas, 'las filas').tieneLongitud(1)",
            "esperar(filas[0].rango, 'el rango').igualA('escriba')",
          ),
        },
        {
          nombre: "y la tabla de sellos sigue ahí",
          codigo: "esperar(cuantas('sellos'), 'cuántos sellos').igualA(6)",
        },
      ],
    },
  ],
  pistas: [
    pista("La consulta es la de siempre: dos columnas, una tabla y un `WHERE`. Lo único raro es el valor.", 0),
    pista(
      "El parámetro se escribe **sin comillas**. Si le pones comillas alrededor deja de ser un parámetro y pasa a ser un texto que casualmente empieza por dos puntos.",
      1,
    ),
    pista(
      "Tres líneas: qué columnas, de qué tabla, y la condición comparando la columna del nombre con el parámetro.",
      2,
    ),
  ],
  recompensa: { croquetas: 7 },
}
