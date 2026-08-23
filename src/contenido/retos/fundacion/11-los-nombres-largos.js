import { codigo, pista } from '../comun.js'

export default {
  id: "fundacion-11-los-nombres-largos",
  mundo: "fundacion",
  entorno: "php",
  tipo: "emparejar",
  titulo: "Los nombres con barras",
  enunciado: codigo(
    "Todo el PHP moderno está lleno de nombres largos con barras invertidas:",
    "`Symfony\\Component\\HttpFoundation\\Request`. No es adorno y no es difícil: son",
    "**apellidos**.",
    "",
    "Sin ellos, dos librerías que las dos llamen `Logger` a su clase no se pueden usar en el",
    "mismo programa: la segunda que se cargue choca con la primera. Un `namespace` es el",
    "apellido que las distingue, y el `use` de arriba de cada fichero es la forma de escribir",
    "el nombre corto sin perder el apellido.",
    "",
    "Empareja cada trozo con lo que hace.",
  ),
  parejas: [
    {
      izquierda: "namespace Cuadrilla\\Metales;",
      derecha: "El apellido de todo lo que se declare en este fichero. Va en la primera línea.",
    },
    {
      izquierda: "use Cuadrilla\\Metales\\Saco;",
      derecha: "Permite escribir `Saco` a secas en este fichero, refiriéndose a esa clase concreta.",
    },
    {
      izquierda: "new \\Cuadrilla\\Metales\\Saco()",
      derecha: "El nombre completo desde la raíz. Funciona sin `use`, y es largo de escribir.",
    },
    {
      izquierda: "use Cuadrilla\\Metales\\Saco as SacoDeMetal;",
      derecha: "Lo mismo, con otro nombre corto: para cuando dos apellidos distintos traen el mismo nombre.",
    },
    {
      izquierda: "composer dump-autoload",
      derecha: "Rehace la tabla que dice en qué fichero vive cada clase. Sin ella, PHP no las encuentra solas.",
    },
    {
      izquierda: "spl_autoload_register(...)",
      derecha: "Le dice a PHP qué hacer cuando le piden una clase que no está cargada: es la costura por debajo del autoload.",
    },
  ],
  explicacion: codigo(
    "Lo que hay que llevarse, y son tres frases:",
    "",
    "- **El `namespace` es el apellido y va en la primera línea del fichero.** Por convención",
    "  copia la estructura de carpetas, y por eso PHP puede adivinar en qué fichero está cada",
    "  clase.",
    "- **El `use` no carga nada**: solo dice «cuando escriba `Saco`, me refiero a este». Es",
    "  como el `import` de otros lenguajes en la cara y no en el fondo.",
    "- **El autoload es lo que carga.** La primera vez que se menciona una clase, PHP le",
    "  pregunta al autoload en qué fichero está y lo incluye. De ahí que en PHP moderno no",
    "  haya un solo `require` a la vista: los pone Composer por debajo.",
    "",
    "El error que se ve mil veces —`Class \"X\" not found`— casi nunca es que la clase no exista:",
    "es que el nombre que escribiste no coincide con su apellido, o que falta un `use`, o que",
    "el autoload no se ha rehecho.",
  ),
  pistas: [
    pista("Dos de los seis van de escribir el nombre corto en vez del largo; uno de ellos además le cambia el nombre.", 0),
    pista("Solo uno de los seis declara el apellido; los demás lo usan o lo resuelven.", 1),
    pista("Los dos últimos no son sintaxis del lenguaje: son las dos piezas que hacen que las clases se encuentren solas.", 2),
  ],
  recompensa: { croquetas: 7 },
}
