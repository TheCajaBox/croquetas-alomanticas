/**
 * La colonia.
 *
 * Un gato por metal alomántico: la personalidad sale del poder del metal y el
 * beneficio también. Todos los beneficios están de verdad implementados en el
 * juego (ver src/almacen/gatos.js), salvo el de Aluminio, que no da nada a
 * propósito y es la mitad de la broma.
 *
 * Los desbloqueos son:
 *   retosResueltos   - haber superado N retos
 *   mundoCompletado  - haber terminado un mundo concreto
 *   jefesDerrotados  - haber tumbado N jefes
 *   rachaSinPistas   - N retos seguidos sin pedir una sola pista
 *   croquetasGastadas- haberse dejado N croquetas en pistas de Wayne
 */

export const GATOS = [
  {
    id: 'acero',
    nombre: 'Acero',
    metal: 'acero',
    grupo: 'Violento',
    poder: 'Lanzamonedas',
    personalidad: 'Empuja cosas al vacío desde el borde de la mesa. No por maldad: por vocación.',
    presentacion: 'Un gato que ha entendido la gravedad mejor que tú y la usa contra tus objetos.',
    aspecto: { pelo: '#8494a6', manchas: '#5d6c7d', ojos: '#cfe3ff', patron: 'rayas' },
    bonus: {
      id: 'croquetasExtra',
      titulo: 'Empujón',
      descripcion: 'Un 10 % más de croquetas por cada reto que superes.',
    },
    desbloqueo: { tipo: 'retosResueltos', valor: 1, texto: 'Supera tu primer reto.' },
  },
  {
    id: 'hierro',
    nombre: 'Hierro',
    metal: 'hierro',
    grupo: 'Violento',
    poder: 'Aferrador',
    personalidad: 'Atrae hacia sí todo lo metálico de la casa, y también tu teclado, que no lo es.',
    presentacion: 'Si algo desaparece, está debajo de Hierro. Siempre está debajo de Hierro.',
    aspecto: { pelo: '#4f5560', manchas: '#33373f', ojos: '#f0c987', patron: 'liso' },
    bonus: {
      id: 'pistasBaratas',
      titulo: 'Tirón',
      descripcion: 'Las pistas de pago te cuestan la mitad.',
    },
    desbloqueo: { tipo: 'retosResueltos', valor: 5, texto: 'Supera 5 retos.' },
  },
  {
    id: 'peltre',
    nombre: 'Peltre',
    metal: 'peltre',
    grupo: 'Interno',
    poder: 'Violento',
    personalidad: 'Musculadísimo y agotado. Duerme catorce horas para recuperarse de las otras diez.',
    presentacion: 'Puede saltar a lo alto del armario. Lo hace una vez al mes y luego descansa.',
    aspecto: { pelo: '#a89b8c', manchas: '#7d7266', ojos: '#8fd18f', patron: 'calcetines' },
    bonus: {
      id: 'rachaResistente',
      titulo: 'Aguante',
      descripcion: 'Una sola pista ya no te rompe la racha de retos limpios.',
    },
    desbloqueo: { tipo: 'mundoCompletado', valor: 'es6', texto: 'Termina Los Áridos.' },
  },
  {
    id: 'estano',
    nombre: 'Estaño',
    metal: 'estaño',
    grupo: 'Interno',
    poder: 'Ojo de Estaño',
    personalidad: 'Oye la bolsa del pienso desde la otra punta de la casa. Y a través de una puerta.',
    presentacion: 'Se despierta si piensas en la cocina. No hace falta que vayas.',
    aspecto: { pelo: '#d8d4cc', manchas: '#b3aea4', ojos: '#7fd8e8', patron: 'manchas' },
    bonus: {
      id: 'avisoDeRequisitos',
      titulo: 'Oído fino',
      descripcion: 'Te avisa de los requisitos que incumples mientras escribes, sin ejecutar nada.',
    },
    desbloqueo: { tipo: 'retosResueltos', valor: 3, texto: 'Supera 3 retos.' },
  },
  {
    id: 'bronce',
    nombre: 'Bronce',
    metal: 'bronce',
    grupo: 'Mental',
    poder: 'Rastreador',
    personalidad: 'Te encuentra. Da igual dónde te metas ni cuánto rato lleves ahí. Te encuentra.',
    presentacion: 'No busca: sabe. Es distinto y da bastante más miedo.',
    aspecto: { pelo: '#a97b4a', manchas: '#7d5730', ojos: '#ffd98a', patron: 'rayas' },
    bonus: {
      id: 'primerFalloDestacado',
      titulo: 'Rastro',
      descripcion: 'Destaca el primer test que falla y aparta los demás de en medio.',
    },
    desbloqueo: { tipo: 'jefesDerrotados', valor: 1, texto: 'Derrota a tu primer jefe.' },
  },
  {
    id: 'cobre',
    nombre: 'Cobre',
    metal: 'cobre',
    grupo: 'Mental',
    poder: 'Ocultador',
    personalidad: 'Indetectable durante horas. Aparece exactamente cuando se abre una lata.',
    presentacion: 'Nadie lo ha visto entrar en ninguna habitación, y sin embargo siempre está dentro.',
    aspecto: { pelo: '#c07d4f', manchas: '#96593a', ojos: '#9fe0b0', patron: 'manchas' },
    bonus: {
      id: 'pistaGratisDiaria',
      titulo: 'Nube de cobre',
      descripcion: 'Una pista de pago al día sale gratis. Wayne no se entera.',
    },
    desbloqueo: { tipo: 'retosResueltos', valor: 8, texto: 'Supera 8 retos.' },
  },
  {
    id: 'laton',
    nombre: 'Latón',
    metal: 'latón',
    grupo: 'Mental',
    poder: 'Aplacador',
    personalidad: 'Te mira fijamente hasta que te sientes mal por cosas que ni siquiera has hecho.',
    presentacion: 'Aplaca a toda la colonia. También te aplaca a ti, y ni te das cuenta.',
    aspecto: { pelo: '#c9a94e', manchas: '#9c8034', ojos: '#c3b6ff', patron: 'liso' },
    bonus: {
      id: 'calmaColonia',
      titulo: 'Calma',
      descripcion: 'Toda la colonia pierde felicidad la mitad de rápido.',
    },
    desbloqueo: { tipo: 'mundoCompletado', valor: 'vue2', texto: 'Termina la mansión Ladrian.' },
  },
  {
    id: 'oro',
    nombre: 'Oro',
    metal: 'oro',
    grupo: 'Temporal',
    poder: 'Sanguíneo',
    personalidad: 'Se cae de sitios imposibles y aterriza como si lo hubiera planeado. Nunca lo planea.',
    presentacion: 'Lleva siete vidas gastadas y no parece preocupado por las que quedan.',
    aspecto: { pelo: '#e0b64a', manchas: '#b58a28', ojos: '#ffe9a8', patron: 'calcetines' },
    bonus: {
      id: 'segundaOportunidad',
      titulo: 'Se cura solo',
      descripcion: 'El primer intento fallido de cada reto no cuenta.',
    },
    desbloqueo: { tipo: 'mundoCompletado', valor: 'vue3', texto: 'Termina La Nueva Seran.' },
  },
  {
    id: 'bendalloy',
    nombre: 'Bendaloy',
    metal: 'bendaloy',
    grupo: 'Temporal',
    poder: 'Deslizante',
    personalidad: 'Duerme dentro de una burbuja donde el tiempo va a su aire. Sobre todo el de la siesta.',
    presentacion: 'Entra en la burbuja, echa una cabezada de dos horas y sale como si nada.',
    aspecto: { pelo: '#e8c3c0', manchas: '#c69894', ojos: '#ffd2e0', patron: 'manchas' },
    bonus: {
      id: 'tiempoAmpliado',
      titulo: 'Burbuja',
      descripcion: 'Tu código tiene 8 segundos para responder en vez de 3.',
    },
    desbloqueo: { tipo: 'rachaSinPistas', valor: 3, texto: 'Encadena 3 retos sin pedir pistas.' },
  },
  {
    id: 'aluminio',
    nombre: 'Aluminio',
    metal: 'aluminio',
    grupo: 'Ninguno',
    poder: 'Inmune',
    personalidad: 'Inmune a todo: a los mimos, a la comida cara, a ti. Sobre todo a ti.',
    presentacion: 'No da ningún beneficio. Ninguno. Y aun así ahí sigue, y ahí seguirás tú cuidándolo.',
    aspecto: { pelo: '#eef0f2', manchas: '#d3d7dc', ojos: '#b9c2cc', patron: 'liso' },
    bonus: {
      id: 'ninguno',
      titulo: 'Nada',
      descripcion: 'Aluminio no aporta absolutamente nada, y lo sabe.',
    },
    desbloqueo: { tipo: 'croquetasGastadas', valor: 100, texto: 'Déjate 100 croquetas en pistas de Wayne.' },
  },
]

export const GATOS_POR_ID = Object.fromEntries(GATOS.map((gato) => [gato.id, gato]))

/** Umbral a partir del cual un gato está lo bastante contento para dar su beneficio. */
export const FELICIDAD_PARA_BONUS = 60

/**
 * Cuánto baja cada indicador por hora sin que le hagas caso.
 * Los tres van de 0 a 100 y en los tres, más alto es mejor.
 */
export const DESGASTE_POR_HORA = { comida: 4, felicidad: 3, limpieza: 2 }

/** Tope de desgaste acumulable: vuelvas cuando vuelvas, nunca está peor que esto. */
export const DESGASTE_MAXIMO = 70

export const CUIDADOS = {
  alimentar: { titulo: 'Dar de comer', indicador: 'comida', cantidad: 45, coste: 8, esperaMinutos: 45 },
  jugar: { titulo: 'Jugar', indicador: 'felicidad', cantidad: 35, coste: 0, esperaMinutos: 30 },
  cepillar: { titulo: 'Cepillar', indicador: 'limpieza', cantidad: 50, coste: 0, esperaMinutos: 60 },
}
