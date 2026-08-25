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
  // Aquí lo que hay que agarrar es que la cuenta salga de la constante y no de
  // un 25 escrito otra vez a mano. Las tandas lo comprueban desde fuera.
  variantes: [
    {
      titulo: 'Lo que no cambia y lo que sí · otra tanda',
      tests: [
        { nombre: 'dos días son dos tarifas', codigo: 'esperar(cobrar(2)).igualA(50)' },
        { nombre: 'diez días de rastreo, diez tarifas', codigo: 'esperar(cobrar(10)).igualA(250)' },
        { nombre: 'un mes entero detrás de alguien', codigo: 'esperar(cobrar(30)).igualA(750)' },
        {
          nombre: 'y la cuenta sale de la tarifa, no de un 25 escrito otra vez',
          codigo: 'esperar(cobrar(7), "lo que se cobra por siete días").igualA(TARIFA_DIARIA * 7)',
        },
      ],
    },
    {
      titulo: 'Lo que no cambia y lo que sí · y otra',
      tests: [
        { nombre: 'medio día se paga a medias: la multiplicación no pregunta', codigo: 'esperar(cobrar(0.5)).igualA(12.5)' },
        { nombre: 'cien días tampoco desbordan nada', codigo: 'esperar(cobrar(100)).igualA(2500)' },
        {
          nombre: 'después de cobrar, la tarifa sigue valiendo lo mismo',
          codigo: codigo('cobrar(3)', 'esperar(TARIFA_DIARIA, "la tarifa").igualA(25)'),
        },
        {
          nombre: 'y no se deja reasignar ni al mismo valor que ya tenía',
          codigo: 'esperar(() => { TARIFA_DIARIA = 25 }).lanzaError()',
        },
      ],
    },
  ],
  pistas: [
    pista('Una de las dos cosas no va a cambiar nunca. Esa lleva `const`. La otra ni siquiera es una variable tuya: es el parámetro.', 0),
    pista("La tarifa es la que no cambia, así que va con `const`, fuera de la función y en mayúsculas porque es un valor fijado por la casa. Dentro de `cobrar` solo queda una multiplicación y devolverla.", 1),
    pista("Son dos líneas. Una declara la tarifa fuera de la función, con el nombre exacto que pide el enunciado y en mayúsculas. La otra, dentro, devuelve esa tarifa multiplicada por los días. Nada más: es el primer reto y no hay truco escondido.", 2),
  ],
  recompensa: { croquetas: 6 },
}
