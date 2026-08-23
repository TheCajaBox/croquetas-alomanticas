import { codigo, pista } from '../comun.js'

export default {
  id: "original-03-seis-frases-sobre-firmas",
  mundo: "original",
  entorno: "worker",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre firmas y secretos",
  enunciado: codigo(
    "Seis frases. Las cuatro falsas son confusiones concretas que llevan a decisiones malas.",
    "Marca cada una.",
  ),
  afirmaciones: [
    {
      texto: "Firmar protege de que lo cambien; cifrar protege de que lo lean.",
      verdadera: true,
      porque:
        "Es la distinción del mundo, y la que hay que tener siempre a mano. Un papel firmado se lee sin ningún secreto: si dentro hay algo que no debería verse, firmarlo no lo esconde. Y al revés: algo cifrado puede modificarse a ciegas si no va firmado además, y en algunos modos de cifrado eso permite cambiar el contenido de forma controlada.",
    },
    {
      texto: "Codificar en base64 es una forma ligera de cifrar.",
      verdadera: false,
      porque:
        "No cifra nada: es una manera de escribir bytes con letras y números, para que pasen por sitios que solo admiten texto. Se deshace sin secreto, con una función que se llama igual al revés. Cada vez que alguien dice «va en base64, así que está protegido», hay un dato en claro que cualquiera lee.",
    },
    {
      texto: "Si el papel viene firmado, ya no hace falta que caduque.",
      verdadera: false,
      porque:
        "La firma dice que el papel es auténtico, no que siga siendo válido. Un papel robado tiene la firma perfectamente correcta y valdría para siempre. Y hay un problema añadido: un papel firmado que el servidor no guarda **no se puede revocar** —no hay dónde tacharlo— así que lo único que lo mata es la caducidad, y por eso tiene que ser corta.",
    },
    {
      texto: "`Math.random()` sirve para generar un identificador de sesión si se llama varias veces.",
      verdadera: false,
      porque:
        "No, y llamarla más veces no arregla nada: el problema es que su serie es **predecible**. Está hecha para repartir cosas, no para guardar secretos: dado un puñado de valores se puede deducir su estado interno y calcular los siguientes. Para un secreto hace falta el generador criptográfico, que es otra función y está a mano.",
    },
    {
      texto: "Un secreto que se ha subido al repositorio y se ha borrado en el commit siguiente sigue comprometido.",
      verdadera: true,
      porque:
        "El historial de git lo guarda todo: sigue ahí, en el commit anterior, y en cada copia que alguien tenga del repositorio. Y si el repositorio fue público un rato, hay rastreadores automáticos que lo encontraron en minutos. La única respuesta a un secreto filtrado es **rotarlo**: cambiarlo por otro.",
    },
    {
      texto: "Fijar las versiones exactas de las dependencias evita que te cambien el código por debajo.",
      verdadera: false,
      porque:
        "Fijar la versión evita que **cambie sola** al instalar, y eso hace falta. Lo que no evita es que la versión que fijaste tuviera un problema, ni que alguien publique una versión nueva con código malo que instalarás en la próxima actualización. Para lo primero hay que revisar avisos; para asegurar que el contenido de esa versión es el que era, están las sumas de comprobación del fichero de bloqueo.",
    },
  ],
  pistas: [
    pista("Dos son verdad. Las cuatro falsas confunden dos cosas, o creen que una defensa cubre más de lo que cubre.", 0),
    pista(
      "Dos de las falsas hablan de esconder algo que no está escondido: una codificación y un papel firmado.",
      1,
    ),
    pista(
      "La del azar es la más técnica: la pregunta no es cuántas veces se llama, es si la serie se puede predecir.",
      2,
    ),
  ],
  recompensa: { croquetas: 5 },
}
