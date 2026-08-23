import { codigo, pista } from '../comun.js'

export default {
  id: "ferro-04-lo-que-se-arranca-se-para",
  mundo: "ferrocarril",
  entorno: "vue3",
  tipo: "codigo",
  titulo: "Lo que se arranca, se para",
  enunciado: codigo(
    "Un componente que arranca algo —un reloj, una escucha, un observador— y no lo para",
    "al desaparecer deja eso corriendo para siempre. Se entra y se sale de la pantalla",
    "diez veces y hay diez relojes en marcha, cada uno tocando lo suyo.",
    "",
    "No da ningún error. Solo va cada vez más lento, y encontrarlo después cuesta mucho.",
    "",
    "Declara `componente`, que:",
    "",
    "- Guarde en `vueltas` un contador que empiece en 0 y suba cada 10 milisegundos.",
    "- Lo enseñe dentro de un `<p class=\"vueltas\">`.",
    "- Y **deje de contar** en cuanto el componente desaparezca.",
  ),
  inicial: codigo(
    "const { ref, onMounted, onUnmounted } = Vue",
    "",
    "const componente = {",
    "  setup() {",
    "    const vueltas = ref(0)",
    "",
    "    // Arranca el reloj al montar... y acuérdate de pararlo.",
    "",
    "    return { vueltas }",
    "  },",
    "  template: `<p class=\"vueltas\">{{ vueltas }}</p>`,",
    "}",
  ),
  solucion: codigo(
    "const { ref, onMounted, onUnmounted } = Vue",
    "",
    "const componente = {",
    "  setup() {",
    "    const vueltas = ref(0)",
    "    let reloj = null",
    "",
    "    onMounted(() => {",
    "      reloj = setInterval(() => {",
    "        vueltas.value += 1",
    "      }, 10)",
    "    })",
    "",
    "    onUnmounted(() => {",
    "      clearInterval(reloj)",
    "    })",
    "",
    "    return { vueltas }",
    "  },",
    "  template: `<p class=\"vueltas\">{{ vueltas }}</p>`,",
    "}",
  ),
  requisitos: [
    { tipo: "declaraVariable", valor: "componente" },
    { tipo: "usaLlamada", valor: "onMounted" },
    { tipo: "usaLlamada", valor: "onUnmounted" },
    { tipo: "usaLlamada", valor: "clearInterval" },
    { tipo: "prohibeVar" },
  ],
  tests: [
    {
      nombre: "empieza en cero",
      codigo: codigo(
        "const vista = montar(componente)",
        "esperar(vista.texto('.vueltas')).diceLoMismoQue('0')",
      ),
    },
    {
      nombre: "va contando solo",
      codigo: codigo(
        "const vista = montar(componente)",
        "await new Promise((sigue) => setTimeout(sigue, 60))",
        "await siguienteTick()",
        "esperar(Number(vista.texto('.vueltas')) > 0, 'el contador no se ha movido').esVerdadero()",
      ),
    },
    {
      nombre: "y deja de contar cuando el componente desaparece",
      codigo: codigo(
        "const vista = montar(componente)",
        "await new Promise((sigue) => setTimeout(sigue, 40))",
        "await siguienteTick()",
        "const alDesmontar = Number(vista.texto('.vueltas'))",
        "vista.app.unmount()",
        "await new Promise((sigue) => setTimeout(sigue, 60))",
        "esperar(vista.vm.vueltas, 'el reloj sigue corriendo tras desmontar').igualA(alDesmontar)",
      ),
    },
  ],
  // Una fuga no se ve mirando una vez: se ve entrando y saliendo. La segunda
  // tanda monta y desmonta tres veces y luego comprueba que no quedó nada
  // contando por su cuenta.
  variantes: [
    {
      titulo: "Lo que se arranca, se para · otra tanda",
      tests: [
        {
          nombre: "recién montado marca cero y todavía no ha dado ninguna vuelta",
          codigo: codigo(
            "const vista = montar(componente)",
            "esperar(vista.texto('.vueltas')).diceLoMismoQue('0')",
            "esperar(vista.vm.vueltas, 'el contador').igualA(0)",
          ),
        },
        {
          nombre: "en cien milisegundos ya ha dado unas cuantas",
          codigo: codigo(
            "const vista = montar(componente)",
            "await new Promise((sigue) => setTimeout(sigue, 100))",
            "await siguienteTick()",
            "esperar(vista.vm.vueltas > 3, 'las vueltas en cien milisegundos').esVerdadero()",
          ),
        },
        {
          nombre: "lo pintado es el dato, no una foto de cuando se montó",
          codigo: codigo(
            "const vista = montar(componente)",
            "await new Promise((sigue) => setTimeout(sigue, 50))",
            "await siguienteTick()",
            "esperar(vista.texto('.vueltas')).diceLoMismoQue(String(vista.vm.vueltas))",
          ),
        },
        {
          nombre: "y el contador es un número, no un texto que lo parezca",
          codigo: codigo(
            "const vista = montar(componente)",
            "esperar(vista.vm.vueltas, 'el contador').esDeTipo('number')",
          ),
        },
      ],
    },
    {
      titulo: "Lo que se arranca, se para · y otra",
      tests: [
        {
          nombre: "desmontarlo antes de la primera vuelta lo deja clavado en cero",
          codigo: codigo(
            "const vista = montar(componente)",
            "vista.app.unmount()",
            "await new Promise((sigue) => setTimeout(sigue, 80))",
            "esperar(vista.vm.vueltas, 'las vueltas tras desmontar al momento').igualA(0)",
          ),
        },
        {
          nombre: "entrar y salir tres veces no deja tres relojes sonando por ahí",
          codigo: codigo(
            "const uno = montar(componente)",
            "uno.app.unmount()",
            "const dos = montar(componente)",
            "dos.app.unmount()",
            "const tres = montar(componente)",
            "tres.app.unmount()",
            "await new Promise((sigue) => setTimeout(sigue, 90))",
            "esperar(uno.vm.vueltas + dos.vm.vueltas + tres.vm.vueltas, 'lo que contaron los tres tras salir').igualA(0)",
          ),
        },
        {
          nombre: "cuanto más rato, más vueltas: el reloj no se para solo por el camino",
          codigo: codigo(
            "const vista = montar(componente)",
            "await new Promise((sigue) => setTimeout(sigue, 50))",
            "const pocas = vista.vm.vueltas",
            "await new Promise((sigue) => setTimeout(sigue, 150))",
            "esperar(vista.vm.vueltas > pocas, 'que haya seguido contando').esVerdadero()",
          ),
        },
        {
          nombre: "y el contador se pinta donde lo buscan, con su clase",
          codigo: codigo(
            "const vista = montar(componente)",
            "esperar(vista.existe('.vueltas'), 'el párrafo de las vueltas').esVerdadero()",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("`onMounted` es el momento de arrancar cosas. Hay otro gancho para el momento contrario, y su nombre lo dice.", 0),
    pista("`setInterval` devuelve un identificador, y `clearInterval` lo necesita para poder pararlo. Así que hay que guardarlo en algún sitio donde los dos ganchos lo vean.", 1),
    pista("Ese sitio es una variable declarada en el cuerpo de `setup`, fuera de los dos ganchos. Las dos funciones que le pases a `onMounted` y a `onUnmounted` son cierres: se acuerdan de ella.", 2),
  ],
  recompensa: { croquetas: 15 },
}
