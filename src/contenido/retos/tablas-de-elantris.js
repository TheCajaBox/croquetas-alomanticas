import { codigo } from './comun.js'

/**
 * Los registros de Elantris: las tablas con las que se juega este itinerario.
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
 * Vive en la raíz de `retos/` -al lado de `comun.js`- y no dentro de la carpeta
 * de un mundo porque el plugin de las fichas trata **todo** fichero de una
 * carpeta de mundo como un reto. Uno que no lo fuera saldría en el catálogo sin
 * título ni tipo.
 *
 * ## La base crece con el temario, y eso se cuenta
 *
 * En Kae el gremio de un puesto es **un texto en la propia fila**, porque en Kae
 * solo hay una tabla cada vez y todavía no hace falta más. Dentro de los muros,
 * el gremio es **otra tabla** y el puesto guarda su número.
 *
 * No es un capricho de quien escribió los datos: es la lección del mundo. El
 * texto repetido en cada fila se escribe de ocho maneras distintas y no puede
 * guardar nada más -¿quién es el maestro del gremio?-; la tabla aparte se
 * escribe una vez y se le pueden colgar datos. Lo que cuesta es que a partir de
 * ahí hay que **unir**, y unir es lo que se aprende en ese mundo.
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

// ---- Dentro de los muros: los mismos datos, bien puestos ------------------
//
// El gremio deja de ser un texto repetido en cada puesto y pasa a ser una tabla
// con su número. A cambio hay que unir, y unir tiene tres casos que este mundo
// entero se dedica a enseñar:
//
// - Un puesto **sin gremio** (`gremio_id` a nulo): el que desaparece en un
//   `JOIN` normal y sobrevive en un `LEFT JOIN`.
// - Un gremio **sin puestos**: el que desaparece si unes desde el otro lado.
// - Un gremio **sin maestro** (`maestro` a nulo): el primer nulo que se ve, y
//   no viene de ninguna unión: estaba en la tabla.
//
// Los tres están puestos a propósito. Con datos redondos -cada puesto con su
// gremio y cada gremio con sus puestos- las cuatro clases de unión devuelven lo
// mismo, y entonces no se puede enseñar ninguna.
export const GREMIOS = {
  esquema: codigo(
    'CREATE TABLE gremios (',
    '  id INTEGER PRIMARY KEY,',
    '  nombre TEXT NOT NULL,',
    '  maestro TEXT',
    ');',
  ),
  datos: codigo(
    'INSERT INTO gremios (id, nombre, maestro) VALUES',
    "  (1, 'escribas',  'Adien'),",
    "  (2, 'canteros',  'Karata'),",
    "  (3, 'cocineros', NULL),",
    "  (4, 'herreros',  'Saolin'),",
    "  (5, 'comercio',  'Roial'),",
    "  (6, 'aones',     'Raoden');",
  ),
}

/** Los puestos con el gremio por su número, y uno que no tiene ninguno. */
export const PUESTOS_CON_GREMIO = {
  esquema: codigo(
    'CREATE TABLE puestos (',
    '  id INTEGER PRIMARY KEY,',
    '  nombre TEXT NOT NULL,',
    '  gremio_id INTEGER REFERENCES gremios(id),',
    '  monedas INTEGER NOT NULL',
    ');',
  ),
  datos: codigo(
    'INSERT INTO puestos (id, nombre, gremio_id, monedas) VALUES',
    "  (1, 'Aon Aon',      1,    140),",
    "  (2, 'La piedra',    2,     95),",
    "  (3, 'El caldero',   3,    210),",
    "  (4, 'Aon Ien',      1,     60),",
    "  (5, 'El yunque',    4,    180),",
    "  (6, 'Los dos ríos', 5,    320),",
    "  (7, 'Aon Ashe',     1,    105),",
    "  (8, 'La muralla',   2,     45),",
    // El tenderete recauda bien **a propósito**: es el puesto sin gremio, y si
    // fuera el que menos recauda, cualquier filtro por monedas lo tiraría antes
    // que a nadie. Entonces un `LEFT JOIN` y un `JOIN` normal devolverían lo
    // mismo, y el mundo que enseña la diferencia no podría comprobarla.
    "  (9, 'El tenderete', NULL, 165);",
  ),
}

/**
 * El mercado de dentro de los muros: gremios y puestos, para unir.
 *
 * El orden importa y no es estético: `gremios` se crea **antes** que `puestos`,
 * porque `puestos` apunta a ella con una clave ajena y las claves ajenas van
 * encendidas. Crear la hija primero da un error que no habla de orden.
 */
export const MUROS = {
  esquema: `${GREMIOS.esquema}\n\n${PUESTOS_CON_GREMIO.esquema}`,
  datos: `${GREMIOS.datos}\n\n${PUESTOS_CON_GREMIO.datos}`,
}

// ---- El mercado: el total deja de ser una columna --------------------------
//
// En los muros, lo que recaudó un puesto era **un dato guardado**: la columna
// `monedas`. Aquí abajo no existe. Lo que hay es una fila por venta, y el total
// se calcula.
//
// Ese es el cambio que hace el mundo, y es el mismo salto que el anterior: un
// total guardado a mano se queda desfasado en cuanto entra una venta y no se
// puede desglosar -¿cuánto fue el lunes?-. Calculado siempre cuadra, y a cambio
// hay que aprender a agrupar.
//
// Las sumas están hechas para que coincidan con la columna `monedas` de los
// muros: Aon Aon recaudó 140 allí y aquí sus tres ventas suman 140. No es un
// adorno -deja ver que el total y sus partes son lo mismo mirado de dos maneras-.
//
// Y hay dos huecos, otra vez a propósito:
//
// - `La muralla` **no tiene ninguna venta**. Es el grupo vacío: el que un `JOIN`
//   normal borra del informe y el que hace visible la diferencia entre
//   `COUNT(*)` y `COUNT(columna)`.
// - `El tenderete` sigue sin gremio, así que agrupando por gremio cae en un
//   grupo cuyo nombre es nulo.
export const PUESTOS_SIN_TOTAL = {
  esquema: codigo(
    'CREATE TABLE puestos (',
    '  id INTEGER PRIMARY KEY,',
    '  nombre TEXT NOT NULL,',
    '  gremio_id INTEGER REFERENCES gremios(id)',
    ');',
  ),
  datos: codigo(
    'INSERT INTO puestos (id, nombre, gremio_id) VALUES',
    "  (1, 'Aon Aon',      1),",
    "  (2, 'La piedra',    2),",
    "  (3, 'El caldero',   3),",
    "  (4, 'Aon Ien',      1),",
    "  (5, 'El yunque',    4),",
    "  (6, 'Los dos ríos', 5),",
    "  (7, 'Aon Ashe',     1),",
    "  (8, 'La muralla',   2),",
    "  (9, 'El tenderete', NULL);",
  ),
}

/** Una fila por venta: tres días de mercado y dieciséis ventas. */
export const VENTAS = {
  esquema: codigo(
    'CREATE TABLE ventas (',
    '  id INTEGER PRIMARY KEY,',
    '  puesto_id INTEGER NOT NULL REFERENCES puestos(id),',
    '  dia TEXT NOT NULL,',
    '  monedas INTEGER NOT NULL',
    ');',
  ),
  datos: codigo(
    'INSERT INTO ventas (id, puesto_id, dia, monedas) VALUES',
    "  ( 1, 1, 'lunes',     40),",
    "  ( 2, 1, 'lunes',     60),",
    "  ( 3, 1, 'martes',    40),",
    "  ( 4, 2, 'lunes',     95),",
    "  ( 5, 3, 'lunes',    120),",
    "  ( 6, 3, 'martes',    90),",
    "  ( 7, 4, 'martes',    60),",
    "  ( 8, 5, 'lunes',    100),",
    "  ( 9, 5, 'martes',    80),",
    "  (10, 6, 'lunes',    200),",
    "  (11, 6, 'martes',   120),",
    "  (12, 7, 'lunes',     35),",
    "  (13, 7, 'martes',    35),",
    "  (14, 7, 'miércoles', 35),",
    "  (15, 9, 'lunes',     80),",
    "  (16, 9, 'martes',    85);",
  ),
}

/**
 * El mercado entero: gremios, puestos sin total y las ventas.
 *
 * El orden de creación importa y no es estético: cada tabla apunta a la
 * anterior con una clave ajena y las claves ajenas van encendidas.
 */
export const MERCADO = {
  esquema: `${GREMIOS.esquema}\n\n${PUESTOS_SIN_TOTAL.esquema}\n\n${VENTAS.esquema}`,
  datos: `${GREMIOS.datos}\n\n${PUESTOS_SIN_TOTAL.datos}\n\n${VENTAS.datos}`,
}

/** Las dos juntas, para los retos que hablan del mercado y del censo a la vez. */
export const KAE = {
  esquema: `${HABITANTES.esquema}\n\n${PUESTOS.esquema}`,
  datos: `${HABITANTES.datos}\n\n${PUESTOS.datos}`,
}
