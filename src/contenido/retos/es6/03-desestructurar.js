import { codigo, pista } from '../comun.js'

export default {
  id: "es6-03-desestructurar",
  mundo: "es6",
  entorno: "worker",
  tipo: "codigo",
  titulo: "La ficha del buscado",
  enunciado: codigo(
    "Te llega un cartel de busca y captura y hay que resumirlo. Los carteles vienen como",
    "salen de la imprenta: a algunos les falta la recompensa, otros no describen las señas,",
    "y casi todos traen datos de más que aquí no interesan.",
    "",
    "Escribe `resumirCartel(cartel)`, que devuelva un objeto con:",
    "",
    "- `nombre`",
    "- `recompensa`, y si el cartel no la trae, `0`",
    "- `sombrero`, que viene dentro de `senas`, y si no lo dice, `'ninguno'`",
    "- `otros`, con **todo lo demás** que trajera el cartel",
    "",
    "Y hazlo desestructurando en la propia firma de la función. Nada de leer propiedades",
    "una por una ahí dentro.",
  ),
  inicial: codigo(
    "function resumirCartel(cartel) {",
    "  // Desestructura aquí arriba, en el paréntesis, no dentro.",
    "}",
  ),
  solucion: codigo(
    "function resumirCartel({ nombre, recompensa = 0, senas: { sombrero = 'ninguno' } = {}, ...otros }) {",
    "  return { nombre, recompensa, sombrero, otros }",
    "}",
  ),
  requisitos: [
    { tipo: "usaDesestructuracion" },
    { tipo: "usaSpread" },
    { tipo: "usaParametroPorDefecto" },
    { tipo: "prohibeVar" },
    { tipo: "declaraVariable", valor: "resumirCartel" },
  ],
  tests: [
    {
      nombre: "resume un cartel completo",
      codigo: codigo(
        "esperar(resumirCartel({",
        "  nombre: 'Wayne',",
        "  recompensa: 500,",
        "  senas: { sombrero: 'hongo', altura: 'media' },",
        "  vivo: true,",
        "  zona: 'Áridos',",
        "})).igualA({",
        "  nombre: 'Wayne',",
        "  recompensa: 500,",
        "  sombrero: 'hongo',",
        "  otros: { vivo: true, zona: 'Áridos' },",
        "})",
      ),
    },
    { nombre: "sin recompensa, pone 0", codigo: "esperar(resumirCartel({ nombre: 'Marasi' }).recompensa).igualA(0)" },
    { nombre: "sin señas, el sombrero es ninguno", codigo: "esperar(resumirCartel({ nombre: 'Marasi' }).sombrero).igualA('ninguno')" },
    { nombre: "sin datos de más, otros queda vacío", codigo: "esperar(resumirCartel({ nombre: 'Wax', recompensa: 10 }).otros).igualA({})" },
    {
      nombre: "senas no se cuela dentro de otros",
      codigo: codigo(
        "const ficha = resumirCartel({ nombre: 'Wax', senas: { sombrero: 'de copa' }, alias: 'Coincidente' })",
        "esperar(ficha.otros).igualA({ alias: 'Coincidente' })",
        "esperar(ficha.sombrero).igualA('de copa')",
      ),
    },
  ],
  // Carteles nuevos, y de los que llegan mal: sin nombre, con `senas` vacío y
  // con un `null` donde tocaba un número. El valor por defecto solo tapa lo que
  // falta, y esa distinción es la mitad de la lección.
  variantes: [
    {
      titulo: "La ficha del buscado · otra tanda",
      tests: [
        {
          nombre: "un cartel con señas pero sin sombrero: las demás señas se quedan fuera del resumen",
          codigo: codigo(
            "esperar(resumirCartel({",
            "  nombre: 'Miles',",
            "  senas: { altura: 'alto' },",
            "  arma: 'aluminio',",
            "})).igualA({",
            "  nombre: 'Miles',",
            "  recompensa: 0,",
            "  sombrero: 'ninguno',",
            "  otros: { arma: 'aluminio' },",
            "})",
          ),
        },
        {
          nombre: "una recompensa de cero escrita a mano sigue siendo cero",
          codigo: "esperar(resumirCartel({ nombre: 'Wayne', recompensa: 0 }).recompensa).igualA(0)",
        },
        {
          nombre: "y un null se queda null: el valor por defecto solo tapa lo que falta",
          codigo: "esperar(resumirCartel({ nombre: 'Wayne', recompensa: null }).recompensa).igualA(null)",
        },
        {
          nombre: "todo lo que sobra acaba en otros, aunque sean cuatro cosas",
          codigo: codigo(
            "const ficha = resumirCartel({",
            "  nombre: 'Paalm',",
            "  vivo: false,",
            "  zona: 'Elendel',",
            "  alias: 'Bleeder',",
            "  peligro: 10,",
            "})",
            "esperar(ficha.otros).igualA({ vivo: false, zona: 'Elendel', alias: 'Bleeder', peligro: 10 })",
          ),
        },
      ],
    },
    {
      titulo: "La ficha del buscado · y otra",
      tests: [
        {
          nombre: "un senas vacío también deja el sombrero en ninguno",
          codigo: "esperar(resumirCartel({ nombre: 'Wax', senas: {} }).sombrero).igualA('ninguno')",
        },
        {
          nombre: "el resumen tiene siempre esas cuatro claves, venga lo que venga",
          codigo: "esperar(Object.keys(resumirCartel({ nombre: 'Wax' })), 'las claves del resumen').tieneLongitud(4)",
        },
        {
          nombre: "un cartel pelado, con solo el nombre, se rellena entero",
          codigo: codigo(
            "esperar(resumirCartel({ nombre: 'Steris' })).igualA({",
            "  nombre: 'Steris',",
            "  recompensa: 0,",
            "  sombrero: 'ninguno',",
            "  otros: {},",
            "})",
          ),
        },
        {
          nombre: "y el nombre que no viene sale undefined: nadie prometió taparlo",
          codigo: "esperar(resumirCartel({ recompensa: 3 }).nombre, 'el nombre').igualA(undefined)",
        },
        {
          nombre: "el cartel original no se toca: desestructurar copia, no vacía",
          codigo: codigo(
            "const cartel = { nombre: 'Wax', senas: { sombrero: 'de copa' }, zona: 'Áridos' }",
            "resumirCartel(cartel)",
            "esperar(Object.keys(cartel), 'las claves del cartel').tieneLongitud(3)",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Todo se hace en el paréntesis de la función. Ahí dentro puedes desestructurar, poner valores por defecto y recoger el resto.", 0),
    pista("Para lo de dentro de `senas` se anida: `senas: { sombrero = 'ninguno' }`. Y ojo, que `senas` puede no venir: dale también un valor por defecto, `= {}`.", 1),
    pista("`function resumirCartel({ nombre, recompensa = 0, senas: { sombrero = 'ninguno' } = {}, ...otros })` y devuelve `{ nombre, recompensa, sombrero, otros }`.", 2),
  ],
  recompensa: { croquetas: 10 },
}
