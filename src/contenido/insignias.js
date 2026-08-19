/**
 * Las insignias que apunta Marasi.
 *
 * ## Por qué no dan croquetas
 *
 * Por lo mismo que no las dan sus revisiones de código, y merece la pena
 * escribirlo otra vez porque es la decisión que sostiene todo esto: **pagar por
 * ellas las convertiría en requisitos**. En cuanto una insignia da croquetas
 * deja de ser un reconocimiento y pasa a ser una tarea pendiente, y entonces no
 * hacerla se siente como perder algo.
 *
 * Aquí son lo contrario: nadie las pide, no aparecen en ninguna lista de cosas
 * por hacer, y quien no se entere de que existen jugará exactamente igual. La
 * economía tampoco se mueve, que era el otro requisito -las croquetas por reto
 * se acaban de calibrar y no se tocan-.
 *
 * ## Cómo se eligen
 *
 * Cada una tiene que premiar algo que **ya estabas haciendo bien**, no algo que
 * haya que ir a buscar. Ninguna dice «juega veinte días seguidos» ni «entra a
 * las tres de la mañana»: eso es tirar del jugador, y este juego no va de eso.
 *
 * `cumple` recibe los almacenes ya leídos y devuelve un booleano. Se comprueban
 * al superar un reto y al terminar un repaso, que es cuando puede cambiar algo.
 */
export const INSIGNIAS = [
  {
    id: 'primer-mundo',
    nombre: 'Primer día resuelto',
    porque: 'Terminaste tu primer mundo entero. Lo demás es esto mismo, más veces.',
    cumple: ({ progreso }) => progreso.mundosCompletados >= 1,
  },
  {
    id: 'medio-camino',
    nombre: 'A mitad de la cuesta',
    porque: 'Cuarenta y cinco retos. Ya no estás aprendiendo a programar: estás programando.',
    cumple: ({ progreso }) => progreso.retosSuperados >= 45,
  },
  {
    id: 'todo-el-camino',
    nombre: 'La línea entera',
    porque: 'Los noventa retos. No queda nada de este juego que no hayas resuelto.',
    cumple: ({ progreso, totalDeRetos }) => progreso.retosSuperados >= totalDeRetos,
  },
  {
    id: 'sin-preguntar',
    nombre: 'Sin preguntarle a Wayne',
    porque: 'Un mundo entero sin comprar una sola pista. Él lo lleva peor que tú.',
    cumple: ({ mundosSinPistas }) => mundosSinPistas >= 1,
  },
  {
    id: 'racha-de-diez',
    nombre: 'Diez de seguido',
    porque: 'Diez retos encadenados sin pedir una pista. Eso ya no es suerte.',
    cumple: ({ progreso }) => progreso.mejorRacha >= 10,
  },
  {
    id: 'racha-de-veinte',
    nombre: 'Veinte de seguido',
    porque: 'Veinte. A estas alturas el puesto de Wayne es decorativo.',
    cumple: ({ progreso }) => progreso.mejorRacha >= 20,
  },
  {
    id: 'jefe-limpio',
    nombre: 'Un jefe a la primera',
    porque: 'Cerraste un mundo sin fallar ni una vez. Y los jefes no tienen pistas.',
    cumple: ({ jefesALaPrimera }) => jefesALaPrimera >= 1,
  },
  {
    id: 'tres-jefes-limpios',
    nombre: 'Tres jefes a la primera',
    porque: 'Tres finales de mundo sin un solo intento fallido.',
    cumple: ({ jefesALaPrimera }) => jefesALaPrimera >= 3,
  },
  {
    id: 'todos-los-jefes',
    nombre: 'Los nueve finales',
    porque: 'Ni un mundo se ha quedado sin cerrar.',
    cumple: ({ progreso, totalDeMundos }) => progreso.jefesDerrotados >= totalDeMundos,
  },
  {
    id: 'repaso-bordado',
    nombre: 'Un caso sin fisuras',
    porque: 'Un repaso de Marasi con las seis. Ella no lo dirá, pero le ha gustado.',
    cumple: ({ repasos }) => repasos.perfectos >= 1,
  },
  {
    id: 'todos-los-repasos',
    nombre: 'El expediente completo',
    porque: 'Todos los repasos bordados. Marasi ya no tiene nada que objetarte.',
    cumple: ({ repasos, totalDeMundos }) => repasos.perfectos >= totalDeMundos,
  },
  {
    id: 'coleccionista',
    nombre: 'La sombrerera llena',
    porque: 'Los catorce sombreros. Wayne jura que eran todos suyos.',
    cumple: ({ sombreros }) => sombreros.estanTodos,
  },
  {
    id: 'lector',
    nombre: 'Nueve recortes',
    porque: 'Todo el Elendel Daily. Los titulares son broma; los consejos del pie, no.',
    cumple: ({ recortes }) => recortes.cuantos >= recortes.total,
  },
  {
    id: 'colonia-entera',
    nombre: 'Los diez metales',
    porque: 'Los diez gatos adoptados. Incluido Aluminio, que no sirve para nada.',
    cumple: ({ gatos }) => gatos.adoptados.length >= 10,
  },
  {
    id: 'colonia-contenta',
    nombre: 'Nadie triste',
    porque: 'Toda la colonia por encima del umbral a la vez. Cuesta más de lo que parece.',
    cumple: ({ gatos }) => gatos.adoptados.length >= 5 && gatos.adoptados.every((g) => g.felicidad >= 60),
  },
  {
    id: 'sin-red',
    nombre: 'Sin red',
    porque: 'Un mundo entero a la primera, reto a reto, sin un solo intento fallido.',
    cumple: ({ mundosALaPrimera }) => mundosALaPrimera >= 1,
  },
  {
    id: 'limpio',
    nombre: 'Nada que objetar',
    porque: 'Diez retos seguidos sin que Marasi te encontrara una sola pega en el código.',
    cumple: ({ revisionesLimpias }) => revisionesLimpias >= 10,
  },
  {
    id: 'insistente',
    nombre: 'La tercera va la vencida',
    porque: 'Un reto que se te resistió cinco veces y acabaste sacando. Cuenta doble.',
    cumple: ({ retosPeleados }) => retosPeleados >= 1,
  },
]

export const INSIGNIAS_POR_ID = Object.fromEntries(INSIGNIAS.map((i) => [i.id, i]))
