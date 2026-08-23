/**
 * Las tablas de Sel: la base que hay detrás de «La grieta».
 *
 * Vive en la raíz de `retos/` y no dentro de la carpeta del mundo porque el
 * plugin de fichas trata **cada fichero de una carpeta de mundo como un reto**,
 * y esto no es un reto: son los datos que comparten los doce.
 *
 * El sistema es el de los sellos imperiales: quién puede firmar qué, con qué
 * sello, y qué se ha firmado. Es el mismo esquema en los doce retos del mundo
 * para que la consulta se pueda leer sin volver a estudiar las tablas, y porque
 * lo que cambia de un reto a otro no son las tablas: es **lo que le entra a la
 * consulta desde fuera**.
 *
 * Los datos tienen agujeros a propósito, y cada uno hace comprobable un ataque:
 *
 * - **Un secreto que no es de nadie que consulte**: el `SELECT` de un ataque con
 *   éxito se lleva filas que no le tocaban, y hay que poder contarlas.
 * - **Un usuario con un apóstrofo en el nombre** (`d'Alai`): la consulta pegada
 *   con comillas se rompe con un nombre **legítimo**, no hace falta un ataque.
 *   Es la mejor demostración de que esto no es un problema de gente mala.
 * - **Un usuario que se llama como un ataque**: alguien que de verdad se llama
 *   `Robert'); DROP TABLE sellos; --` tiene derecho a tener cuenta.
 * - **Dos sellos revocados**: para que un `WHERE` que se anula con `OR 1=1` se
 *   note en la cuenta y no solo en la teoría.
 */
export const SELLOS = {
  esquema: [
    'CREATE TABLE arbitradores (',
    '  id INTEGER PRIMARY KEY,',
    '  nombre TEXT NOT NULL,',
    '  rango TEXT NOT NULL',
    ');',
    '',
    'CREATE TABLE sellos (',
    '  id INTEGER PRIMARY KEY,',
    '  arbitrador_id INTEGER NOT NULL REFERENCES arbitradores(id),',
    '  clase TEXT NOT NULL,',
    '  revocado INTEGER NOT NULL DEFAULT 0',
    ');',
    '',
    'CREATE TABLE firmas (',
    '  id INTEGER PRIMARY KEY,',
    '  sello_id INTEGER NOT NULL REFERENCES sellos(id),',
    '  documento TEXT NOT NULL,',
    '  dia TEXT NOT NULL,',
    '  secreto INTEGER NOT NULL DEFAULT 0',
    ');',
  ].join('\n'),

  datos: [
    "INSERT INTO arbitradores (id, nombre, rango) VALUES",
    "  (1, 'Gaotona', 'arbitrador'),",
    "  (2, 'Frava', 'arbitradora'),",
    "  (3, 'Han ShuXen', 'general'),",
    "  (4, 'd''Alai', 'escriba'),",
    "  (5, 'Robert''); DROP TABLE sellos; --', 'escriba');",
    "",
    "INSERT INTO sellos (id, arbitrador_id, clase, revocado) VALUES",
    "  (1, 1, 'imperial', 0),",
    "  (2, 1, 'menor', 0),",
    "  (3, 2, 'imperial', 1),",
    "  (4, 3, 'militar', 0),",
    "  (5, 4, 'menor', 0),",
    "  (6, 5, 'menor', 1);",
    "",
    "INSERT INTO firmas (id, sello_id, documento, dia, secreto) VALUES",
    "  (1, 1, 'nombramiento de Shai', '01-03', 0),",
    "  (2, 1, 'traslado de la guardia', '02-03', 1),",
    "  (3, 2, 'permiso de obra', '02-03', 0),",
    "  (4, 3, 'orden de registro', '03-03', 1),",
    "  (5, 4, 'reparto de grano', '04-03', 0),",
    "  (6, 4, 'plano de la muralla norte', '05-03', 1),",
    "  (7, 5, 'copia del catastro', '05-03', 0),",
    "  (8, 6, 'nota de gastos', '06-03', 0);",
  ].join('\n'),
}
