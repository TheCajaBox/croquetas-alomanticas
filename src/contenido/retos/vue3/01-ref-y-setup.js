import { codigo, pista } from '../comun.js'

export default {
  id: "vue3-01-ref-y-setup",
  mundo: "vue3",
  entorno: "vue3",
  tipo: "codigo",
  titulo: "Llegar a la ciudad nueva",
  enunciado: codigo(
    "Aquí las cosas se montan de otra manera. En vez de repartir el componente en cajones",
    "(`data` por un lado, `methods` por otro), hay una sola función, `setup()`, donde se declara",
    "todo junto y se devuelve lo que la plantilla vaya a necesitar.",
    "",
    "Un dato que puede cambiar se envuelve en `ref`. Y ahí está el detalle que hay que meterse en",
    "la cabeza desde el minuto uno: **dentro de `setup` se accede con `.value`; en la plantilla, no.**",
    "",
    "Declara `componente` con un `setup()` que devuelva:",
    "",
    "- `balas`, un `ref` que empieza en `6`",
    "- `disparar()`, que quite una bala y **nunca baje de 0**",
    "- `recargar()`, que las deje otra vez en 6",
    "",
    "Y una plantilla con `<p class=\"balas\">`, `<button class=\"disparar\">` y `<button class=\"recargar\">`.",
  ),
  inicial: codigo(
    "const { ref } = Vue",
    "",
    "const componente = {",
    "  setup() {",
    "    // Aquí dentro, todo con .value.",
    "",
    "    return {}",
    "  },",
    "  template: `",
    "    <div>",
    "    </div>",
    "  `,",
    "}",
  ),
  solucion: codigo(
    "const { ref } = Vue",
    "",
    "const componente = {",
    "  setup() {",
    "    const balas = ref(6)",
    "",
    "    const disparar = () => {",
    "      if (balas.value > 0) balas.value -= 1",
    "    }",
    "",
    "    const recargar = () => {",
    "      balas.value = 6",
    "    }",
    "",
    "    return { balas, disparar, recargar }",
    "  },",
    "  template: `",
    "    <div>",
    "      <p class=\"balas\">{{ balas }}</p>",
    "      <button class=\"disparar\" @click=\"disparar\">Disparar</button>",
    "      <button class=\"recargar\" @click=\"recargar\">Recargar</button>",
    "    </div>",
    "  `,",
    "}",
  ),
  requisitos: [
    { tipo: "declaraVariable", valor: "componente" },
    { tipo: "usaPropiedad", valor: "setup" },
    { tipo: "usaLlamada", valor: "ref" },
  ],
  tests: [
    {
      nombre: "empieza con el tambor lleno",
      codigo: codigo(
        "const arma = montar(componente)",
        "esperar(arma.texto('.balas')).igualA('6')",
      ),
    },
    {
      nombre: "disparar gasta una bala",
      codigo: codigo(
        "const arma = montar(componente)",
        "await arma.click('.disparar')",
        "esperar(arma.texto('.balas')).igualA('5')",
      ),
    },
    {
      nombre: "no se dispara con el tambor vacío",
      codigo: codigo(
        "const arma = montar(componente)",
        "for (let i = 0; i < 9; i += 1) await arma.click('.disparar')",
        "esperar(arma.texto('.balas'), 'las balas tras nueve disparos').igualA('0')",
      ),
    },
    {
      nombre: "recargar vuelve a dejarlo en seis",
      codigo: codigo(
        "const arma = montar(componente)",
        "await arma.click('.disparar')",
        "await arma.click('.disparar')",
        "await arma.click('.recargar')",
        "esperar(arma.texto('.balas')).igualA('6')",
      ),
    },
    { nombre: "en la plantilla no hace falta .value", codigo: "esperar(componente.template, 'la plantilla').noContiene('balas.value')" },
  ],
  // Lo que se practica es el `.value` dentro y el sin-`.value` fuera. Las tandas
  // pulsan los botones en otras cantidades y montan dos armas a la vez.
  variantes: [
    {
      titulo: "Llegar a la ciudad nueva · otra tanda",
      tests: [
        {
          nombre: "seis disparos y el tambor queda seco",
          codigo: codigo(
            "const arma = montar(componente)",
            "for (let i = 0; i < 6; i += 1) await arma.click('.disparar')",
            "esperar(arma.texto('.balas')).igualA('0')",
          ),
        },
        {
          nombre: "recargar con el tambor lleno no lo pasa de seis",
          codigo: codigo(
            "const arma = montar(componente)",
            "await arma.click('.recargar')",
            "esperar(arma.texto('.balas')).igualA('6')",
          ),
        },
        {
          nombre: "recargar después de vaciarlo lo vuelve a dejar en seis",
          codigo: codigo(
            "const arma = montar(componente)",
            "for (let i = 0; i < 6; i += 1) await arma.click('.disparar')",
            "await arma.click('.recargar')",
            "esperar(arma.texto('.balas')).igualA('6')",
          ),
        },
        {
          nombre: "el dato de dentro es el que se pinta, y en la plantilla sale sin abrir la caja",
          codigo: codigo(
            "const arma = montar(componente)",
            "esperar(arma.vm.balas, 'las balas del componente').igualA(6)",
            "esperar(arma.texto('.balas')).igualA('6')",
          ),
        },
        {
          nombre: "y los dos botones están donde los buscan los tests",
          codigo: codigo(
            "const arma = montar(componente)",
            "esperar(arma.existe('.disparar'), 'el botón de disparar').esVerdadero()",
            "esperar(arma.existe('.recargar'), 'el botón de recargar').esVerdadero()",
          ),
        },
      ],
    },
    {
      titulo: "Llegar a la ciudad nueva · y otra",
      tests: [
        {
          nombre: "cada disparo baja de uno en uno, y se ve al momento",
          codigo: codigo(
            "const arma = montar(componente)",
            "await arma.click('.disparar')",
            "esperar(arma.texto('.balas')).igualA('5')",
            "await arma.click('.disparar')",
            "esperar(arma.texto('.balas')).igualA('4')",
            "await arma.click('.disparar')",
            "esperar(arma.texto('.balas')).igualA('3')",
          ),
        },
        {
          nombre: "insistir doce veces con el tambor seco no lo pone en negativo",
          codigo: codigo(
            "const arma = montar(componente)",
            "for (let i = 0; i < 12; i += 1) await arma.click('.disparar')",
            "esperar(arma.texto('.balas')).igualA('0')",
          ),
        },
        {
          nombre: "recargar a media tanda deja seguir disparando desde seis",
          codigo: codigo(
            "const arma = montar(componente)",
            "await arma.click('.disparar')",
            "await arma.click('.disparar')",
            "await arma.click('.disparar')",
            "await arma.click('.recargar')",
            "await arma.click('.disparar')",
            "esperar(arma.texto('.balas')).igualA('5')",
          ),
        },
        {
          nombre: "dos armas montadas aparte no comparten balas",
          codigo: codigo(
            "const una = montar(componente)",
            "const otra = montar(componente)",
            "await una.click('.disparar')",
            "esperar(otra.texto('.balas')).igualA('6')",
          ),
        },
        {
          nombre: "y en la plantilla no aparece ni un .value: eso es cosa de dentro de setup",
          codigo: "esperar(componente.template, 'la plantilla').noContiene('.value')",
        },
      ],
    },
  ],
  pistas: [
    pista("`setup()` devuelve un objeto, y todo lo que devuelva se puede usar en la plantilla directamente.", 0),
    pista("Dentro de `setup`, `balas` no es un número: es una caja. El número está en `balas.value`. En la plantilla Vue abre la caja por ti.", 1),
    pista("Devuelves tres cosas: la caja y las dos funciones. Dentro de las funciones acuérdate de abrir la caja para leer o cambiar el número; en la plantilla, no, que ahí Vue la abre por ti. Y `disparar` tiene que mirar antes si queda algo.", 2),
  ],
  recompensa: { croquetas: 10 },
}
