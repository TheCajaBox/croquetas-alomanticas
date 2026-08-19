import { codigo, pista } from '../comun.js'

export default {
  id: 'es6-01-const-let',
  mundo: 'es6',
  entorno: 'worker',
  tipo: 'codigo',
  titulo: 'Lo que no cambia y lo que sí',
  enunciado: codigo(
    'En los Áridos hay dos clases de números: los que no se tocan y los que cambian cada día.',
    '',
    'La **tarifa** de un rastreador no la cambia nadie. Los **días** que lleva persiguiendo a alguien, sí.',
    '',
    'Escribe:',
    '',
    '- `TARIFA_DIARIA`, que vale `25` y que nadie pueda reasignar.',
    '- `cobrar(dias)`, que devuelva lo que se le debe por esos días.',
    '',
    'Y ni una sola `var`.',
  ),
  inicial: codigo(
    '// La tarifa no se toca.',
    '',
    '',
    'function cobrar(dias) {',
    '  // Devuelve lo que se le debe.',
    '}',
  ),
  solucion: codigo(
    'const TARIFA_DIARIA = 25',
    '',
    'function cobrar(dias) {',
    '  return TARIFA_DIARIA * dias',
    '}',
  ),
  requisitos: [
    { tipo: 'prohibeVar' },
    { tipo: 'usaDeclaracion', valor: 'const' },
    { tipo: 'declaraVariable', valor: 'TARIFA_DIARIA' },
    { tipo: 'declaraVariable', valor: 'cobrar' },
  ],
  tests: [
    { nombre: 'la tarifa vale 25', codigo: 'esperar(TARIFA_DIARIA, "la tarifa").igualA(25)' },
    { nombre: 'cobra un día', codigo: 'esperar(cobrar(1)).igualA(25)' },
    { nombre: 'cobra cuatro días', codigo: 'esperar(cobrar(4)).igualA(100)' },
    { nombre: 'cobra cero días', codigo: 'esperar(cobrar(0)).igualA(0)' },
    {
      nombre: 'la tarifa no se puede reasignar',
      codigo: 'esperar(() => { TARIFA_DIARIA = 3 }).lanzaError()',
    },
  ],
  pistas: [
    pista('Una de las dos cosas no va a cambiar nunca. Esa lleva `const`. La otra ni siquiera es una variable tuya: es el parámetro.', 0),
    pista("La tarifa es la que no cambia, así que va con `const`, fuera de la función y en mayúsculas porque es un valor fijado por la casa. Dentro de `cobrar` solo queda una multiplicación y devolverla.", 1),
    pista("Son dos líneas. Una declara la tarifa fuera de la función, con el nombre exacto que pide el enunciado y en mayúsculas. La otra, dentro, devuelve esa tarifa multiplicada por los días. Nada más: es el primer reto y no hay truco escondido.", 2),
  ],
  recompensa: { croquetas: 6 },
}
