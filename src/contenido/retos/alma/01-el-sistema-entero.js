import { codigo, pista } from '../comun.js'

export default {
  id: "alma-01-el-sistema-entero",
  mundo: "alma",
  entorno: "worker",
  tipo: "eleccion",
  titulo: "El sistema entero",
  enunciado: codigo(
    "Un sistema con las cinco cosas de los cinco mundos, y todas bien:",
    "",
    "- las contraseñas con hash lento y sal, y la comparación en tiempo constante;",
    "- toda la entrada validada con listas de lo permitido, y escapada al pintarla;",
    "- todas las consultas parametrizadas;",
    "- los permisos leídos de la fuente que manda, y denegando por omisión;",
    "- los papeles firmados, con secreto de fuera y caducidad de diez minutos.",
    "",
    "Y hay un agujero. **Siempre** hay uno, y este mundo va de encontrarlo.",
    "",
    "¿Por dónde se empieza a buscar?",
  ),
  pregunta: "Cinco defensas y todas bien puestas. ¿Por dónde se busca el agujero?",
  opciones: [
    {
      texto: "Por las **costuras**: lo que pasa entre una defensa y la siguiente, y lo que ninguna de las cinco cubre.",
      correcta: true,
      porque:
        "Cada defensa cubre su trozo y nadie cubre el hueco entre dos. Los ejemplos son siempre del mismo tipo: la validación aprueba un valor y el que se usa es otro; el permiso se comprueba sobre un dato y la acción se hace sobre otro; el papel se descodifica en un sitio y se verifica en otro. Y luego está lo que ninguna cubre: el orden de las comprobaciones, la recuperación de contraseña, el registro que escribe de más.",
    },
    {
      texto: "Repasando cada defensa con más cuidado: una de las cinco estará mal hecha.",
      correcta: false,
      porque:
        "Puede estarlo, y es lo primero que uno mira, y es donde menos se encuentra: una defensa mal hecha suele fallar en las pruebas o llamar la atención en una revisión. Lo que sobrevive años es lo que está bien hecho **en el sitio equivocado**, o bien hecho dos veces sobre datos distintos.",
    },
    {
      texto: "Por lo más nuevo: lo último que se ha escrito es lo menos revisado.",
      correcta: false,
      porque:
        "Es un buen sitio y no es la respuesta general. Lo más nuevo se revisa menos y también se escribe con las costumbres ya aprendidas; el código viejo tiene defensas de otra época y nadie se atreve a tocarlo. Buscar por antigüedad no dice nada por sí solo.",
    },
    {
      texto: "Por las dependencias: la mitad del código no lo has escrito tú.",
      correcta: false,
      porque:
        "Es verdad, es del mundo anterior y no es donde se empieza cuando el sistema es tuyo. Una dependencia con un problema conocido se encuentra con una herramienta que lee el fichero de bloqueo; las costuras de tu propio código no las encuentra ninguna herramienta.",
    },
  ],
  pistas: [
    pista("Las cinco defensas están bien. Así que el agujero no está **en** ninguna de ellas.", 0),
    pista(
      "Piensa en los tres retos de este camino que no tenían ningún error: el registro que escribía la clave, la validación que aprobaba una variable y usaba otra, el permiso comprobado sobre un dueño declarado.",
      1,
    ),
    pista(
      "Los tres se parecen: en los tres, cada pieza estaba bien y lo que falló fue **la unión entre dos**. Eso tiene nombre y es por donde se empieza.",
      2,
    ),
  ],
  recompensa: { croquetas: 5 },
}
