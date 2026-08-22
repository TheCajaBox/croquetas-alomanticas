import { codigo, pista } from '../comun.js'

export default {
  id: "ceniza-06-los-tipos",
  mundo: "ceniza",
  entorno: "php",
  tipo: "emparejar",
  titulo: "De qué tipo es cada cosa",
  enunciado: codigo(
    "Todo valor en PHP es de un tipo, y el tipo decide lo que se puede hacer con él.",
    "Son pocos y conviene sabérselos de memoria: la mitad de los errores raros vienen de",
    "creer que algo era de un tipo y era de otro.",
    "",
    "`get_debug_type($valor)` te dice de qué tipo es algo. Empareja cada valor con lo que",
    "diría de él.",
  ),
  parejas: [
    { izquierda: "42", derecha: "int — un número entero" },
    { izquierda: "3.5", derecha: "float — un número con decimales" },
    { izquierda: "'42'", derecha: "string — un texto, aunque por dentro parezca un número" },
    { izquierda: "true", derecha: "bool — verdadero o falso, no hay más opciones" },
    { izquierda: "['a', 'b']", derecha: "array — una lista de valores" },
    { izquierda: "null", derecha: "null — no es un valor: es la ausencia de valor" },
  ],
  pistas: [
    pista("Fíjate en las comillas. `42` y `'42'` no son lo mismo, y esa es media lección.", 0),
    pista("`3.5` no es un entero: en cuanto hay un punto decimal, PHP lo llama de otra manera.", 1),
    pista("`null` no es cero, ni el texto vacío, ni `false`. Es «aquí no hay nada», y tiene su propio tipo con su propio nombre.", 2),
  ],
  recompensa: { croquetas: 5 },
}
