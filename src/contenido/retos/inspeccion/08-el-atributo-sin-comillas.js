import { codigo, pista } from '../comun.js'

export default {
  id: "inspeccion-08-el-atributo-sin-comillas",
  mundo: "inspeccion",
  entorno: "worker",
  tipo: "bug",
  titulo: "El atributo sin comillas",
  enunciado: codigo(
    "`tarjeta` pinta el nombre de un usuario en dos sitios: dentro de un párrafo y dentro de",
    "un atributo `title`. Y **escapa** en los dos, con la función del reto cinco.",
    "",
    "Y aun así se le puede colar código. El párrafo está a salvo; el atributo no, porque le",
    "faltan las comillas.",
    "",
    "Arréglalo. `escaparHtml` está dada y funciona: no la toques.",
  ),
  inicial: codigo(
    "// Dado. No lo toques.",
    "function escaparHtml(texto) {",
    "  return texto",
    "    .replaceAll('&', '&amp;')",
    "    .replaceAll('<', '&lt;')",
    "    .replaceAll('>', '&gt;')",
    "    .replaceAll('\"', '&quot;')",
    "    .replaceAll(\"'\", '&#39;')",
    "}",
    "",
    "// Tu parte.",
    "function tarjeta(nombre) {",
    "  const limpio = escaparHtml(nombre)",
    "  return '<p title=' + limpio + '>' + limpio + '</p>'",
    "}",
  ),
  solucion: codigo(
    "// Dado. No lo toques.",
    "function escaparHtml(texto) {",
    "  return texto",
    "    .replaceAll('&', '&amp;')",
    "    .replaceAll('<', '&lt;')",
    "    .replaceAll('>', '&gt;')",
    "    .replaceAll('\"', '&quot;')",
    "    .replaceAll(\"'\", '&#39;')",
    "}",
    "",
    "// Tu parte.",
    "function tarjeta(nombre) {",
    "  const limpio = escaparHtml(nombre)",
    "  return '<p title=\"' + limpio + '\">' + limpio + '</p>'",
    "}",
  ),
  requisitos: [
    { tipo: "usaLlamada", valor: "escaparHtml", texto: "El nombre se sigue escapando antes de pintarlo" },
  ],
  tests: [
    {
      nombre: "un nombre normal se pinta en los dos sitios",
      codigo: codigo(
        "const html = tarjeta('Gaotona')",
        "esperar(html, 'el html').igualA('<p title=\"Gaotona\">Gaotona</p>')",
      ),
    },
    {
      nombre: "el atributo va entre comillas dobles",
      codigo: "esperar(tarjeta('Shai'), 'el html').contiene('title=\"Shai\"')",
    },
    {
      nombre: "el ataque: un espacio ya no añade otro atributo",
      codigo: codigo(
        "const html = tarjeta('x onmouseover=robar()')",
        "esperar(html, 'el html').noContiene('title=x onmouseover')",
        "esperar(html, 'el html').contiene('title=\"x onmouseover=robar()\"')",
      ),
    },
    {
      nombre: "el ataque: cerrar la etiqueta desde dentro del atributo tampoco",
      codigo: codigo(
        "const html = tarjeta('x><img src=y onerror=robar()>')",
        "esperar(html, 'el html').noContiene('<img')",
      ),
    },
    {
      nombre: "una comilla dentro del nombre no rompe el atributo",
      codigo: codigo(
        "const html = tarjeta('El \"Yunque\"')",
        "esperar(html, 'el html').contiene('title=\"El &quot;Yunque&quot;\"')",
      ),
    },
    {
      nombre: "y sigue habiendo exactamente una etiqueta de párrafo",
      codigo: codigo(
        "const html = tarjeta('x><p>otro')",
        "esperar(html.split('<p').length - 1, 'cuántos párrafos').igualA(1)",
      ),
    },
    {
      nombre: "un nombre con ampersand se pinta bien en los dos sitios",
      codigo: codigo(
        "const html = tarjeta('Muñoz & Cía')",
        "esperar(html, 'el html').igualA('<p title=\"Muñoz &amp; Cía\">Muñoz &amp; Cía</p>')",
      ),
    },
  ],
  variantes: [
    {
      titulo: "El atributo sin comillas · otra tanda",
      tests: [
        {
          nombre: "el ataque del atributo autofocus, que dispara sin tocar nada",
          codigo: codigo(
            "const html = tarjeta('x autofocus onfocus=robar()')",
            "esperar(html, 'el html').contiene('title=\"x autofocus onfocus=robar()\"')",
          ),
        },
        {
          nombre: "el ataque con un tabulador en vez de un espacio",
          codigo: codigo(
            "const html = tarjeta('x\\tonmouseover=robar()')",
            "esperar(html, 'el html').noContiene('title=x')",
          ),
        },
        {
          nombre: "un nombre con comilla simple tampoco rompe nada",
          codigo: codigo(
            "const html = tarjeta(\"L'Hospitalet\")",
            "esperar(html, 'el html').contiene('title=\"L&#39;Hospitalet\"')",
          ),
        },
        {
          nombre: "y el nombre vacío da una tarjeta vacía y bien formada",
          codigo: "esperar(tarjeta(''), 'el html').igualA('<p title=\"\"></p>')",
        },
      ],
    },
  ],
  pistas: [
    pista("Sobran cero líneas y faltan dos caracteres.", 0),
    pista(
      "Compara los dos sitios donde se pinta `limpio`. Uno está rodeado de algo que el otro no tiene.",
      1,
    ),
    pista(
      "Un atributo sin comillas termina en el primer espacio. Con comillas, el espacio es parte del valor y ya no separa nada. Y ojo: las comillas del atributo tienen que ir **dentro** de la cadena de JavaScript.",
      2,
    ),
  ],
  recompensa: { croquetas: 7 },
}
