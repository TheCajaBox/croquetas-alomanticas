/**
 * El elenco: quién puede hablar en el juego, cómo se llama y de qué color es.
 *
 * Vive aquí y no dentro de `Avatar.vue` porque hay más sitios que necesitan
 * saber cómo se llama alguien: el panel de pistas -que antes decía «Pistas de
 * Wayne» en un mundo donde las vende Fantasma-, el repaso, y el narrador.
 *
 * El color se usa para el disco de quien todavía no tiene ilustración. Los que
 * sí la tienen la declaran en `Avatar.vue`, que es quien las importa.
 *
 * `de` es de qué camino es alguien, y solo lo llevan los que **no tienen un
 * papel** en ningún reparto: gente que se nombra en el texto de un apunte o de
 * un reto sin hablar nunca. Lo necesita la prueba de que nadie sale en un camino
 * que no es el suyo, que hasta ahora deducía a quién pertenece cada uno de los
 * repartos de `itinerarios.js` -o sea, de quién tiene un trabajo- y por eso
 * trataba a Frava como forastera en su propia ciudad.
 */
export const PERSONAJES = {
  wayne: { nombre: 'Wayne', color: '#c98b4b' },
  wax: { nombre: 'Wax', color: '#7fa3c4' },
  steris: { nombre: 'Steris', color: '#9aa8d8' },
  marasi: { nombre: 'Marasi', color: '#b06f8a' },
  melaan: { nombre: 'MeLaan', color: '#4fb89c' },
  armonia: { nombre: 'Armonía', color: '#c6a45c' },
  brisa: { nombre: 'Brisa', color: '#b07a9a' },
  ham: { nombre: 'Ham', color: '#9a8f6a' },
  kelsier: { nombre: 'Kelsier', color: '#cfd6e0' },
  fantasma: { nombre: 'Fantasma', color: '#d0a24f' },
  sazed: { nombre: 'Sazed', color: '#c6a45c' },
  elend: { nombre: 'Elend', color: '#7f8fd8' },
  vin: { nombre: 'Vin', color: '#a8a2bd' },
  tensoon: { nombre: 'TenSoon', color: '#6fb08a' },
  dockson: { nombre: 'Dockson', color: '#8a9aa8' },
  marsh: { nombre: 'Marsh', color: '#8a8a96' },
  galladon: { nombre: 'Galladon', color: '#b98a63' },
  raoden: { nombre: 'Raoden', color: '#e0c987' },
  sarene: { nombre: 'Sarene', color: '#63b0c9' },
  adien: { nombre: 'Adien', color: '#cbd6e4' },
  karata: { nombre: 'Karata', color: '#8a7f8c' },
  hrathen: { nombre: 'Hrathen', color: '#b0503f' },
  shai: { nombre: 'Shai', color: '#c46a5a' },
  gaotona: { nombre: 'Gaotona', color: '#b9a678' },
  hanshuxen: { nombre: 'Han ShuXen', color: '#7f8a96' },
  sellador: { nombre: 'el Sellador de sangre', color: '#8f2f2f' },
  // Arbitradora de Sel: sale nombrada en los retos y no habla nunca.
  frava: { nombre: 'Frava', color: '#7a6f92', de: ['sel'] },
}

/** Cómo se llama, para escribirlo en pantalla. */
export const nombreDe = (quien) => PERSONAJES[quien]?.nombre ?? PERSONAJES.wayne.nombre

/** Si esa persona existe en el juego. Lo usan las pruebas del reparto. */
export const existePersonaje = (quien) => quien in PERSONAJES
