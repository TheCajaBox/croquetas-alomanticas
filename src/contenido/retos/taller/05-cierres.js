import { codigo, pista } from '../comun.js'

export default {
  id: "taller-05-cierres",
  mundo: "taller",
  entorno: "worker",
  tipo: "codigo",
  titulo: "Funciones que se acuerdan",
  enunciado: codigo(
    "Una función puede **recordar** cosas entre llamada y llamada sin guardarlas en",
    "ningún sitio público. Eso es un cierre, y está debajo de media biblioteca que vas",
    "a usar en tu vida.",
    "",
    "Escribe `abrirCuenta(inicial)`, que devuelve un objeto con tres funciones:",
    "",
    "- `ingresar(cantidad)` — suma y devuelve el saldo nuevo.",
    "- `gastar(cantidad)` — resta si llega, y devuelve el saldo. Si no llega, no toca",
    "  nada y devuelve el saldo tal cual.",
    "- `saldo()` — devuelve el saldo actual.",
    "",
    "El saldo **no puede quedar accesible desde fuera**: solo se toca por esas tres.",
  ),
  inicial: codigo(
    "function abrirCuenta(inicial) {",
    "  // una variable aquí, y un objeto con tres funciones que la usan",
    "}",
    "",
    "const cuenta = abrirCuenta(100)",
    "cuenta.ingresar(50)",
    "console.log(cuenta.saldo())",
  ),
  solucion: codigo(
    "function abrirCuenta(inicial) {",
    "  let saldo = inicial",
    "",
    "  return {",
    "    ingresar(cantidad) {",
    "      saldo += cantidad",
    "      return saldo",
    "    },",
    "    gastar(cantidad) {",
    "      if (cantidad <= saldo) saldo -= cantidad",
    "      return saldo",
    "    },",
    "    saldo() {",
    "      return saldo",
    "    },",
    "  }",
    "}",
    "",
    "const cuenta = abrirCuenta(100)",
    "cuenta.ingresar(50)",
    "console.log(cuenta.saldo())",
  ),
  tests: [
    {
      nombre: "empieza con lo que le pongas",
      codigo: "esperar(abrirCuenta(100).saldo()).igualA(100)",
    },
    {
      nombre: "ingresar suma y devuelve el saldo nuevo",
      codigo: codigo(
        "const c = abrirCuenta(100)",
        "esperar(c.ingresar(50)).igualA(150)",
        "esperar(c.saldo()).igualA(150)",
      ),
    },
    {
      nombre: "se acuerda entre llamadas",
      codigo: codigo(
        "const c = abrirCuenta(0)",
        "c.ingresar(10)",
        "c.ingresar(10)",
        "c.ingresar(10)",
        "esperar(c.saldo()).igualA(30)",
      ),
    },
    {
      nombre: "gastar resta cuando llega",
      codigo: codigo(
        "const c = abrirCuenta(100)",
        "esperar(c.gastar(30)).igualA(70)",
      ),
    },
    {
      nombre: "y no deja la cuenta en números rojos",
      codigo: codigo(
        "const c = abrirCuenta(100)",
        "esperar(c.gastar(500)).igualA(100)",
        "esperar(c.saldo()).igualA(100)",
      ),
    },
    {
      nombre: "dos cuentas no comparten el saldo",
      codigo: codigo(
        "const una = abrirCuenta(100)",
        "const otra = abrirCuenta(500)",
        "una.ingresar(50)",
        "esperar(otra.saldo()).igualA(500)",
      ),
    },
    {
      nombre: "el saldo no se puede tocar desde fuera",
      codigo: codigo(
        "const c = abrirCuenta(100)",
        "c.saldo = 999999",
        "c.interno = 999999",
        "esperar(abrirCuenta(100).saldo()).igualA(100)",
      ),
    },
  ],
  // Lo que se practica es que el saldo viva dentro y sobreviva a las llamadas.
  // La segunda tanda insiste en lo de fuera: pisar las funciones no da acceso.
  variantes: [
    {
      titulo: "Funciones que se acuerdan · otra tanda",
      tests: [
        {
          nombre: "una cuenta que empieza a cero también se acuerda",
          codigo: codigo(
            "const c = abrirCuenta(0)",
            "esperar(c.saldo()).igualA(0)",
            "esperar(c.ingresar(25)).igualA(25)",
          ),
        },
        {
          nombre: "gastar exactamente lo que hay la deja a cero, y eso sí se puede",
          codigo: codigo(
            "const c = abrirCuenta(40)",
            "esperar(c.gastar(40)).igualA(0)",
            "esperar(c.saldo()).igualA(0)",
          ),
        },
        {
          nombre: "uno más de lo que hay ya no se puede, y no se mueve nada",
          codigo: codigo(
            "const c = abrirCuenta(40)",
            "esperar(c.gastar(41)).igualA(40)",
            "esperar(c.saldo()).igualA(40)",
          ),
        },
        {
          nombre: "de una cuenta vacía no sale ni una croqueta",
          codigo: "esperar(abrirCuenta(0).gastar(1)).igualA(0)",
        },
        {
          nombre: "ingresos y gastos alternados y la cuenta no se pierde",
          codigo: codigo(
            "const c = abrirCuenta(10)",
            "c.ingresar(90)",
            "c.gastar(50)",
            "c.ingresar(5)",
            "esperar(c.saldo()).igualA(55)",
          ),
        },
        {
          nombre: "y tres cuentas son tres saldos, cada uno en su cierre",
          codigo: codigo(
            "const una = abrirCuenta(1)",
            "const otra = abrirCuenta(2)",
            "const tercera = abrirCuenta(3)",
            "una.ingresar(100)",
            "esperar(otra.saldo()).igualA(2)",
            "esperar(tercera.saldo()).igualA(3)",
          ),
        },
      ],
    },
    {
      titulo: "Funciones que se acuerdan · y otra",
      tests: [
        {
          nombre: "gastar cero devuelve el saldo sin mover un céntimo",
          codigo: "esperar(abrirCuenta(100).gastar(0)).igualA(100)",
        },
        {
          nombre: "lo que sale son tres funciones y nada más",
          codigo: codigo(
            "const c = abrirCuenta(1)",
            "esperar(typeof c.ingresar).igualA('function')",
            "esperar(typeof c.gastar).igualA('function')",
            "esperar(typeof c.saldo).igualA('function')",
          ),
        },
        {
          nombre: "y no hay ninguna propiedad de propina con el saldo a la vista",
          codigo: "esperar(Object.keys(abrirCuenta(100)), 'lo que se ve de la cuenta').tieneLongitud(3)",
        },
        {
          nombre: "pisar la función saldo de una cuenta no enseña nada de la siguiente",
          codigo: codigo(
            "const c = abrirCuenta(100)",
            "c.saldo = () => 999999",
            "esperar(abrirCuenta(7).saldo()).igualA(7)",
          ),
        },
        {
          nombre: "lo que devuelve saldo es un número, no una promesa ni un texto",
          codigo: "esperar(abrirCuenta(5).saldo(), 'el saldo').esDeTipo('number')",
        },
      ],
    },
  ],
  pistas: [
    pista("La variable del saldo va en `abrirCuenta`, **antes** del `return`. Las tres funciones de dentro la ven.", 0),
    pista("Tiene que ser `let`: `const` no dejaría sumarle ni restarle.", 1),
    pista("`gastar` tiene que devolver el saldo pase lo que pase, se haya restado o no. Si pones el `return` dentro del `if`, el caso de «no le llega» se va de la función sin devolver nada, y ese es justo el test que se pone rojo.", 2),
  ],
  recompensa: { croquetas: 11 },
}
