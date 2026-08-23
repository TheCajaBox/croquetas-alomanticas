/**
 * Las preguntas del repaso de «vue3».
 *
 * Van en su propio fichero y se piden al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
    id: "repaso-vue3",
    mundo: "vue3",
    titulo: "El caso de la ciudad nueva",
    preguntas: [
      {
        pregunta: "`const balas = ref(6)`. ¿Dónde hace falta `.value`?",
        opciones: [
          {
            texto: "Dentro de `setup` sí; en la plantilla no.",
            correcta: true,
            porque: "Vue abre la caja por ti al pintar. Olvidarlo dentro de `setup` es el error número uno, y no avisa.",
          },
          {
            texto: "En los dos sitios.",
            porque: "En la plantilla `{{ balas.value }}` no da error, pero sobra: Vue ya lo desenvuelve.",
          },
          {
            texto: "En ninguno de los dos.",
            porque: "Dentro de `setup`, `balas` es la caja. Sin `.value` estás operando con la caja, no con el número.",
          },
        ],
      },
      {
        pregunta: "`const { balas } = reactive({ balas: 6 })`. ¿Qué se rompe?",
        opciones: [
          {
            texto: "La reactividad: `balas` es una copia del valor, no un vínculo con el objeto.",
            correcta: true,
            porque: "La vigilancia está sobre el objeto. Para desestructurar sin perderla existe `toRefs`.",
          },
          {
            texto: "Nada: sigue siendo reactivo.",
            porque: "Es la trampa clásica de Vue 3, y no da ningún error: simplemente deja de actualizarse.",
          },
          {
            texto: "Da error al desestructurar un objeto reactivo.",
            porque: "Deja hacerlo tan tranquilo. Ese es el problema.",
          },
        ],
      },
      {
        pregunta: "Nada más montar el componente, ¿cuál de los dos ha corrido ya?",
        opciones: [
          {
            texto: "`watchEffect`, que se lanza inmediatamente; `watch` espera al primer cambio.",
            correcta: true,
            porque: "`watchEffect` además averigua solo de qué depende, leyendo lo que usa por dentro.",
          },
          {
            texto: "`watch`, que se lanza con el valor inicial.",
            porque: "Solo si le pasas `{ immediate: true }`. Por defecto espera.",
          },
          {
            texto: "Los dos.",
            porque: "Solo `watchEffect`. Es la diferencia práctica más visible entre ambos.",
          },
        ],
      },
      {
        pregunta: "¿Qué hay que pasarle a `provide` para que el de abajo se entere de los cambios?",
        opciones: [
          {
            texto: "El `ref` entero, no su `.value`.",
            correcta: true,
            porque: "Compartiendo el valor, el de abajo se queda con una foto del momento y no se entera de nada más.",
          },
          {
            texto: "El `.value`, que es el dato de verdad.",
            porque: "Eso comparte una copia. El vínculo vive en el ref.",
          },
          {
            texto: "Da igual, Vue lo resuelve solo.",
            porque: "No lo resuelve: si compartes el valor, el de abajo deja de actualizarse.",
          },
        ],
      },
      {
        pregunta: "Dos componentes llaman al mismo composable. ¿Comparten estado?",
        opciones: [
          {
            texto: "No: cada llamada crea su propio estado.",
            correcta: true,
            porque: "Es una función normal. Si quieres estado compartido, saca los `ref` fuera de ella.",
          },
          {
            texto: "Sí, siempre: para eso está un composable.",
            porque: "Eso sería un almacén global. Un composable da a cada uno lo suyo.",
          },
          {
            texto: "Depende de si lleva `ref` o `reactive`.",
            porque: "No depende de eso, sino de si los `ref` están dentro o fuera de la función.",
          },
        ],
      },
      {
        pregunta: "¿Qué pasa si `setup` no devuelve algo que la plantilla usa?",
        opciones: [
          {
            texto: "La plantilla no lo ve y Vue avisa de que esa propiedad no está definida.",
            correcta: true,
            porque: "Es el fallo más habitual al convertir de Options API a Composition: se traduce todo y se olvida el `return`.",
          },
          {
            texto: "Vue lo encuentra igual, porque está en el mismo fichero.",
            porque: "No lo encuentra: la plantilla solo ve lo que `setup` entrega.",
          },
          {
            texto: "Funciona pero deja de ser reactivo.",
            porque: "Directamente no existe para la plantilla.",
          },
        ],
      },
    ],
  }
