/**
 * El apunte de Wax para «vue3-07-composable».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Un **composable** es una función normal y corriente que crea estado reactivo y lo",
    "devuelve. No hay palabra clave nueva ni magia:",
    "",
    "```js",
    "function usarColonia(iniciales = []) {",
    "  const gatos = ref([...iniciales])",
    "  const cuantos = computed(() => gatos.value.length)",
    "  const adoptar = (nombre) => gatos.value.push(nombre)",
    "",
    "  return { gatos, cuantos, adoptar }",
    "}",
    "```",
    "",
    "Por costumbre se llaman `usarAlgo` (`useSomething` en inglés).",
    "",
    "Y como es una función, **cada llamada crea su propio estado**. Dos componentes que",
    "llamen al mismo composable no comparten nada: cada uno con lo suyo, como dos",
    "refugios con su propio libro de registro. Si alguna vez quieres lo contrario",
    "—estado compartido—, basta con sacar los `ref` fuera de la función.",
    "",
    "Una trampa que cuesta ver: `ref(iniciales)` guarda **la misma lista** que te",
    "pasaron, y al modificarla se la estás cambiando por la espalda a quien te la dio.",
    "Cópiala: `ref([...iniciales])`. Nunca escribas en el libro de otro.",
    "",
    "Esto es lo que sustituye a los *mixins* de Vue 2, y con ventaja: aquí se ve de",
    "dónde sale cada cosa.",
)
