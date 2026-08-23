import { codigo } from './comun.js'

/**
 * Los registros de Kae: las dos tablas con las que se juega el primer mundo de
 * Elantris.
 *
 * Están aquí y no copiadas en cada reto por dos motivos, y el segundo importa
 * más que el primero:
 *
 * 1. Doce copias de las mismas diez filas se desincronizan. Basta con corregir
 *    una edad en un reto y no en los otros once para que un enunciado prometa
 *    una cosa y la consulta devuelva otra.
 * 2. **Se aprende una base de datos, no doce.** Al cuarto reto ya sabes que
 *    `habitantes` tiene un `barrio` y que los puestos de los escribas se llaman
 *    «Aon algo», y entonces puedes dedicar la cabeza a la consulta en vez de a
 *    releer el esquema. Es la misma razón por la que un curso de verdad usa una
 *    sola base de ejemplo de principio a fin.
 *
 * Vive en la raíz de `retos/` -al lado de `comun.js`- y no dentro de `kae/`
 * porque el plugin de las fichas trata **todo** fichero de una carpeta de mundo
 * como un reto. Uno que no lo fuera saldría en el catálogo sin título ni tipo.
 *
 * Los datos son pocos a propósito: diez habitantes y ocho puestos se leen de un
 * vistazo en el panel de las tablas, y una consulta cuyo resultado se puede
 * contar con el dedo es una consulta que se puede comprobar a mano. Con
 * doscientas filas, el jugador acabaría creyéndose lo que le diga el test.
 */

/** El censo de Kae: tres barrios, cinco oficios y diez personas. */
export const HABITANTES = {
  esquema: codigo(
    'CREATE TABLE habitantes (',
    '  id INTEGER PRIMARY KEY,',
    '  nombre TEXT NOT NULL,',
    '  barrio TEXT NOT NULL,',
    '  oficio TEXT NOT NULL,',
    '  edad INTEGER NOT NULL',
    ');',
  ),
  datos: codigo(
    'INSERT INTO habitantes (id, nombre, barrio, oficio, edad) VALUES',
    "  (1,  'Raoden',   'Kae',     'escribiente', 26),",
    "  (2,  'Galladon', 'Muralla', 'cantero',     41),",
    "  (3,  'Sarene',   'Kae',     'escribiente', 25),",
    "  (4,  'Kiin',     'Kae',     'cocinero',    48),",
    "  (5,  'Lukel',    'Puerta',  'comerciante', 27),",
    "  (6,  'Roial',    'Kae',     'comerciante', 62),",
    "  (7,  'Shuden',   'Muralla', 'herrero',     30),",
    "  (8,  'Daora',    'Kae',     'cocinero',    45),",
    "  (9,  'Eondel',   'Puerta',  'cantero',     52),",
    "  (10, 'Adien',    'Muralla', 'escribiente', 19);",
  ),
}

/** Los puestos del mercado y lo que hizo cada uno el día de mercado. */
export const PUESTOS = {
  esquema: codigo(
    'CREATE TABLE puestos (',
    '  id INTEGER PRIMARY KEY,',
    '  nombre TEXT NOT NULL,',
    '  gremio TEXT NOT NULL,',
    '  monedas INTEGER NOT NULL',
    ');',
  ),
  datos: codigo(
    'INSERT INTO puestos (id, nombre, gremio, monedas) VALUES',
    "  (1, 'Aon Aon',      'escribas',   140),",
    "  (2, 'La piedra',    'canteros',    95),",
    "  (3, 'El caldero',   'cocineros',  210),",
    "  (4, 'Aon Ien',      'escribas',    60),",
    "  (5, 'El yunque',    'herreros',   180),",
    "  (6, 'Los dos ríos', 'comercio',   320),",
    "  (7, 'Aon Ashe',     'escribas',   105),",
    "  (8, 'La muralla',   'canteros',    45);",
  ),
}

/**
 * Otros censos con las mismas columnas, para las tandas de práctica.
 *
 * Una tanda de práctica repite el reto **con otros datos**, y en SQL eso quiere
 * decir exactamente esto: la consulta que resolvía el reto tiene que seguir
 * resolviéndolo con otras filas dentro. Si hubiera que cambiar la consulta no
 * sería práctica, sería otro reto.
 *
 * Y por eso los censos de repuesto no son los mismos diez nombres barajados:
 * cambian los barrios, las edades y cuántos hay de cada oficio, que es lo que
 * hace que una consulta escrita a ojo -«los tres primeros y ya»- deje de valer.
 */
export const OTROS_CENSOS = [
  codigo(
    'INSERT INTO habitantes (id, nombre, barrio, oficio, edad) VALUES',
    "  (1,  'Ashe',    'Muralla', 'escribiente', 34),",
    "  (2,  'Karata',  'Kae',     'herrero',     38),",
    "  (3,  'Dashe',   'Puerta',  'cantero',     29),",
    "  (4,  'Mareshe', 'Kae',     'cocinero',    31),",
    "  (5,  'Taan',    'Muralla', 'cantero',     57),",
    "  (6,  'Aanden',  'Kae',     'escribiente', 44),",
    "  (7,  'Riil',    'Puerta',  'comerciante', 22),",
    "  (8,  'Saolin',  'Kae',     'herrero',     49),",
    "  (9,  'Idotris', 'Muralla', 'comerciante', 61),",
    "  (10, 'Maare',   'Kae',     'cocinero',    27);",
  ),
  codigo(
    'INSERT INTO habitantes (id, nombre, barrio, oficio, edad) VALUES',
    "  (1,  'Torena',  'Kae',     'comerciante', 20),",
    "  (2,  'Ahan',    'Kae',     'comerciante', 55),",
    "  (3,  'Telrii',  'Puerta',  'escribiente', 47),",
    "  (4,  'Dilaf',   'Muralla', 'escribiente', 36),",
    "  (5,  'Seinalan','Puerta',  'cocinero',    64),",
    "  (6,  'Jalla',   'Kae',     'cantero',     28),",
    "  (7,  'Kaloo',   'Muralla', 'herrero',     33),",
    "  (8,  'Kahar',   'Kae',     'cantero',     58),",
    "  (9,  'Matisse', 'Muralla', 'cocinero',    18),",
    "  (10, 'Tenrao',  'Puerta',  'herrero',     40);",
  ),
]

/** Las dos juntas, para los retos que hablan del mercado y del censo a la vez. */
export const KAE = {
  esquema: `${HABITANTES.esquema}\n\n${PUESTOS.esquema}`,
  datos: `${HABITANTES.datos}\n\n${PUESTOS.datos}`,
}
