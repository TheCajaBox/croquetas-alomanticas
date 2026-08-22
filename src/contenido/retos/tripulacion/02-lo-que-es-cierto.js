import { codigo, pista } from '../comun.js'

export default {
  id: "tripulacion-02-lo-que-es-cierto",
  mundo: "tripulacion",
  entorno: "php",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre condiciones",
  enunciado: codigo(
    "Un `if` no pregunta «¿es `true`?». Pregunta «¿esto cuenta como cierto?», y PHP tiene su",
    "propia lista de lo que no cuenta. Saberla de memoria evita una familia entera de fallos.",
    "",
    "Seis frases. Márcalas todas y luego lee el porqué de cada una.",
  ),
  afirmaciones: [
    {
      texto: "`if ('0')` **no** entra: el texto `'0'` cuenta como falso.",
      verdadera: true,
      porque:
        "Es la excepción que hay que memorizar. Todos los textos cuentan como ciertos menos dos: el vacío `''` y el que contiene exactamente un cero, `'0'`. Con datos que llegan de un formulario —donde todo llega como texto— eso muerde de verdad.",
    },
    {
      texto: "`if ('0.0')` tampoco entra, por el mismo motivo.",
      porque:
        "Sí entra. La excepción es literalmente el texto `'0'`, no «cualquier texto que parezca cero». `'0.0'`, `'00'` y `' 0'` cuentan como ciertos. Cuando algo depende de esto, el arreglo no es aprenderse la lista: es comparar con `=== '0'` o convertir a número a propósito.",
    },
    {
      texto: "`if ([])` no entra, y `if ([0])` sí.",
      verdadera: true,
      porque:
        "Un array cuenta como falso solo si está vacío. Uno con un cero dentro tiene un elemento, así que cuenta como cierto. Para preguntar «¿hay algo aquí?», `count($lista) > 0` dice lo que quieres decir y no depende de recordar esto.",
    },
    {
      texto: "En `false && comprobar()`, la función `comprobar()` no llega a ejecutarse.",
      verdadera: true,
      porque:
        "Se llama cortocircuito: con `&&`, si la izquierda ya es falsa el resultado no puede cambiar, así que PHP no evalúa la derecha. Con `||` pasa al revés. Se aprovecha a propósito: `if (isset($a) && $a->vale())` es seguro justo por esto.",
    },
    {
      texto: "`if ($x = 5)` es un error de sintaxis, porque ahí quería poner `==`.",
      porque:
        "Ojalá. Es código perfectamente válido: asigna 5 a `$x` y luego pregunta si 5 cuenta como cierto, que sí. Así que entra **siempre** y además te ha cambiado la variable. Es el fallo tipográfico más caro que hay, y no avisa.",
    },
    {
      texto: "`elseif` y dos `if` seguidos hacen lo mismo.",
      porque:
        "Solo cuando las condiciones no se solapan. Con `if` y `if`, las dos se miran siempre; con `if` y `elseif`, la segunda solo se mira si la primera falló. En tramos como «mayor que 100 / mayor que 20» eso lo cambia todo, y ahí es donde se nota.",
    },
  ],
  pistas: [
    pista("Dos de las seis van de qué textos cuentan como falsos. Solo hay dos, y una de las frases se inventa un tercero.", 0),
    pista("Una habla de un `=` donde debería haber un `==`. Piensa si eso es un error del lenguaje o un programa válido que hace otra cosa.", 1),
    pista("La última va de si `elseif` es un adorno. Prueba a imaginar el número 500 pasando por dos `if` que preguntan «>100» y «>20».", 2),
  ],
  recompensa: { croquetas: 7 },
}
