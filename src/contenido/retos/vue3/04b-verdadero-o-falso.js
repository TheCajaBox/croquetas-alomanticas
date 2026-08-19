import { codigo, pista } from '../comun.js'

export default {
  id: "vue3-04b-verdadero-o-falso",
  mundo: "vue3",
  entorno: "vue3",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre refs y vigilantes",
  enunciado: codigo(
    "`ref`, `reactive`, `computed`, `watch` y `watchEffect` son cinco herramientas que se",
    "parecen lo justo para confundirse. Seis frases.",
    "",
    "Marca las seis y corrige. Se explican todas, también las que aciertes.",
  ),
  afirmaciones: [
    {
      texto: "Dentro de `setup` hay que escribir `.value`, pero en la plantilla no.",
      verdadera: true,
      porque: "Sí, y esa asimetría es lo que más despista al principio. La plantilla desenvuelve las refs de primer nivel automáticamente, para que no haya que llenarla de `.value`. En el JavaScript de `setup` no hay magia: una ref es un objeto y el valor está en `.value`.",
    },
    {
      texto: "Si desestructuras un objeto `reactive`, las variables que saques siguen siendo reactivas.",
      porque: "No. `const { balas } = estado` copia el valor de ese momento y corta el vínculo: cambiar `estado.balas` después no mueve `balas`. Para sacar cosas sin perder la reactividad está `toRefs(estado)`, que devuelve refs de verdad.",
    },
    {
      texto: "`watchEffect` se ejecuta una vez nada más crearlo; `watch` no.",
      verdadera: true,
      porque: "Correcto, y es la diferencia práctica entre los dos. `watchEffect` corre inmediatamente —necesita hacerlo para descubrir de qué depende— y `watch` espera al primer cambio, salvo que le pases `{ immediate: true }`.",
    },
    {
      texto: "Un `computed` se recalcula en cuanto cambia algo de lo que depende.",
      porque: "No: se marca como pendiente y se recalcula en la **siguiente lectura**. Si nadie lo lee, no se ejecuta. Es perezoso de principio a fin, y por eso su función nunca debe tener efectos: no sabes cuándo va a correr, ni si va a correr.",
    },
    {
      texto: "`ref` sirve para números y textos, y `reactive` para objetos.",
      porque: "Es la regla que se cuenta y no es cierta: `ref` acepta objetos perfectamente y por dentro los envuelve en un `reactive`. La recomendación de hoy es usar `ref` para casi todo — así hay una sola forma de trabajar, no se pierde la reactividad al desestructurar y se puede reasignar el objeto entero.",
    },
    {
      texto: "Lo que `setup` devuelve es lo único que la plantilla puede usar.",
      verdadera: true,
      porque: "Eso es. Una variable declarada en `setup` y no devuelta no existe para la plantilla, y el síntoma es un hueco vacío sin ningún error. Es el olvido más común al empezar. (Con `<script setup>` desaparece el problema, porque todo lo de arriba queda visible sin devolver nada.)",
    },
  ],
  pistas: [
    pista("Dos de las seis van de cuándo se ejecuta algo: una sobre lo que corre nada más crearse y otra sobre lo que espera a que le pregunten.", 0),
    pista("Otras dos van de perder la reactividad sin darte cuenta: al sacar cosas de un objeto y al olvidarse de devolver algo.", 1),
    pista("La de `ref` frente a `reactive` es la que más gente falla, porque es la regla que repiten los tutoriales antiguos. Piensa si `ref` de verdad rechaza un objeto.", 2),
  ],
  recompensa: { croquetas: 12 },
}
