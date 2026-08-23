import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "linea-01-seis-frases-del-camino",
  mundo: "linea",
  entorno: "sql",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases de los cinco mundos",
  enunciado: codigo(
    "Antes de empezar el final, seis frases de todo lo anterior. Ninguna es nueva y las seis",
    "son cosas que se olvidan.",
    "",
    "Se corrigen todas juntas.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  afirmaciones: [
    {
      texto: "Sin `ORDER BY`, el orden de las filas no está prometido, aunque hoy salgan ordenadas.",
      verdadera: true,
      porque:
        "La base puede devolverlas como le convenga, y lo que le convenga cambia cuando la tabla crece, cuando aparece un índice o cuando se actualiza de versión. Si el orden importa, se pide. Y de ahí sale la otra: `LIMIT` sin `ORDER BY` corta a ciegas.",
    },
    {
      texto: "Un `LEFT JOIN` con una condición sobre la tabla de la derecha en el `WHERE` es un `JOIN` normal.",
      verdadera: true,
      porque:
        "El `LEFT` salva la fila sin pareja y el `WHERE`, que trabaja después, la tira: llega con nulos y comparar con nulo no da verdadero. La condición sobre la tabla de la derecha va en el `ON`. Y al revés: una condición sobre la tabla de la **izquierda** va en el `WHERE`, porque en el `ON` no filtra nada.",
    },
    {
      texto: "Después de un `LEFT JOIN`, `COUNT(*)` y `COUNT(columna)` dan lo mismo.",
      porque:
        "El montón de un grupo vacío tiene **una** fila -la que la unión fabricó con todo a nulo-, así que `COUNT(*)` dice uno y `COUNT(columna)` dice cero. Uno de los dos números es mentira, y no es el segundo. Es el fallo más silencioso de todo el camino.",
    },
    {
      texto: "`WHERE columna = NULL` encuentra las filas donde falta ese dato.",
      porque:
        "No encuentra nada, y no da error. La comparación vale «desconocido» y el `WHERE` solo deja pasar lo verdadero. La única manera de preguntar por un nulo es `IS NULL`, y no es un capricho de sintaxis: es que la igualdad, con nulos, no significa nada.",
    },
    {
      texto: "Un `WHERE` puede cambiar las cuentas de un `GROUP BY`, y hasta hacer desaparecer un grupo entero.",
      verdadera: true,
      porque:
        "El `WHERE` no filtra el informe: filtra **lo que entra en los montones**. Si le quita todas las filas a un día, ese día no tiene montón y no existe. No lo filtra el `HAVING`; simplemente nunca llegó a existir.",
    },
    {
      texto: "Un índice acelera las consultas y no tiene ningún coste, así que conviene ponerlos por si acaso.",
      porque:
        "Acelera las lecturas que puedan usarlo y encarece **todas** las escrituras, porque hay que mantenerlo. Y muchos ya están: las claves primarias y los `UNIQUE` traen el suyo. Los que no están son los de las claves ajenas, y esos sí suelen hacer falta.",
    },
  ],
  pistas: [
    pista("Tres son verdad. Las tres falsas dicen que algo es más simple de lo que es.", 0),
    pista("Dos de las falsas hablan de nulos, desde lados distintos: una de contarlos y otra de compararlos.", 1),
    pista("Y la tercera es la que dice «no tiene ningún coste». Cuando una frase sobre bases de datos dice que algo sale gratis, sospecha.", 2),
  ],
  recompensa: { croquetas: 7 },
}
