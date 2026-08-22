import { codigo, pista } from '../comun.js'

export default {
  id: "tripulacion-06-el-orden-de-los-parametros",
  mundo: "tripulacion",
  entorno: "php",
  tipo: "eleccion",
  titulo: "El parámetro que estorba",
  enunciado: codigo(
    "Los valores por defecto tienen una regla de colocación, y es la que más despista al",
    "empezar. Aquí no se escribe: se mira y se decide.",
  ),
  pregunta: codigo(
    "```php",
    "function informe(string $titulo = 'Informe', array $lineas)",
    "{",
    "    // ...",
    "}",
    "```",
    "",
    "¿Qué pasa con esta función?",
  ),
  opciones: [
    {
      texto:
        "PHP avisa: un parámetro con valor por defecto **antes** de uno obligatorio no puede usar su defecto nunca, así que lo trata como obligatorio.",
      correcta: true,
      porque:
        "Eso es. Los argumentos se pasan por posición, así que para omitir `$titulo` habría que omitir también todo lo que va detrás — y `$lineas` es obligatorio. El defecto es inalcanzable, PHP lo dice con un aviso de obsolescencia y exige los dos. La regla: **los parámetros con defecto van al final**.",
    },
    {
      texto: "Nada raro: se puede llamar `informe(['a', 'b'])` y `$titulo` tomará su valor por defecto.",
      porque:
        "Ese es el error de intuición. PHP no adivina a qué parámetro va cada argumento por su tipo: el primero que pasas es el primero de la lista, siempre. Ese array iría a `$titulo`, que está declarado `string`.",
    },
    {
      texto: "Es un error de sintaxis y el fichero no se puede ni leer.",
      porque:
        "No llega a tanto: el fichero se analiza bien y la función se declara. Es un problema de diseño de la firma, no de gramática, y por eso avisa en vez de reventar — que es peor, porque los avisos se ignoran.",
    },
    {
      texto: "Funciona, y `$lineas` toma un array vacío por defecto al ser de tipo `array`.",
      porque:
        "Los tipos no traen valores por defecto consigo. Un parámetro sin `= algo` es obligatorio, sea del tipo que sea; si quieres que empiece vacío hay que escribir `array $lineas = []`.",
    },
  ],
  pistas: [
    pista("Pregúntate cómo llamarías a esa función pasando solo lo segundo y no lo primero.", 0),
    pista("Los argumentos van por posición: el primero que escribes es el primero de la firma. No hay forma de saltarse uno de en medio.", 1),
    pista("Si el valor por defecto no se puede usar nunca, no sirve de nada. PHP lo dice, y lo dice avisando en vez de fallando.", 2),
  ],
  recompensa: { croquetas: 5 },
}
