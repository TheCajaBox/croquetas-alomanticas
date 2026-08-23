import { codigo, pista } from '../comun.js'

export default {
  id: "inspeccion-10-un-numero-de-verdad",
  mundo: "inspeccion",
  entorno: "worker",
  tipo: "codigo",
  titulo: "Un número de verdad",
  enunciado: codigo(
    "Lo que llega en una petición es **texto**, siempre. Convertirlo a número es la parte",
    "fácil; lo difícil es que lo que sale sea un número que tenga sentido.",
    "",
    "Escribe `paginaPedida(texto)`, que devuelve el número de página si es válido y `null` si",
    "no. Válido significa: **un entero entre 1 y 500**, escrito en decimal, sin ceros delante y sin",
    "nada más alrededor.",
    "",
    "Cuidado con `parseInt`, que se queda con el trozo del principio y tira el resto: para",
    "`parseInt`, `'12abc'` son doce y `'1e3'` es uno.",
  ),
  inicial: codigo(
    "function paginaPedida(texto) {",
    "  const numero = parseInt(texto)",
    "  if (numero > 0) return numero",
    "  return null",
    "}",
  ),
  solucion: codigo(
    "const SOLO_DIGITOS = /^[1-9][0-9]{0,2}$/",
    "",
    "function paginaPedida(texto) {",
    "  if (!SOLO_DIGITOS.test(texto)) return null",
    "  const numero = Number(texto)",
    "  if (numero < 1 || numero > 500) return null",
    "  return numero",
    "}",
  ),
  requisitos: [
    { tipo: "usaLlamada", valor: "test", texto: "Primero se comprueba la **forma** del texto, con una lista de lo permitido" },
    { tipo: "prohibeLlamada", valor: "parseInt", texto: "`parseInt` no vale aquí: se queda con el principio y tira el resto sin avisar" },
  ],
  tests: [
    { nombre: "la página uno", codigo: "esperar(paginaPedida('1'), 'la página').igualA(1)" },
    { nombre: "la cuatrocientos noventa y nueve", codigo: "esperar(paginaPedida('499'), 'la página').igualA(499)" },
    { nombre: "la quinientos, que es el límite y entra", codigo: "esperar(paginaPedida('500'), 'la página').igualA(500)" },
    { nombre: "la quinientos uno ya no", codigo: "esperar(paginaPedida('501'), 'la página').igualA(null)" },
    { nombre: "el cero tampoco", codigo: "esperar(paginaPedida('0'), 'la página').igualA(null)" },
    {
      nombre: "el ataque de parseInt: doce seguido de basura no son doce",
      codigo: "esperar(paginaPedida('12abc'), 'la página').igualA(null)",
    },
    {
      nombre: "el ataque de la notación científica: 1e3 no es uno ni mil",
      codigo: "esperar(paginaPedida('1e3'), 'la página').igualA(null)",
    },
    {
      nombre: "el ataque del hexadecimal",
      codigo: "esperar(paginaPedida('0x10'), 'la página').igualA(null)",
    },
    {
      nombre: "el ataque del negativo con signo",
      codigo: "esperar(paginaPedida('-5'), 'la página').igualA(null)",
    },
    {
      nombre: "el ataque de los espacios alrededor, que Number se traga",
      codigo: "esperar(paginaPedida(' 12 '), 'la página').igualA(null)",
    },
    {
      nombre: "el ataque del más delante, que también se traga",
      codigo: "esperar(paginaPedida('+12'), 'la página').igualA(null)",
    },
    {
      nombre: "el ataque de la cadena vacía, que para Number vale cero",
      codigo: "esperar(paginaPedida(''), 'la página').igualA(null)",
    },
    {
      nombre: "los decimales tampoco son una página",
      codigo: "esperar(paginaPedida('1.5'), 'la página').igualA(null)",
    },
    {
      nombre: "ni un número escrito con ceros delante, que suele venir de otro sitio",
      codigo: "esperar(paginaPedida('007'), 'la página').igualA(null)",
    },
    {
      nombre: "y lo que devuelve es un número, no un texto",
      codigo: "esperar(paginaPedida('42'), 'la página').esDeTipo('number')",
    },
  ],
  variantes: [
    {
      titulo: "Un número de verdad · otra tanda",
      tests: [
        { nombre: "la doscientos cincuenta", codigo: "esperar(paginaPedida('250'), 'la página').igualA(250)" },
        {
          nombre: "el ataque del número gigante",
          codigo: "esperar(paginaPedida('99999999999999999999'), 'la página').igualA(null)",
        },
        {
          nombre: "el ataque del infinito escrito con letras",
          codigo: "esperar(paginaPedida('Infinity'), 'la página').igualA(null)",
        },
        {
          nombre: "el ataque del dígito árabe oriental, que Number sí convierte",
          codigo: "esperar(paginaPedida('١٢'), 'la página').igualA(null)",
        },
        {
          nombre: "el ataque del salto de línea al final",
          codigo: "esperar(paginaPedida('12\\n'), 'la página').igualA(null)",
        },
        {
          nombre: "y la página uno sigue siendo la uno",
          codigo: "esperar(paginaPedida('1'), 'la página').igualA(1)",
        },
      ],
    },
  ],
  pistas: [
    pista("Dos comprobaciones y en este orden: primero la forma del texto, después el rango del número.", 0),
    pista(
      "La forma se comprueba con una lista de lo permitido, anclada por los dos lados: solo dígitos, no muchos, y el primero no puede ser un cero.",
      1,
    ),
    pista(
      "Si el texto pasa la forma, convertirlo ya es seguro y el rango se comprueba con dos comparaciones. Y ojo con dos cosas: un límite de tres dígitos no basta -`999` tiene tres y no es una página-, y `007` no es la forma canónica de escribir un siete: la primera cifra no puede ser cero.",
      2,
    ),
  ],
  recompensa: { croquetas: 7 },
}
