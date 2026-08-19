import { codigo, pista } from '../comun.js'

export default {
  id: "dia1-04-rellenar",
  mundo: "primer-dia",
  entorno: "worker",
  tipo: "completar",
  titulo: "Rellena los huecos",
  enunciado: codigo(
    "Este programa está casi entero. Le faltan cuatro piezas.",
    "",
    "Elige una ficha de abajo y pulsa el hueco donde va. Si te equivocas, pulsa el hueco",
    "otra vez y la sueltas. Cuando estén los cuatro, se ejecuta de verdad.",
    "",
    "Sobran fichas a propósito: no vale ir por descarte.",
  ),
  plantilla: codigo(
    "___ SOMBREROS = 3",
    "___ prestados = 1",
    "",
    "console.___(`Wayne tiene ${SOMBREROS ___ prestados} sombreros`)",
  ),
  solucion: codigo(
    "const SOMBREROS = 3",
    "const prestados = 1",
    "",
    "console.log(`Wayne tiene ${SOMBREROS - prestados} sombreros`)",
  ),
  fichas: ["const", "let", "log", "-", "+", "var", "print", "escribir"],
  requisitos: [
    { tipo: "prohibeVar" },
  ],
  tests: [
    {
      nombre: "escribe la cuenta bien hecha",
      codigo: codigo(
        "esperar(consola.map((linea) => linea.texto).join(String.fromCharCode(10)))",
        "  .diceLoMismoQue('Wayne tiene 2 sombreros')",
      ),
    },
  ],
  pistas: [
    pista("Los dos primeros huecos son formas de guardar algo. El tercero es lo que escribe en pantalla. El cuarto es una cuenta.", 0),
    pista("Tiene 3 sombreros y ha prestado 1, así que le quedan 2. Piensa qué operación es esa.", 1),
    pista("Los dos primeros huecos son la misma palabra, la de guardar algo que no va a cambiar. El tercero es lo que escribe en pantalla y lo tienes en el primer ejemplo del apunte. Y el cuarto es la operación que convierte un 3 y un 1 en un 2.", 2),
  ],
  recompensa: { croquetas: 6 },
}
