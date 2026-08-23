import { codigo, pista } from '../comun.js'

export default {
  id: "taller-01-clases",
  mundo: "taller",
  entorno: "worker",
  tipo: "codigo",
  titulo: "Objetos que saben hacer cosas",
  enunciado: codigo(
    "Hasta ahora tus objetos eran **datos**. Una clase es un molde que fabrica objetos",
    "con datos **y** con comportamiento pegado.",
    "",
    "Escribe la clase `Revolver`:",
    "",
    "- El constructor recibe la capacidad del tambor y lo deja **cargado del todo**.",
    "- `disparar()` — gasta una bala y devuelve `true`. Si no quedaba ninguna, no gasta",
    "  nada y devuelve `false`.",
    "- `recargar()` — vuelve a dejarlo lleno.",
    "- `get vacio` — vale `true` cuando no quedan balas.",
    "",
    "Las balas que queden se guardan en la propiedad `balas`.",
  ),
  inicial: codigo(
    "class Revolver {",
    "  constructor(capacidad) {",
    "    // guarda la capacidad y déjalo cargado",
    "  }",
    "",
    "  // disparar(), recargar() y el get vacio",
    "}",
    "",
    "const arma = new Revolver(6)",
    "arma.disparar()",
    "console.log(arma.balas)",
  ),
  solucion: codigo(
    "class Revolver {",
    "  constructor(capacidad) {",
    "    this.capacidad = capacidad",
    "    this.balas = capacidad",
    "  }",
    "",
    "  disparar() {",
    "    if (this.balas === 0) return false",
    "    this.balas -= 1",
    "    return true",
    "  }",
    "",
    "  recargar() {",
    "    this.balas = this.capacidad",
    "  }",
    "",
    "  get vacio() {",
    "    return this.balas === 0",
    "  }",
    "}",
    "",
    "const arma = new Revolver(6)",
    "arma.disparar()",
    "console.log(arma.balas)",
  ),
  requisitos: [
    { tipo: "usaDeclaracion", valor: "class" },
  ],
  tests: [
    {
      nombre: "nace cargado del todo",
      codigo: "esperar(new Revolver(6).balas).igualA(6)",
    },
    {
      nombre: "la capacidad la decide quien lo fabrica",
      codigo: "esperar(new Revolver(2).balas).igualA(2)",
    },
    {
      nombre: "disparar gasta una bala y dice que sí",
      codigo: codigo(
        "const a = new Revolver(6)",
        "esperar(a.disparar()).esVerdadero()",
        "esperar(a.balas).igualA(5)",
      ),
    },
    {
      nombre: "con el tambor vacío no dispara ni se pone en negativo",
      codigo: codigo(
        "const a = new Revolver(1)",
        "a.disparar()",
        "esperar(a.disparar()).esFalso()",
        "esperar(a.balas).igualA(0)",
      ),
    },
    {
      nombre: "recargar lo deja como estaba",
      codigo: codigo(
        "const a = new Revolver(6)",
        "a.disparar()",
        "a.disparar()",
        "a.recargar()",
        "esperar(a.balas).igualA(6)",
      ),
    },
    {
      nombre: "vacio se pide sin paréntesis y siempre está al día",
      codigo: codigo(
        "const a = new Revolver(1)",
        "esperar(a.vacio).esFalso()",
        "a.disparar()",
        "esperar(a.vacio).esVerdadero()",
      ),
    },
    {
      nombre: "dos revólveres no comparten balas",
      codigo: codigo(
        "const a = new Revolver(6)",
        "const b = new Revolver(6)",
        "a.disparar()",
        "esperar(b.balas).igualA(6)",
      ),
    },
  ],
  // Tambores de otro tamaño, incluido el de capacidad cero, que nace vacío. Lo
  // que se vuelve a practicar es guardar la capacidad para poder recargar.
  variantes: [
    {
      titulo: "Objetos que saben hacer cosas · otra tanda",
      tests: [
        { nombre: "un tambor de tres nace con tres", codigo: "esperar(new Revolver(3).balas).igualA(3)" },
        {
          nombre: "tres disparos lo dejan seco",
          codigo: codigo(
            "const a = new Revolver(3)",
            "a.disparar()",
            "a.disparar()",
            "a.disparar()",
            "esperar(a.balas).igualA(0)",
            "esperar(a.vacio).esVerdadero()",
          ),
        },
        {
          nombre: "el cuarto disparo dice que no y no toca nada",
          codigo: codigo(
            "const a = new Revolver(3)",
            "a.disparar()",
            "a.disparar()",
            "a.disparar()",
            "esperar(a.disparar()).esFalso()",
            "esperar(a.balas).igualA(0)",
          ),
        },
        {
          nombre: "recargarlo después de vaciarlo lo devuelve a tres",
          codigo: codigo(
            "const a = new Revolver(3)",
            "a.disparar()",
            "a.disparar()",
            "a.disparar()",
            "a.recargar()",
            "esperar(a.balas).igualA(3)",
            "esperar(a.vacio).esFalso()",
          ),
        },
        {
          nombre: "y un revólver de capacidad cero nace vacío y no dispara jamás",
          codigo: codigo(
            "const z = new Revolver(0)",
            "esperar(z.vacio).esVerdadero()",
            "esperar(z.disparar()).esFalso()",
            "esperar(z.balas).igualA(0)",
          ),
        },
      ],
    },
    {
      titulo: "Objetos que saben hacer cosas · y otra",
      tests: [
        {
          nombre: "recargar sin haber disparado no añade balas de la nada",
          codigo: codigo(
            "const a = new Revolver(6)",
            "a.recargar()",
            "esperar(a.balas).igualA(6)",
          ),
        },
        {
          nombre: "recargar dos veces rellena, no suma",
          codigo: codigo(
            "const a = new Revolver(6)",
            "a.disparar()",
            "a.disparar()",
            "a.disparar()",
            "a.recargar()",
            "a.recargar()",
            "esperar(a.balas).igualA(6)",
          ),
        },
        {
          nombre: "cada disparo que sale dice que sí, y el que no sale dice que no",
          codigo: codigo(
            "const a = new Revolver(2)",
            "esperar(a.disparar()).esVerdadero()",
            "esperar(a.disparar()).esVerdadero()",
            "esperar(a.disparar()).esFalso()",
          ),
        },
        { nombre: "vacio es un booleano y no un texto que lo parezca", codigo: "esperar(new Revolver(1).vacio, 'vacio').esDeTipo('boolean')" },
        {
          nombre: "y un tambor de doce aguanta tres tiros sin pestañear",
          codigo: codigo(
            "const a = new Revolver(12)",
            "a.disparar()",
            "a.disparar()",
            "a.disparar()",
            "esperar(a.balas).igualA(9)",
            "esperar(a.vacio).esFalso()",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Dentro de la clase, todo lo que quieras recordar entre llamadas se guarda en `this.algo`.", 0),
    pista("`recargar` necesita saber a cuánto volver, así que la capacidad hay que guardarla en el constructor, no solo usarla.", 1),
    pista("Sal pronto del caso raro: la primera línea de `disparar` comprueba si el tambor está a cero y se va con `false` sin tocar nada. Todo lo que venga detrás ya puede dar por hecho que queda al menos una bala, y así el método se lee de un vistazo.", 2),
  ],
  recompensa: { croquetas: 10 },
}
