import { codigo } from '../comun.js'

export default {
  id: "ferro-09-la-linea-entera",
  mundo: "ferrocarril",
  entorno: "vue3",
  tipo: "codigo",
  jefe: true,
  titulo: "Jefe: la línea entera",
  enunciado: codigo(
    "Steris te deja el horario encima de la mesa. Todo lo que hace falta está en los ocho",
    "retos de antes.",
    "",
    "Monta un panel de la colonia con tres piezas:",
    "",
    "**1. `usarColonia()`** — estado compartido, como el del reto 5. Devuelve",
    "`{ estado, alimentar }`. `estado.hambre` empieza en 100 y `alimentar()` le resta 25,",
    "sin bajar de 0.",
    "",
    "**2. `Panel`** — un componente con la prop `titulo`, que pinte:",
    "- un `<h3>` con el título,",
    "- un hueco por defecto dentro de `<div class=\"cuerpo\">`,",
    "- y un hueco llamado `pie` al que le pase `hambre`, sacada de `usarColonia()`.",
    "",
    "**3. `componente`** — que use `Panel`, meta por el hueco del pie un texto que diga",
    "`Hambre: N`, y traiga dentro un `<button class=\"dar\">` que llame a `alimentar`.",
    "",
    "Aquí no hay pistas: esto ya lo sabes hacer.",
  ),
  inicial: codigo(
    "const { reactive } = Vue",
    "",
    "// El estado, fuera de todo.",
    "",
    "function usarColonia() {",
    "  //",
    "}",
    "",
    "const Panel = {",
    "  //",
    "}",
    "",
    "const componente = {",
    "  //",
    "}",
  ),
  solucion: codigo(
    "const { reactive } = Vue",
    "",
    "const estado = reactive({ hambre: 100 })",
    "",
    "function usarColonia() {",
    "  return {",
    "    estado,",
    "    alimentar: () => {",
    "      estado.hambre = Math.max(0, estado.hambre - 25)",
    "    },",
    "  }",
    "}",
    "",
    "const Panel = {",
    "  props: ['titulo'],",
    "  setup() {",
    "    const { estado } = usarColonia()",
    "    return { estado }",
    "  },",
    "  template: `",
    "    <section>",
    "      <h3>{{ titulo }}</h3>",
    "      <div class=\"cuerpo\"><slot /></div>",
    "      <footer><slot name=\"pie\" :hambre=\"estado.hambre\" /></footer>",
    "    </section>",
    "  `,",
    "}",
    "",
    "const componente = {",
    "  components: { Panel },",
    "  setup() {",
    "    const { alimentar } = usarColonia()",
    "    return { alimentar }",
    "  },",
    "  template: `",
    "    <Panel titulo=\"La colonia\">",
    "      <button class=\"dar\" @click=\"alimentar\">Dar de comer</button>",
    "      <template #pie=\"{ hambre }\">Hambre: {{ hambre }}</template>",
    "    </Panel>",
    "  `,",
    "}",
  ),
  requisitos: [
    { tipo: "declaraVariable", valor: "usarColonia" },
    { tipo: "declaraVariable", valor: "Panel" },
    { tipo: "declaraVariable", valor: "componente" },
    { tipo: "usaLlamada", valor: "reactive" },
    { tipo: "prohibeVar" },
  ],
  tests: [
    {
      nombre: "el título llega por prop",
      codigo: codigo(
        "const vista = montar(componente)",
        "esperar(vista.texto('h3')).diceLoMismoQue('La colonia')",
      ),
    },
    {
      nombre: "el botón entra por el hueco por defecto",
      codigo: codigo(
        "const vista = montar(componente)",
        "esperar(vista.existe('.cuerpo .dar'), 'el botón no está dentro del hueco').esVerdadero()",
      ),
    },
    {
      nombre: "el pie recibe el hambre del estado compartido",
      codigo: codigo(
        "const vista = montar(componente)",
        "esperar(vista.texto('footer')).contiene(String(usarColonia().estado.hambre))",
      ),
    },
    {
      nombre: "dar de comer baja el hambre y se ve en el pie",
      codigo: codigo(
        "const vista = montar(componente)",
        "const antes = usarColonia().estado.hambre",
        "await vista.click('.dar')",
        "esperar(usarColonia().estado.hambre).igualA(antes - 25)",
        "esperar(vista.texto('footer')).contiene(String(antes - 25))",
      ),
    },
    {
      nombre: "el hambre nunca baja de cero",
      codigo: codigo(
        "const colonia = usarColonia()",
        "for (let vez = 0; vez < 20; vez += 1) colonia.alimentar()",
        "esperar(colonia.estado.hambre).igualA(0)",
      ),
    },
    {
      nombre: "usarColonia devuelve siempre el mismo estado",
      codigo: codigo(
        "const uno = usarColonia()",
        "const otro = usarColonia()",
        "esperar(uno.estado === otro.estado, 'cada llamada creó su propio estado').esVerdadero()",
      ),
    },
  ],
  // El jefe junta hueco, hueco con nombre, estado compartido y un botón que baja
  // de veinticinco en veinticinco. Las tandas dan de comer hasta el fondo, que es
  // donde se ve si el tope de cero está puesto, y montan un panel después para
  // comprobar que el estado no era de nadie en particular.
  variantes: [
    {
      titulo: "Jefe: la línea entera · otra tanda",
      tests: [
        {
          nombre: "el panel arranca con el hambre a tope y el pie lo dice",
          codigo: codigo(
            "const vista = montar(componente)",
            "esperar(vista.texto('footer')).contiene('100')",
            "esperar(vista.texto('h3')).diceLoMismoQue('La colonia')",
          ),
        },
        {
          nombre: "el botón entra por el hueco por defecto, no por el del pie",
          codigo: codigo(
            "const vista = montar(componente)",
            "esperar(vista.existe('.cuerpo .dar'), 'el botón dentro del cuerpo').esVerdadero()",
            "esperar(vista.existe('footer .dar'), 'el botón dentro del pie').esFalso()",
          ),
        },
        {
          nombre: "dos platos y el hambre se queda en cincuenta",
          codigo: codigo(
            "const vista = montar(componente)",
            "await vista.click('.dar')",
            "await vista.click('.dar')",
            "esperar(usarColonia().estado.hambre).igualA(50)",
            "esperar(vista.texto('footer')).contiene('50')",
          ),
        },
        {
          nombre: "otro panel montado ahora ya nace con el hambre que hay",
          codigo: codigo(
            "const vista = montar(componente)",
            "esperar(vista.texto('footer')).contiene('50')",
          ),
        },
        {
          nombre: "y cuatro platos más la dejan a cero, no en menos cincuenta",
          codigo: codigo(
            "const colonia = usarColonia()",
            "colonia.alimentar()",
            "colonia.alimentar()",
            "colonia.alimentar()",
            "colonia.alimentar()",
            "esperar(colonia.estado.hambre).igualA(0)",
          ),
        },
      ],
    },
    {
      titulo: "Jefe: la línea entera · y otra",
      tests: [
        {
          nombre: "usarColonia devuelve el mismísimo estado todas las veces que la llames",
          codigo: "esperar(usarColonia().estado === usarColonia().estado, 'que el estado sea uno solo').esVerdadero()",
        },
        {
          nombre: "cuatro platos justos dejan el hambre a cero exacto",
          codigo: codigo(
            "const colonia = usarColonia()",
            "colonia.alimentar()",
            "colonia.alimentar()",
            "colonia.alimentar()",
            "colonia.alimentar()",
            "esperar(colonia.estado.hambre).igualA(0)",
          ),
        },
        {
          nombre: "y el quinto plato no la pone en negativo: ahí está el tope",
          codigo: codigo(
            "const colonia = usarColonia()",
            "colonia.alimentar()",
            "esperar(colonia.estado.hambre).igualA(0)",
          ),
        },
        {
          nombre: "un panel montado con la colonia llena de comida enseña el cero en el pie",
          codigo: codigo(
            "const vista = montar(componente)",
            "esperar(vista.texto('footer')).contiene('0')",
          ),
        },
        {
          nombre: "y las tres piezas siguen en su sitio: título, cuerpo y pie",
          codigo: codigo(
            "const vista = montar(componente)",
            "esperar(vista.existe('h3'), 'el título').esVerdadero()",
            "esperar(vista.existe('.cuerpo'), 'el cuerpo').esVerdadero()",
            "esperar(vista.existe('footer'), 'el pie').esVerdadero()",
          ),
        },
      ],
    },
  ],
  recompensa: { croquetas: 24 },
}
