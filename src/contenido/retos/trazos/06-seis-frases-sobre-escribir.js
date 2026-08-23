import { codigo, pista } from '../comun.js'
import { TRAZOS } from '../tablas-de-elantris.js'

export default {
  id: "trazos-06-seis-frases-sobre-escribir",
  mundo: "trazos",
  entorno: "sql",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre escribir",
  enunciado: codigo(
    "Seis frases sobre tocar los datos. Aquí las equivocaciones no se arreglan mirando otra",
    "vez, así que conviene tenerlas claras antes.",
    "",
    "Se corrigen todas juntas.",
  ),
  esquema: TRAZOS.esquema,
  datos: TRAZOS.datos,
  afirmaciones: [
    {
      texto: "Un `DELETE` sin `WHERE` vacía la tabla y no da ningún error.",
      verdadera: true,
      porque:
        "Es una orden perfectamente válida: hay veces en que vaciar una tabla es lo que se quiere. La base no puede saber que se te ha olvidado media línea. Y a diferencia de un `SELECT` mal escrito, esto no se arregla volviendo a mirar.",
    },
    {
      texto: "Dentro de una transacción, un `ROLLBACK` deshace lo que hayas hecho desde el `BEGIN`.",
      verdadera: true,
      porque:
        "Y es la única red que hay. Entre `BEGIN` y `COMMIT`, o pasan todas las órdenes o no pasa ninguna. Fuera de una transacción, cada orden se confirma sola en cuanto termina y ya no hay nada que deshacer.",
    },
    {
      texto: "`UPDATE ventas SET monedas = monedas + 10` necesita saber el valor de antes, así que hay que leerlo primero.",
      porque:
        "No: la columna se puede usar en su propio cálculo, y la base coge el valor de cada fila. Leer primero y escribir después es peor además de innecesario, porque entre las dos órdenes otro programa puede haber cambiado el dato -y entonces sumas sobre un número viejo-.",
    },
    {
      texto: "Un `INSERT` que choca con una regla `UNIQUE` mete la fila y avisa.",
      porque:
        "No mete nada: la orden falla entera y la tabla se queda como estaba. Eso es exactamente lo que se quiere de una restricción -mejor un error que un dato duplicado- y por eso las reglas van en el esquema.",
    },
    {
      texto: "Un índice hace que todo vaya más rápido, así que conviene ponerlos en todas las columnas.",
      porque:
        "Acelera las **lecturas** que puedan usarlo y encarece **todas las escrituras**, porque hay que mantenerlo al día en cada `INSERT`, `UPDATE` y `DELETE`. Y ocupa espacio. Se ponen mirando qué consultas tardan, con el plan delante, y no por si acaso.",
    },
    {
      texto: "Se puede borrar un gremio que tenga puestos, y sus puestos se quedan apuntando a un gremio que no existe.",
      porque:
        "La clave ajena no lo permite: la orden falla. Y eso es lo bueno de declararla. Sin ella se podría, y entonces la tabla tendría filas apuntando al vacío -datos que no se pueden arreglar sin adivinar de quién eran-.",
    },
  ],
  pistas: [
    pista("Dos son verdad y hablan de lo peligroso. Las cuatro falsas suenan razonables y son cosas que la gente cree.", 0),
    pista("Tres de las falsas se pueden comprobar ejecutando una orden y leyendo lo que dice la base. Pruébalas.", 1),
    pista("La del índice es la más común de todas, y la pista está en la palabra «todo»: una cosa que acelera unas operaciones y encarece otras no acelera todo.", 2),
  ],
  recompensa: { croquetas: 8 },
}
