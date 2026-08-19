import { codigo, pista } from '../comun.js'

export default {
  id: "com-05-recorrer",
  mundo: "comisaria",
  entorno: "worker",
  tipo: "ordenar",
  titulo: "Pasar lista",
  enunciado: codigo(
    "Un bucle es un programa que se repite. Estas líneas son un bucle que cuenta cuántos",
    "avisos hay sin atender, pero están desordenadas.",
    "",
    "Colócalas y se ejecutará **en el orden que las dejes**. Si te equivocas, verás",
    "exactamente qué se rompe: es mucho más útil que un «incorrecto».",
  ),
  lineas: [
    "const avisos = ['atendido', 'pendiente', 'pendiente', 'atendido', 'pendiente']",
    "let pendientes = 0",
    "for (const aviso of avisos) {",
    "  if (aviso === 'pendiente') {",
    "    pendientes += 1",
    "  }",
    "}",
    "console.log(`Quedan ${pendientes} avisos por atender`)",
  ],
  tests: [
    {
      nombre: "cuenta tres pendientes",
      codigo: "esperar(pendientes).igualA(3)",
    },
    {
      nombre: "y lo dice al final, cuando ya están contados",
      codigo: codigo(
        "esperar(consola.map((linea) => linea.texto).join(String.fromCharCode(10)))",
        "  .diceLoMismoQue('Quedan 3 avisos por atender')",
      ),
    },
  ],
  pistas: [
    pista("Lo primero es tener la lista. Lo último, decir el resultado: si lo dices antes de contar, dirás cero.", 0),
    pista("El contador tiene que existir **antes** de que empiece el bucle, o dentro no habría nada que sumar.", 1),
    pista("Lista, contador a cero, `for`, `if` dentro, la suma dentro del `if`, y las dos llaves de cierre antes del `console.log`.", 2),
  ],
  recompensa: { croquetas: 6 },
}
