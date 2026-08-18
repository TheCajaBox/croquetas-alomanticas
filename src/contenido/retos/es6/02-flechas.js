import { codigo, pista } from '../comun.js'

export default {
  id: "es6-02-flechas",
  mundo: "es6",
  entorno: "worker",
  tipo: "bug",
  titulo: "El turno que se perdió por el camino",
  enunciado: codigo(
    "Este código pasa lista a la guardia. Debería decir en qué turno está cada uno.",
    "",
    "No dice nada: revienta.",
    "",
    "El problema es que la función de dentro **no sabe quién es `this`**. Una función normal",
    "se trae su propio `this`; una función flecha se queda con el de fuera, que es justo el",
    "que aquí hace falta.",
    "",
    "Arréglalo sin tocar los datos ni el texto que se devuelve.",
  ),
  inicial: codigo(
    "const guardia = {",
    "  turno: 'noche',",
    "  nombres: ['Wayne', 'Marasi', 'Wax'],",
    "  pasarLista() {",
    "    return this.nombres.map(function (nombre) {",
    "      return `${nombre} está en el turno de ${this.turno}`",
    "    })",
    "  },",
    "}",
  ),
  solucion: codigo(
    "const guardia = {",
    "  turno: 'noche',",
    "  nombres: ['Wayne', 'Marasi', 'Wax'],",
    "  pasarLista() {",
    "    return this.nombres.map((nombre) => `${nombre} está en el turno de ${this.turno}`)",
    "  },",
    "}",
  ),
  requisitos: [
    { tipo: "usaFlecha" },
    { tipo: "usaPlantilla" },
    { tipo: "declaraVariable", valor: "guardia" },
  ],
  tests: [
    { nombre: "pasa lista a los tres", codigo: "esperar(guardia.pasarLista()).tieneLongitud(3)" },
    {
      nombre: "cada uno con su turno",
      codigo: codigo(
        "esperar(guardia.pasarLista()).igualA([",
        "  'Wayne está en el turno de noche',",
        "  'Marasi está en el turno de noche',",
        "  'Wax está en el turno de noche',",
        "])",
      ),
    },
    {
      nombre: "si cambia el turno, cambia la lista",
      codigo: codigo(
        "guardia.turno = 'día'",
        "esperar(guardia.pasarLista()[0]).igualA('Wayne está en el turno de día')",
      ),
    },
  ],
  pistas: [
    pista("El error está en la función que va dentro de `map`. Fíjate en cómo empieza.", 0),
    pista("Una función flecha no tiene `this` propio: usa el del sitio donde está escrita. Aquí eso es justo lo que quieres.", 1),
    pista("Cambia `function (nombre) { return ... }` por `(nombre) => ...`. Con eso `this.turno` vuelve a ser el del objeto.", 2),
  ],
  recompensa: { croquetas: 15 },
}
