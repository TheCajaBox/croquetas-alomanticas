/**
 * La gramática de SQL para el editor, en un módulo propio.
 *
 * Por lo mismo que `gramatica-php.js`: para que el trozo empaquetado se llame
 * como el fichero y se pueda comprobar -desde una prueba y mirando `dist`- que
 * en los caminos que no son de SQL no se descarga.
 *
 * Se exporta el dialecto de SQLite y no el `sql()` genérico, porque el sandbox
 * es SQLite: así lo que el editor colorea como palabra clave es exactamente lo
 * que el motor va a entender como palabra clave.
 */
export { sql, SQLite } from '@codemirror/lang-sql'
