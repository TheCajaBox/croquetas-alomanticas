import { codigo, pista } from '../comun.js'
import { HABITANTES, OTROS_CENSOS } from '../tablas-de-kae.js'

export default {
  id: "kae-05-quedarse-con-unas-filas",
  mundo: "kae",
  entorno: "sql",
  tipo: "codigo",
  titulo: "Quedarse con unas filas",
  enunciado: codigo(
    "`SELECT` elige **columnas**. `WHERE` elige **filas**. Son dos cosas distintas y las dos",
    "recortan la respuesta, pero por lados diferentes: una quita datos de cada fila y la otra",
    "quita filas enteras.",
    "",
    "Escribe una consulta que devuelva el `nombre` y el `oficio` de los habitantes del barrio",
    "`Kae`. Solo esos.",
    "",
    "Los textos van entre **comillas simples**. Las dobles en SQL son otra cosa -sirven para",
    "nombrar columnas- y usarlas aquí da un error que no se parece nada al problema.",
  ),
  esquema: HABITANTES.esquema,
  datos: HABITANTES.datos,
  inicial: codigo(
    "SELECT nombre, oficio",
    "FROM habitantes",
    "-- Aquí falta la condición.",
  ),
  solucion: codigo(
    "SELECT nombre, oficio",
    "FROM habitantes",
    "WHERE barrio = 'Kae';",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "WHERE", texto: "Filtra con `WHERE`" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta" },
  ],
  tests: [
    { nombre: "salen los cinco de Kae", codigo: "esperar(filas, 'las filas').tieneLongitud(5)" },
    {
      nombre: "y son los cinco que son",
      codigo: "esperar(filas.map((f) => f.nombre), 'los nombres').igualA(['Raoden', 'Sarene', 'Kiin', 'Roial', 'Daora'])",
    },
    { nombre: "con las dos columnas pedidas", codigo: "esperar(columnas).igualA(['nombre', 'oficio'])" },
    {
      nombre: "no se ha colado nadie de la Muralla",
      codigo: "esperar(filas.map((f) => f.nombre), 'los nombres').noContiene('Galladon')",
    },
    {
      nombre: "ni de la Puerta",
      codigo: "esperar(filas.map((f) => f.nombre), 'los nombres').noContiene('Lukel')",
    },
    {
      nombre: "y la tabla sigue teniendo sus diez filas: una consulta no borra nada",
      codigo: "esperar(cuantas('habitantes'), 'las filas de la tabla').igualA(10)",
    },
  ],
  variantes: [
    {
      titulo: "Quedarse con unas filas · otra tanda",
      datos: OTROS_CENSOS[0],
      tests: [
        { nombre: "en este censo, cinco de Kae también", codigo: "esperar(filas).tieneLongitud(5)" },
        {
          nombre: "y son estos",
          codigo: "esperar(filas.map((f) => f.nombre)).igualA(['Karata', 'Mareshe', 'Aanden', 'Saolin', 'Maare'])",
        },
        { nombre: "las dos columnas de siempre", codigo: "esperar(columnas).igualA(['nombre', 'oficio'])" },
        { nombre: "Taan es de la Muralla y no sale", codigo: "esperar(filas.map((f) => f.nombre)).noContiene('Taan')" },
      ],
    },
    {
      titulo: "Quedarse con unas filas · y otra",
      datos: OTROS_CENSOS[1],
      tests: [
        { nombre: "aquí los de Kae son cuatro", codigo: "esperar(filas).tieneLongitud(4)" },
        {
          nombre: "Torena, Ahan, Jalla y Kahar",
          codigo: "esperar(filas.map((f) => f.nombre)).igualA(['Torena', 'Ahan', 'Jalla', 'Kahar'])",
        },
        {
          nombre: "y el primero es comerciante",
          codigo: "esperar(filas[0]).igualA({ nombre: 'Torena', oficio: 'comerciante' })",
        },
      ],
    },
  ],
  pistas: [
    pista("Detrás de `WHERE` va una condición: qué columna, qué comparación y con qué valor.", 0),
    pista("La igualdad en SQL se escribe con **un** signo igual, no con dos: `barrio = 'Kae'`. El `==` es de otros lenguajes.", 1),
    pista("`WHERE barrio = 'Kae'`. Con comillas simples, y con la K mayúscula: la comparación de textos en SQLite distingue mayúsculas.", 2),
  ],
  recompensa: { croquetas: 6 },
}
