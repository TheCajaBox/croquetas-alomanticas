import { codigo, pista } from '../comun.js'

export default {
  id: "vue2-01-instancia",
  mundo: "vue2",
  entorno: "vue2",
  tipo: "codigo",
  titulo: "Abrir la casa",
  enunciado: codigo(
    "Bienvenido a la mansión. Aquí un componente es un objeto con las cosas en su sitio y",
    "con su nombre: `data` para lo que se guarda, `template` para lo que se ve.",
    "",
    "Declara una variable llamada `componente` con:",
    "",
    "- `data`, que devuelva `senor` (`'Waxillium Ladrian'`) y `habitaciones` (`34`)",
    "- `template`, que pinte un `<h1>` con `Casa Ladrian`, un `<p class=\"senor\">` con el nombre",
    "  y un `<p class=\"habitaciones\">` con el texto `34 habitaciones`",
    "",
    "Y aquí va la primera manía de la casa: **`data` tiene que ser una función**, no un objeto.",
    "Si es un objeto, todas las copias del componente comparten los mismos datos, y eso se nota",
    "en cuanto abres dos habitaciones a la vez.",
  ),
  inicial: codigo(
    "const componente = {",
    "  // data va aquí, y es una función que devuelve un objeto.",
    "",
    "  template: `",
    "    <section>",
    "    </section>",
    "  `,",
    "}",
  ),
  solucion: codigo(
    "const componente = {",
    "  data() {",
    "    return {",
    "      senor: 'Waxillium Ladrian',",
    "      habitaciones: 34,",
    "    }",
    "  },",
    "  template: `",
    "    <section>",
    "      <h1>Casa Ladrian</h1>",
    "      <p class=\"senor\">{{ senor }}</p>",
    "      <p class=\"habitaciones\">{{ habitaciones }} habitaciones</p>",
    "    </section>",
    "  `,",
    "}",
  ),
  requisitos: [
    { tipo: "declaraVariable", valor: "componente" },
    { tipo: "usaPropiedad", valor: "data" },
    { tipo: "usaPropiedad", valor: "template" },
  ],
  tests: [
    { nombre: "data es una función", codigo: "esperar(typeof componente.data, 'el tipo de data').igualA('function')" },
    {
      nombre: "pone el nombre de la casa",
      codigo: codigo(
        "const casa = montar(componente)",
        "esperar(casa.texto('h1')).igualA('Casa Ladrian')",
      ),
    },
    {
      nombre: "pinta al señor de la casa",
      codigo: codigo(
        "const casa = montar(componente)",
        "esperar(casa.texto('.senor')).igualA('Waxillium Ladrian')",
      ),
    },
    {
      nombre: "cuenta las habitaciones",
      codigo: codigo(
        "const casa = montar(componente)",
        "esperar(casa.texto('.habitaciones')).igualA('34 habitaciones')",
      ),
    },
    {
      nombre: "dos copias de la casa no comparten los muebles",
      codigo: codigo(
        "const primera = montar(componente)",
        "const segunda = montar(componente)",
        "primera.vm.habitaciones = 1",
        "await siguienteTick()",
        "esperar(segunda.texto('.habitaciones'), 'la segunda copia').igualA('34 habitaciones')",
      ),
    },
  ],
  // La manía de la casa -que `data` sea una función- solo se nota con dos copias
  // montadas a la vez. La primera tanda toca los datos ya montados; la segunda
  // insiste en que cada copia tenga los suyos.
  variantes: [
    {
      titulo: "Abrir la casa · otra tanda",
      tests: [
        {
          nombre: "el título de la casa no depende de los datos: es texto fijo",
          codigo: codigo(
            "const casa = montar(componente)",
            "casa.vm.senor = 'Nadie'",
            "await siguienteTick()",
            "esperar(casa.texto('h1')).igualA('Casa Ladrian')",
          ),
        },
        {
          nombre: "cambiar el señor de la casa cambia lo pintado",
          codigo: codigo(
            "const casa = montar(componente)",
            "casa.vm.senor = 'Steris Harms'",
            "await siguienteTick()",
            "esperar(casa.texto('.senor')).igualA('Steris Harms')",
          ),
        },
        {
          nombre: "cambiar las habitaciones cambia la cifra y deja la palabra",
          codigo: codigo(
            "const casa = montar(componente)",
            "casa.vm.habitaciones = 7",
            "await siguienteTick()",
            "esperar(casa.texto('.habitaciones')).igualA('7 habitaciones')",
          ),
        },
        {
          nombre: "y una casa nueva vuelve a nacer con los muebles de fábrica",
          codigo: codigo(
            "const primera = montar(componente)",
            "primera.vm.habitaciones = 1",
            "await siguienteTick()",
            "const nueva = montar(componente)",
            "esperar(nueva.texto('.habitaciones')).igualA('34 habitaciones')",
          ),
        },
      ],
    },
    {
      titulo: "Abrir la casa · y otra",
      tests: [
        {
          nombre: "llamar a data dos veces da dos objetos distintos: eso es la manía de la casa",
          codigo: "esperar(componente.data() === componente.data()).esFalso()",
        },
        {
          nombre: "los datos salen con los nombres exactos que pedía el enunciado",
          codigo: codigo(
            "const datos = componente.data()",
            "esperar(datos.senor).igualA('Waxillium Ladrian')",
            "esperar(datos.habitaciones).igualA(34)",
          ),
        },
        {
          nombre: "las habitaciones son un número, aunque se pinten dentro de un texto",
          codigo: "esperar(componente.data().habitaciones, 'las habitaciones').esDeTipo('number')",
        },
        {
          nombre: "cero habitaciones también se pintan: cero no es «nada que pintar»",
          codigo: codigo(
            "const casa = montar(componente)",
            "casa.vm.habitaciones = 0",
            "await siguienteTick()",
            "esperar(casa.texto('.habitaciones')).igualA('0 habitaciones')",
          ),
        },
        {
          nombre: "y tres copias de la casa son tres casas de verdad",
          codigo: codigo(
            "const una = montar(componente)",
            "const otra = montar(componente)",
            "const tercera = montar(componente)",
            "una.vm.senor = 'Miles'",
            "await siguienteTick()",
            "esperar(otra.texto('.senor')).igualA('Waxillium Ladrian')",
            "esperar(tercera.texto('.senor')).igualA('Waxillium Ladrian')",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("El componente es un objeto normal y corriente con dos claves: `data` y `template`. Nada más.", 0),
    pista("`data() { return { ... } }` es lo mismo que `data: function () { return { ... } }`. Y dentro de la plantilla, los datos se pintan con dobles llaves.", 1),
    pista("`data` es un método que devuelve un objeto con las dos propiedades, escritas con los nombres exactos del enunciado. Y en la plantilla, cada dato va entre dobles llaves dentro de su etiqueta, con la clase que el test busca.", 2),
  ],
  recompensa: { croquetas: 9 },
}
