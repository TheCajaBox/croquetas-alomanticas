import { codigo, pista } from '../comun.js'

export default {
  id: "inspeccion-05-escapar-para-html",
  mundo: "inspeccion",
  entorno: "worker",
  tipo: "codigo",
  titulo: "Escapar para HTML",
  enunciado: codigo(
    "Un nombre válido puede llevar cosas que en HTML significan algo: `Muñoz & Cía`,",
    "`\"El Yunque\"`, `a < b`. Y un nombre puede llevar `<script>`, porque el que lo escribe",
    "no siempre es un cliente.",
    "",
    "Escribe `escaparHtml(texto)` que sustituya los **cinco** caracteres que hay que",
    "sustituir:",
    "",
    "| carácter | se convierte en |",
    "|---|---|",
    "| `&` | `&amp;` |",
    "| `<` | `&lt;` |",
    "| `>` | `&gt;` |",
    "| `\"` | `&quot;` |",
    "| `'` | `&#39;` |",
    "",
    "**El orden importa.** Si sustituyes `&` al final, te comerás los `&` que tú mismo",
    "acabas de escribir y saldrá `&amp;lt;` donde debía salir `&lt;`.",
  ),
  inicial: codigo(
    "function escaparHtml(texto) {",
    "  return texto.replaceAll('<', '&lt;').replaceAll('>', '&gt;')",
    "}",
  ),
  solucion: codigo(
    "function escaparHtml(texto) {",
    "  return texto",
    "    .replaceAll('&', '&amp;')",
    "    .replaceAll('<', '&lt;')",
    "    .replaceAll('>', '&gt;')",
    "    .replaceAll('\"', '&quot;')",
    "    .replaceAll(\"'\", '&#39;')",
    "}",
  ),
  requisitos: [
    { tipo: "usaLlamada", valor: "replaceAll", texto: "Se sustituyen todas las apariciones, no la primera" },
  ],
  tests: [
    {
      nombre: "un texto sin nada especial sale igual",
      codigo: "esperar(escaparHtml('Gaotona'), 'el texto').igualA('Gaotona')",
    },
    {
      nombre: "el ampersand se escapa",
      codigo: "esperar(escaparHtml('Muñoz & Cía'), 'el texto').igualA('Muñoz &amp; Cía')",
    },
    {
      nombre: "los menores y mayores, también",
      codigo: "esperar(escaparHtml('a < b > c'), 'el texto').igualA('a &lt; b &gt; c')",
    },
    {
      nombre: "las comillas dobles",
      codigo: "esperar(escaparHtml('El \"Yunque\"'), 'el texto').igualA('El &quot;Yunque&quot;')",
    },
    {
      nombre: "y las simples, que hacen falta para los atributos",
      codigo: "esperar(escaparHtml(\"L'Hospitalet\"), 'el texto').igualA('L&#39;Hospitalet')",
    },
    {
      nombre: "el ataque: una etiqueta de script no sale como etiqueta",
      codigo: codigo(
        "const salida = escaparHtml('<script>robar()</script>')",
        "esperar(salida, 'la salida').noContiene('<script')",
        "esperar(salida, 'la salida').igualA('&lt;script&gt;robar()&lt;/script&gt;')",
      ),
    },
    {
      nombre: "el orden es el bueno: un menor escapado no se escapa dos veces",
      codigo: "esperar(escaparHtml('<'), 'el texto').igualA('&lt;')",
    },
    {
      nombre: "y un ampersand que ya venía escrito se escapa una sola vez",
      codigo: "esperar(escaparHtml('&lt;'), 'el texto').igualA('&amp;lt;')",
    },
    {
      nombre: "todas las apariciones, no solo la primera",
      codigo: "esperar(escaparHtml('<<<'), 'el texto').igualA('&lt;&lt;&lt;')",
    },
    {
      nombre: "el texto vacío sale vacío",
      codigo: "esperar(escaparHtml(''), 'el texto').igualA('')",
    },
  ],
  variantes: [
    {
      titulo: "Escapar para HTML · otra tanda",
      tests: [
        {
          nombre: "los cinco de golpe",
          codigo: "esperar(escaparHtml(`&<>\"'`), 'los cinco').igualA('&amp;&lt;&gt;&quot;&#39;')",
        },
        {
          nombre: "el ataque de la imagen con onerror",
          codigo: codigo(
            "const salida = escaparHtml('<img src=x onerror=robar()>')",
            "esperar(salida, 'la salida').noContiene('<img')",
          ),
        },
        {
          nombre: "el ataque de romper un atributo con comillas",
          codigo: codigo(
            "const salida = escaparHtml('\" onmouseover=\"robar()')",
            "esperar(salida, 'la salida').noContiene('\"')",
          ),
        },
        {
          nombre: "y con comillas simples, que es el mismo ataque en otro atributo",
          codigo: codigo(
            "const salida = escaparHtml(\"' onmouseover='robar()\")",
            "esperar(salida, 'la salida').noContiene(\"'\")",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Cinco sustituciones encadenadas, y una de ellas tiene que ir primero.", 0),
    pista(
      "El ampersand aparece en las cinco sustituciones que escribes, así que si lo sustituyes al final te comes tu propio trabajo.",
      1,
    ),
    pista(
      "Encadena los `replaceAll` empezando por el ampersand y siguiendo por el resto en cualquier orden. Ojo con las comillas: para escribir una simple dentro de una cadena, usa comillas dobles alrededor.",
      2,
    ),
  ],
  recompensa: { croquetas: 6 },
}
