import { codigo, pista } from '../comun.js'

export default {
  id: "ferro-05-estado-compartido",
  mundo: "ferrocarril",
  entorno: "vue3",
  tipo: "codigo",
  titulo: "Un sitio donde miran todos",
  enunciado: codigo(
    "Cuando dos componentes que no son padre e hijo necesitan el mismo dato, pasarlo por",
    "props es imposible: habría que subirlo hasta el antepasado común y volver a bajarlo",
    "por todas las ramas.",
    "",
    "La solución es sacar el dato **fuera de los componentes**. Eso es lo que hacen Pinia",
    "y los demás almacenes, y por debajo no es nada del otro mundo.",
    "",
    "Escribe `usarColonia()`, que devuelva siempre `{ estado, sumar, gastar }` sobre un",
    "estado **compartido**: `estado.croquetas` empieza en 0, `sumar()` suma una y `gastar()`",
    "resta una, pero nunca por debajo de cero.",
    "",
    "Declara también `componente`, con dos hijos distintos que usen `usarColonia()`: uno",
    "con un botón `.sumar` y otro que enseñe el total en un `<span class=\"total\">`.",
  ),
  inicial: codigo(
    "const { reactive } = Vue",
    "",
    "// El estado va AQUÍ FUERA, no dentro de la función.",
    "",
    "function usarColonia() {",
    "  //",
    "}",
    "",
    "const componente = {",
    "  template: `...`,",
    "}",
  ),
  solucion: codigo(
    "const { reactive } = Vue",
    "",
    "const estado = reactive({ croquetas: 0 })",
    "",
    "function usarColonia() {",
    "  return {",
    "    estado,",
    "    sumar: () => {",
    "      estado.croquetas += 1",
    "    },",
    "    gastar: () => {",
    "      estado.croquetas = Math.max(0, estado.croquetas - 1)",
    "    },",
    "  }",
    "}",
    "",
    "const Boton = {",
    "  setup() {",
    "    const { sumar } = usarColonia()",
    "    return { sumar }",
    "  },",
    "  template: `<button class=\"sumar\" @click=\"sumar\">+1</button>`,",
    "}",
    "",
    "const Marcador = {",
    "  setup() {",
    "    const { estado } = usarColonia()",
    "    return { estado }",
    "  },",
    "  template: `<span class=\"total\">{{ estado.croquetas }}</span>`,",
    "}",
    "",
    "const componente = {",
    "  components: { Boton, Marcador },",
    "  template: `<div><Boton /><Marcador /></div>`,",
    "}",
  ),
  requisitos: [
    { tipo: "declaraVariable", valor: "usarColonia" },
    { tipo: "declaraVariable", valor: "componente" },
    { tipo: "usaLlamada", valor: "reactive" },
    { tipo: "prohibeVar" },
  ],
  tests: [
    {
      nombre: "empieza a cero",
      codigo: codigo(
        "const vista = montar(componente)",
        "esperar(vista.texto('.total')).diceLoMismoQue('0')",
      ),
    },
    {
      nombre: "pulsar en un componente se ve en el otro",
      codigo: codigo(
        "const vista = montar(componente)",
        "await vista.click('.sumar')",
        "esperar(vista.texto('.total')).diceLoMismoQue('1')",
      ),
    },
    {
      nombre: "dos usos de usarColonia comparten el mismo estado",
      codigo: codigo(
        "const uno = usarColonia()",
        "const otro = usarColonia()",
        "const antes = otro.estado.croquetas",
        "uno.sumar()",
        "esperar(otro.estado.croquetas - antes, 'cada llamada creó su propio estado').igualA(1)",
      ),
    },
    {
      nombre: "gastar no baja de cero",
      codigo: codigo(
        "const colonia = usarColonia()",
        "for (let vez = 0; vez < 20; vez += 1) colonia.gastar()",
        "esperar(colonia.estado.croquetas).igualA(0)",
      ),
    },
  ],
  // El estado es uno para todos, así que dentro de una tanda lo que hace un test
  // lo ve el siguiente: eso es justo la lección, y las tandas lo aprovechan en
  // vez de esconderlo.
  variantes: [
    {
      titulo: "Un sitio donde miran todos · otra tanda",
      tests: [
        {
          nombre: "el panel nace con el botón y el marcador, y el marcador a cero",
          codigo: codigo(
            "const vista = montar(componente)",
            "esperar(vista.existe('.sumar'), 'el botón').esVerdadero()",
            "esperar(vista.texto('.total')).diceLoMismoQue('0')",
          ),
        },
        {
          nombre: "tres pulsaciones y el marcador va detrás sin que nadie le pase nada",
          codigo: codigo(
            "const vista = montar(componente)",
            "await vista.click('.sumar')",
            "await vista.click('.sumar')",
            "await vista.click('.sumar')",
            "esperar(vista.texto('.total')).diceLoMismoQue('3')",
          ),
        },
        {
          nombre: "gastar desde fuera también se nota: es el mismo estado",
          codigo: codigo(
            "const colonia = usarColonia()",
            "colonia.gastar()",
            "esperar(colonia.estado.croquetas).igualA(2)",
          ),
        },
        {
          nombre: "un panel montado después ya nace con lo que hay",
          codigo: codigo(
            "const vista = montar(componente)",
            "esperar(vista.texto('.total')).diceLoMismoQue('2')",
          ),
        },
        {
          nombre: "y gastar veinte veces desde dos deja cero, no menos dieciocho",
          codigo: codigo(
            "const colonia = usarColonia()",
            "for (let vez = 0; vez < 20; vez += 1) colonia.gastar()",
            "esperar(colonia.estado.croquetas).igualA(0)",
          ),
        },
      ],
    },
    {
      titulo: "Un sitio donde miran todos · y otra",
      tests: [
        {
          nombre: "dos llamadas a usarColonia devuelven el mismísimo objeto de estado",
          codigo: "esperar(usarColonia().estado === usarColonia().estado, 'que el estado sea uno solo').esVerdadero()",
        },
        {
          nombre: "gastar con la despensa vacía la deja vacía, no en negativo",
          codigo: codigo(
            "const colonia = usarColonia()",
            "colonia.gastar()",
            "esperar(colonia.estado.croquetas).igualA(0)",
          ),
        },
        {
          nombre: "cinco croquetas sumadas desde fuera son cinco croquetas",
          codigo: codigo(
            "const colonia = usarColonia()",
            "colonia.sumar()",
            "colonia.sumar()",
            "colonia.sumar()",
            "colonia.sumar()",
            "colonia.sumar()",
            "esperar(colonia.estado.croquetas).igualA(5)",
          ),
        },
        {
          nombre: "y el marcador se enteró aunque el panel se monte ahora",
          codigo: codigo(
            "const vista = montar(componente)",
            "esperar(vista.texto('.total')).diceLoMismoQue('5')",
          ),
        },
        {
          nombre: "pulsar el botón suma una más encima de lo que ya había",
          codigo: codigo(
            "const vista = montar(componente)",
            "await vista.click('.sumar')",
            "esperar(vista.texto('.total')).diceLoMismoQue('6')",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("La diferencia con un composable normal está en **dónde** se declara el estado: dentro de la función, cada llamada crea el suyo; fuera, todas comparten uno.", 0),
    pista("Un `reactive({ croquetas: 0 })` en el nivel de arriba del archivo se crea una sola vez, porque un módulo se ejecuta una vez por muchas veces que lo importen.", 1),
    pista("Devuelve el objeto reactivo entero, no `estado.croquetas` suelto: desestructurar un `reactive` corta la reactividad, y entonces el marcador se quedaría clavado en el valor de aquel momento.", 2),
  ],
  recompensa: { croquetas: 16 },
}
