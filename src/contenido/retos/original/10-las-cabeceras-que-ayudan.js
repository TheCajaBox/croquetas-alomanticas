import { codigo, pista } from '../comun.js'

export default {
  id: "original-10-las-cabeceras-que-ayudan",
  mundo: "original",
  entorno: "worker",
  tipo: "codigo",
  titulo: "Las cabeceras que ayudan",
  enunciado: codigo(
    "Una respuesta HTTP lleva **cabeceras**, y unas cuantas le dicen al navegador que se ponga",
    "estricto. Son la red de debajo: no arreglan un agujero, encarecen aprovecharlo.",
    "",
    "Escribe `cabecerasDe(html)`, que devuelva el objeto de cabeceras de una respuesta de",
    "página. Tiene que llevar exactamente estas:",
    "",
    "| cabecera | valor | para qué |",
    "|---|---|---|",
    "| `Content-Type` | `text/html; charset=utf-8` | que el navegador no adivine el tipo |",
    "| `Content-Security-Policy` | `default-src 'self'` | que solo cargue y ejecute de tu sitio |",
    "| `X-Content-Type-Options` | `nosniff` | que no adivine tampoco por el contenido |",
    "| `Strict-Transport-Security` | `max-age=31536000` | que no vuelva a entrar sin cifrar |",
    "| `Referrer-Policy` | `strict-origin-when-cross-origin` | que no le cuente a otros de dónde vienes |",
    "| `Content-Length` | el largo del html, como texto | |",
    "",
    "Y **no** puede llevar `Server` ni `X-Powered-By`: dicen qué programa y qué versión estás",
    "usando, y con la versión se busca la lista de sus agujeros conocidos.",
  ),
  inicial: codigo(
    "function cabecerasDe(html) {",
    "  return {",
    "    'Content-Type': 'text/html',",
    "    'Content-Length': String(html.length),",
    "    Server: 'servidor-de-sel/2.4.1',",
    "    'X-Powered-By': 'Sel/8.5',",
    "  }",
    "}",
  ),
  solucion: codigo(
    "function cabecerasDe(html) {",
    "  return {",
    "    'Content-Type': 'text/html; charset=utf-8',",
    "    'Content-Security-Policy': \"default-src 'self'\",",
    "    'X-Content-Type-Options': 'nosniff',",
    "    'Strict-Transport-Security': 'max-age=31536000',",
    "    'Referrer-Policy': 'strict-origin-when-cross-origin',",
    "    'Content-Length': String(html.length),",
    "  }",
    "}",
  ),
  requisitos: [
    { tipo: "prohibePropiedad", valor: "Server", texto: "La cabecera `Server` cuenta qué programa y qué versión usas" },
    { tipo: "prohibePropiedad", valor: "X-Powered-By", texto: "Y esta, lo mismo" },
  ],
  tests: [
    {
      nombre: "el tipo de contenido dice también la codificación",
      codigo: "esperar(cabecerasDe('<p>hola</p>')['Content-Type'], 'el tipo').igualA('text/html; charset=utf-8')",
    },
    {
      nombre: "la política de contenidos está y solo admite el propio sitio",
      codigo: "esperar(cabecerasDe('x')['Content-Security-Policy'], 'la política').igualA(\"default-src 'self'\")",
    },
    {
      nombre: "el navegador no adivina el tipo por el contenido",
      codigo: "esperar(cabecerasDe('x')['X-Content-Type-Options'], 'nosniff').igualA('nosniff')",
    },
    {
      nombre: "y no vuelve a entrar sin cifrar durante un año",
      codigo: "esperar(cabecerasDe('x')['Strict-Transport-Security'], 'hsts').igualA('max-age=31536000')",
    },
    {
      nombre: "ni le cuenta a otros sitios de dónde vienes",
      codigo: "esperar(cabecerasDe('x')['Referrer-Policy'], 'la política').igualA('strict-origin-when-cross-origin')",
    },
    {
      nombre: "el largo es el del html, y va como texto",
      codigo: codigo(
        "esperar(cabecerasDe('<p>hola</p>')['Content-Length'], 'el largo').igualA('11')",
        "esperar(cabecerasDe('')['Content-Length'], 'el largo del vacío').igualA('0')",
      ),
    },
    {
      nombre: "el ataque de la huella: no se dice qué programa ni qué versión",
      codigo: codigo(
        "const todas = cabecerasDe('x')",
        "esperar(Object.keys(todas), 'las claves').noContiene('Server')",
        "esperar(Object.keys(todas), 'las claves').noContiene('X-Powered-By')",
        "esperar(JSON.stringify(todas), 'las cabeceras').noContiene('8.5')",
        "esperar(JSON.stringify(todas), 'las cabeceras').noContiene('2.4.1')",
      ),
    },
    {
      nombre: "y son exactamente seis, sin nada de más",
      codigo: "esperar(Object.keys(cabecerasDe('x')), 'las claves').tieneLongitud(6)",
    },
  ],
  variantes: [
    {
      titulo: "Las cabeceras que ayudan · otra tanda",
      tests: [
        {
          nombre: "con una página larga, el largo cuadra",
          codigo: codigo(
            "const html = '<p>' + 'a'.repeat(500) + '</p>'",
            "esperar(cabecerasDe(html)['Content-Length'], 'el largo').igualA(String(html.length))",
          ),
        },
        {
          nombre: "las cinco cabeceras de seguridad siguen ahí",
          codigo: codigo(
            "const todas = cabecerasDe('x')",
            "for (const cual of [",
            "  'Content-Type',",
            "  'Content-Security-Policy',",
            "  'X-Content-Type-Options',",
            "  'Strict-Transport-Security',",
            "  'Referrer-Policy',",
            "]) {",
            "  esperar(todas[cual], cual).existe()",
            "}",
          ),
        },
        {
          nombre: "el ataque de la huella, otra vez",
          codigo: codigo(
            "const claves = Object.keys(cabecerasDe('x')).map((cada) => cada.toLowerCase())",
            "esperar(claves, 'las claves').noContiene('server')",
            "esperar(claves, 'las claves').noContiene('x-powered-by')",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Es un objeto con seis claves. Cuatro son nuevas, una se corrige y dos se van.", 0),
    pista(
      "Las claves llevan guiones, así que van entre comillas. Y el valor de la política de contenidos lleva comillas simples dentro: rodéalo de dobles.",
      1,
    ),
    pista(
      "`Content-Length` es el largo del texto **como texto**, no como número: `String(html.length)`. Y el `Content-Type` que ya estaba se queda corto: le falta la codificación.",
      2,
    ),
  ],
  recompensa: { croquetas: 7 },
}
