import { codigo, pista } from '../comun.js'

export default {
  id: "dia1-02-tipos",
  mundo: "primer-dia",
  entorno: "worker",
  tipo: "emparejar",
  titulo: "Cada cosa de su clase",
  enunciado: codigo(
    "No todo lo que se guarda es igual. Un nombre no es un número, y una lista de",
    "gatos no es un gato.",
    "",
    "Empareja cada valor con lo que es. Pulsa uno de la izquierda y su pareja de la derecha.",
  ),
  parejas: [
    { izquierda: "'bombín'", derecha: "Un texto" },
    { izquierda: "42", derecha: "Un número" },
    { izquierda: "true", derecha: "Un booleano: verdadero o falso" },
    { izquierda: "['Acero', 'Bronce']", derecha: "Una lista de valores en orden" },
    { izquierda: "{ nombre: 'Wayne' }", derecha: "Un objeto: valores con nombre" },
    { izquierda: "null", derecha: "Aquí no hay nada, y es a propósito" },
  ],
  pistas: [
    pista("Mírale los signos de fuera a cada uno: las comillas, los corchetes, las llaves. Cada envoltorio delata lo que hay dentro.", 0),
    pista("Los corchetes `[ ]` son de listas. Las llaves `{ }`, de objetos. Las comillas, de texto.", 1),
    pista("Comillas → texto. Sin comillas y con cifras → número. `true` → booleano. `[ ]` → lista. `{ }` → objeto. `null` → nada, aposta.", 2),
  ],
  recompensa: { croquetas: 5 },
}
