import { codigo, pista } from '../comun.js'

export default {
  id: "pozo-04-el-hueco-en-las-claves",
  mundo: "pozo",
  entorno: "php",
  tipo: "eleccion",
  titulo: "El hueco que deja el filtro",
  enunciado: codigo(
    "Este código parece correcto y falla, y falla de la peor manera: avisando por lo bajo y",
    "siguiendo adelante. Aquí no se escribe nada: se mira y se decide.",
  ),
  pregunta: codigo(
    "```php",
    "$sacos = [0, 3, 5];",
    "$llenos = array_filter($sacos, fn($saco) => $saco > 0);",
    "echo $llenos[0];",
    "```",
    "",
    "En vez de imprimir `3`, PHP avisa de que la clave `0` no existe. ¿Por qué?",
  ),
  opciones: [
    {
      texto: "Porque `array_filter` conserva la clave que cada elemento tenía: el `3` estaba en la 1 y sigue en la 1.",
      correcta: true,
      porque:
        "Eso es. El filtro decide qué elementos se quedan, no en qué posición van. El `0` estaba en la clave 0 y se ha caído, así que el resultado tiene las claves 1 y 2. `array_values` las renumera.",
    },
    {
      texto: "Porque `array_filter` devuelve las claves en orden inverso.",
      porque: "No las toca en absoluto: las conserva tal cual, en el mismo orden. Lo que pasa es que faltan las de los elementos descartados.",
    },
    {
      texto: "Porque hay que pasarle la lista primero y la función después.",
      porque:
        "El orden de los argumentos de `array_filter` es justo ese -lista, función-, al contrario que en `array_map`. Es confuso, pero aquí está bien puesto y no es la causa.",
    },
    {
      texto: "Porque `array_filter` devuelve un array asociativo y hay que leerlo con `$llenos['0']`.",
      porque:
        "En PHP la clave `'0'` en texto y la clave `0` en número son la misma, así que eso no cambiaría nada. El problema es que esa clave no está.",
    },
  ],
  explicacion: codigo(
    "Es el fallo más repetido con `array_filter`, y no revienta: solo avisa y sigue con",
    "`null`, así que se cuela hasta producción.",
    "",
    "La regla corta: **si el resultado se va a leer por posición, envuélvelo en**",
    "`array_values`. Si se va a recorrer con `foreach` o contar con `count`, da igual.",
  ),
  pistas: [
    pista("Imagina la lista con sus claves escritas: `0 => 0`, `1 => 3`, `2 => 5`. ¿Qué sobrevive al filtro y con qué clave?", 0),
    pista("Prueba el código con `var_dump($llenos)` en vez de `echo`: la salida enseña las claves.", 1),
    pista("El elemento que se cae es el primero, el de la clave 0. Los que quedan conservan las suyas: 1 y 2.", 2),
  ],
  recompensa: { croquetas: 5 },
}
