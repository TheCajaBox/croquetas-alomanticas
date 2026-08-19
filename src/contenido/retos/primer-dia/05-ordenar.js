import { codigo, pista } from '../comun.js'

export default {
  id: "dia1-05-ordenar",
  mundo: "primer-dia",
  entorno: "worker",
  tipo: "ordenar",
  titulo: "Cada cosa a su tiempo",
  enunciado: codigo(
    "Un programa se lee de arriba abajo, y ese orden **no es un detalle**: no puedes usar",
    "algo antes de haberlo creado.",
    "",
    "Estas cuatro líneas están desordenadas. Colócalas con las flechas y ejecútalo.",
    "",
    "Y si te equivocas, no pasa nada: se ejecuta igual y verás con tus ojos qué se rompe.",
  ),
  lineas: [
    "const gatos = ['Acero', 'Bronce']",
    "gatos.push('Peltre')",
    "const cuantos = gatos.length",
    "console.log(`En la colonia hay ${cuantos} gatos`)",
  ],
  tests: [
    {
      nombre: "cuenta los tres gatos",
      codigo: codigo(
        "esperar(consola.map((linea) => linea.texto).join(String.fromCharCode(10)))",
        "  .diceLoMismoQue('En la colonia hay 3 gatos')",
      ),
    },
  ],
  pistas: [
    pista("Empieza por la única línea que no necesita que exista nada de antes.", 0),
    pista("Hay que crear la lista, meter el gato nuevo, contar y luego escribir. Contar antes de meterlo da 2, no 3.", 1),
    pista("Crear la lista → `push` → contar con `length` → `console.log`. En ese orden exacto.", 2),
  ],
  recompensa: { croquetas: 6 },
}
