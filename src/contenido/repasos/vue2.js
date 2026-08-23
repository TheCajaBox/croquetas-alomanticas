/**
 * Las preguntas del repaso de «vue2».
 *
 * Van en su propio fichero y se piden al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
    id: "repaso-vue2",
    mundo: "vue2",
    titulo: "El caso de la mansión",
    preguntas: [
      {
        pregunta: "¿Por qué `data` tiene que ser una función y no un objeto?",
        opciones: [
          {
            texto: "Para que cada copia del componente reciba su propio objeto de datos.",
            correcta: true,
            porque: "Siendo un objeto, todas las copias compartirían el mismo y cambiar un dato en una lo cambiaría en todas.",
          },
          {
            texto: "Porque Vue necesita llamarla para saber cuándo repintar.",
            porque: "El repintado no depende de eso: depende de los accesores que Vue instala sobre las propiedades.",
          },
          {
            texto: "Por costumbre heredada, no cambia nada.",
            porque: "Cambia bastante: con dos copias en pantalla se ve el problema al instante.",
          },
        ],
      },
      {
        pregunta: "¿Para qué sirve `:key` en un `v-for`?",
        opciones: [
          {
            texto: "Para que Vue sepa qué fila es cuál cuando la lista cambia de orden o de tamaño.",
            correcta: true,
            porque: "Sin ella, al reordenar se quedan datos pegados en la fila equivocada. Usa un identificador estable, nunca la posición.",
          },
          {
            texto: "Para ordenar la lista automáticamente.",
            porque: "No ordena nada: solo identifica.",
          },
          {
            texto: "Es opcional y solo sirve para quitar un aviso de la consola.",
            porque: "El aviso está por algo: sin `key` aparecen fallos visuales que cuesta muchísimo diagnosticar.",
          },
        ],
      },
      {
        pregunta: "Un valor que sale solo de otros datos, ¿`computed` o `method`?",
        opciones: [
          {
            texto: "`computed`: guarda el resultado y solo lo rehace cuando cambia algo de lo que usa.",
            correcta: true,
            porque: "Un `method` se ejecuta cada vez que se le llama, y la plantilla lo llama en cada pintado.",
          },
          {
            texto: "`method`, porque es una función.",
            porque: "Los dos son funciones. La diferencia es que el `computed` cachea.",
          },
          {
            texto: "Da igual: el resultado es el mismo.",
            porque: "El resultado sí, el trabajo no. Con listas grandes la diferencia deja de ser teórica muy pronto.",
          },
        ],
      },
      {
        pregunta: "`this.inventario.cuerda = 1` sobre una clave nueva. ¿Qué pasa en Vue 2?",
        opciones: [
          {
            texto: "El dato cambia pero la pantalla no se entera, porque esa clave no existía al montar.",
            correcta: true,
            porque: "Para eso está `this.$set`, que da de alta la propiedad **y** avisa.",
          },
          {
            texto: "Da un error en la consola.",
            porque: "No protesta. Se queda callado, que es lo que lo hace difícil de encontrar.",
          },
          {
            texto: "Funciona igual que en Vue 3.",
            porque: "Vue 3 usa `Proxy` y sí se entera. Este hueco es propio de Vue 2.",
          },
        ],
      },
      {
        pregunta: "Un componente hijo necesita cambiar un dato del padre. ¿Qué hace?",
        opciones: [
          {
            texto: "Emitir un evento y dejar que el padre decida.",
            correcta: true,
            porque: "Datos abajo, avisos arriba. Así solo hay un sitio donde ese dato puede cambiar.",
          },
          {
            texto: "Modificar la prop directamente.",
            porque: "Las props son de quien las manda. Tocarlas rompe la única garantía que hace esto manejable.",
          },
          {
            texto: "Guardar una copia y modificar la copia.",
            porque: "Entonces el padre nunca se entera del cambio, y acabas con dos verdades distintas.",
          },
        ],
      },
      {
        pregunta: "¿Por qué hay que parar un `setInterval` en `beforeDestroy`?",
        opciones: [
          {
            texto: "Porque si no, sigue corriendo cuando el componente ya no existe.",
            correcta: true,
            porque: "Es una fuga: no avisa, no se ve, y va comiendo hasta que la aplicación va a trompicones.",
          },
          {
            texto: "Porque Vue lo para solo, pero conviene ser explícito.",
            porque: "Vue no lo para. Lo que tú enciendes, tú lo apagas.",
          },
          {
            texto: "Solo hace falta si el intervalo cambia datos.",
            porque: "Hace falta siempre. Aunque no tocara nada, seguiría ejecutándose para siempre.",
          },
        ],
      },
    ],
  }
