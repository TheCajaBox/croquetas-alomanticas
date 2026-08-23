import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "linea-10-cual-de-los-cuatro",
  mundo: "linea",
  entorno: "sql",
  tipo: "eleccion",
  titulo: "Cuál de los cuatro esquemas",
  enunciado: codigo(
    "Cuatro maneras de guardar lo mismo: puestos, gremios y ventas. Las cuatro funcionan hoy y",
    "solo una aguanta lo que va a pasar mañana.",
    "",
    "Aquí no se escribe: se elige. Y es la decisión más cara de deshacer de todas las que se",
    "toman con una base de datos, porque cuando quieres cambiarla ya hay datos dentro.",
  ),
  esquema: MERCADO.esquema,
  pregunta: codigo(
    "¿Cuál de estos cuatro esquemas elegirías?",
  ),
  opciones: [
    {
      texto: codigo(
        "**Tres tablas.** `gremios(id, nombre UNIQUE)`, `puestos(id, nombre, gremio_id",
        "REFERENCES gremios(id))` y `ventas(id, puesto_id NOT NULL REFERENCES puestos(id), dia,",
        "monedas CHECK (monedas >= 0), UNIQUE (puesto_id, dia))`.",
      ),
      correcta: true,
      porque: codigo(
        "Cada cosa una vez, cada relación por su clave, y las reglas donde las cumple todo el",
        "mundo. Y una cosa que no se ve: **`puestos.gremio_id` admite nulos y eso es a",
        "propósito** -hay un puesto sin gremio y es un dato legítimo-, mientras que",
        "`ventas.puesto_id` es `NOT NULL`, porque una venta sin puesto no significa nada.",
        "",
        "Esa diferencia es la que hay que saber tomar: cada columna que admite nulos es una",
        "decisión, y cada una que no los admite, otra.",
      ),
    },
    {
      texto: codigo(
        "**Una tabla.** `ventas(id, puesto_nombre, gremio_nombre, maestro, dia, monedas)`, con",
        "el nombre del puesto y del gremio escritos en cada venta.",
      ),
      porque: codigo(
        "Funciona y es lo que sale de una hoja de cálculo. Tres problemas, de menos a más grave:",
        "el nombre del gremio se escribe dieciséis veces y basta una errata para que haya dos",
        "gremios donde había uno; un puesto que no ha vendido nada **no existe** -no hay fila",
        "donde escribirlo-; y no hay dónde guardar el maestro de un gremio sin repetirlo, con",
        "el riesgo de que las copias no coincidan.",
      ),
    },
    {
      texto: codigo(
        "**Tres tablas sin claves ajenas.** Lo mismo que el primero, pero `gremio_id` y",
        "`puesto_id` son números normales, sin `REFERENCES`.",
      ),
      porque: codigo(
        "Las uniones funcionan igual: un `JOIN` no necesita que la clave ajena esté declarada.",
        "Lo que se pierde es que **la base lo vigile**: se puede meter una venta de un puesto",
        "que no existe, y se puede borrar un puesto dejando sus ventas apuntando al vacío. Ese",
        "día los datos quedan diciendo algo falso y no hay manera de arreglarlos sin adivinar.",
        "",
        "Es el esquema que se escribe cuando alguien piensa que las restricciones son",
        "documentación.",
      ),
    },
    {
      texto: codigo(
        "**Tres tablas con el total guardado.** Lo mismo que el primero, y además una columna",
        "`puestos.total` que se va actualizando con cada venta.",
      ),
      porque: codigo(
        "Es la tentación de quien ya sabe que agrupar cuesta, y es un dato que puede",
        "contradecirse a sí mismo: el día que alguien meta una venta y se olvide de sumar -o lo",
        "haga y falle a medias- el total dirá una cosa y las ventas otra, y no hay manera de",
        "saber cuál miente.",
        "",
        "Hay casos en que se hace a propósito, con transacciones o disparadores, y se llama",
        "desnormalizar. Se hace **midiendo** que agrupar es de verdad el problema, no por",
        "adelantado, y sabiendo que se paga en fiabilidad.",
      ),
    },
  ],
  pistas: [
    pista("Pregúntate en cada uno qué pasa con un puesto que no ha vendido nada, y con un gremio que no tiene puestos.", 0),
    pista("Después pregúntate qué pasa el día que alguien se equivoque: si el esquema lo para o si guarda el error.", 1),
    pista("Y en el último, pregúntate qué pasa si dos datos que dicen lo mismo dejan de coincidir. ¿Cuál de los dos es el verdadero?", 2),
  ],
  recompensa: { croquetas: 9 },
}
