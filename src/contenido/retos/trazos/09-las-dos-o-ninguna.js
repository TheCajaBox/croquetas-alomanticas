import { codigo, pista } from '../comun.js'
import { TRAZOS } from '../tablas-de-elantris.js'

export default {
  id: "trazos-09-las-dos-o-ninguna",
  mundo: "trazos",
  entorno: "sql",
  tipo: "codigo",
  titulo: "Las dos cosas, o ninguna",
  enunciado: codigo(
    "El consejo ha decidido dos cosas que van juntas: `El caldero` pasa al gremio de los aones",
    "-el número 4- y `La muralla` se cierra. Es un solo acuerdo, así que **o pasan las dos o no",
    "pasa ninguna**: dejarlo a medias sería peor que no hacer nada.",
    "",
    "Para eso está la **transacción**:",
    "",
    "```sql",
    "BEGIN;",
    "  -- las órdenes",
    "COMMIT;",
    "```",
    "",
    "Entre las dos, la base guarda los cambios en un lado y no los publica. Con `COMMIT` los",
    "publica de golpe; con `ROLLBACK`, los tira y todo queda como estaba.",
    "",
    "Escribe las cuatro órdenes: el `BEGIN`, los dos `UPDATE` y el `COMMIT`.",
  ),
  esquema: TRAZOS.esquema,
  datos: TRAZOS.datos,
  inicial: codigo(
    "BEGIN;",
    "",
    "",
    "COMMIT;",
  ),
  solucion: codigo(
    "BEGIN;",
    "",
    "UPDATE puestos SET gremio_id = 4 WHERE id = 3;",
    "UPDATE puestos SET abierto = 0 WHERE id = 5;",
    "",
    "COMMIT;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "BEGIN", texto: "Abre la transacción con `BEGIN`" },
    { tipo: "usaPalabra", valor: "COMMIT", texto: "Y ciérrala con `COMMIT`" },
    { tipo: "alMenos", valor: "UPDATE", veces: 2, texto: "Son dos cambios" },
    { tipo: "alMenosSentencias", veces: 4, texto: "Cuatro órdenes: el `BEGIN`, los dos cambios y el `COMMIT`" },
    { tipo: "prohibeAsterisco", texto: "Aquí no hay nada que pedir con asterisco" },
  ],
  tests: [
    {
      nombre: "El caldero es de los aones",
      codigo: "esperar(consulta(\"SELECT gremio_id FROM puestos WHERE nombre = 'El caldero'\")[0].gremio_id, 'su gremio').igualA(4)",
    },
    {
      nombre: "y La muralla está cerrada",
      codigo: "esperar(consulta(\"SELECT abierto FROM puestos WHERE nombre = 'La muralla'\")[0].abierto, 'su abierto').igualA(0)",
    },
    {
      nombre: "los cocineros se quedan sin ningún puesto",
      codigo: "esperar(consulta('SELECT COUNT(*) AS n FROM puestos WHERE gremio_id = 3')[0].n, 'los de cocineros').igualA(0)",
    },
    {
      nombre: "y los aones pasan a tener uno, que no tenían ninguno",
      codigo: "esperar(consulta('SELECT COUNT(*) AS n FROM puestos WHERE gremio_id = 4')[0].n, 'los de aones').igualA(1)",
    },
    {
      nombre: "el caldero sigue abierto: el acuerdo no decía nada de eso",
      codigo: codigo(
        "// El otro `UPDATE` cierra puestos, y este no. Un `SET` que toque columnas de",
        "// más es el fallo silencioso de este reto: los tests de arriba pasarían igual.",
        "esperar(consulta(\"SELECT abierto FROM puestos WHERE nombre = 'El caldero'\")[0].abierto, 'el abierto de El caldero').igualA(1)",
      ),
    },
    {
      nombre: "y La muralla sigue siendo de los canteros",
      codigo: "esperar(consulta(\"SELECT gremio_id FROM puestos WHERE nombre = 'La muralla'\")[0].gremio_id, 'su gremio').igualA(2)",
    },
    {
      nombre: "no ha cambiado nada más: seis puestos y sus seis ventas",
      codigo: codigo(
        "esperar(cuantas('puestos'), 'los puestos').igualA(6)",
        "esperar(cuantas('ventas'), 'las ventas').igualA(6)",
        "esperar(consulta('SELECT COUNT(*) AS n FROM puestos WHERE abierto = 0')[0].n, 'los cerrados').igualA(2)",
      ),
    },
    {
      nombre: "y los cambios están confirmados de verdad",
      codigo: codigo(
        "// Sin el `COMMIT`, SQLite deja la transacción abierta y los tests siguen",
        "// viendo los cambios -están en la misma conexión-. Lo que no se puede es",
        "// abrir otra transacción encima, y eso lo distingue.",
        "consulta('BEGIN; COMMIT;')",
        "esperar(true, 'que la transacción esté cerrada').esVerdadero()",
      ),
    },
  ],
  variantes: [
    {
      titulo: "Las dos cosas, o ninguna · otra tanda",
      datos: codigo(
        'INSERT INTO gremios (id, nombre) VALUES',
        "  (1, 'escribas'), (2, 'canteros'), (3, 'cocineros'), (4, 'aones');",
        '',
        'INSERT INTO puestos (id, nombre, gremio_id, abierto) VALUES',
        "  (1, 'Aon Aon',      1, 1),",
        "  (2, 'La piedra',    2, 1),",
        "  (3, 'El caldero',   1, 1),",
        "  (4, 'Aon Ien',      1, 1),",
        "  (5, 'La muralla',   2, 1),",
        "  (6, 'El tenderete', NULL, 1);",
        '',
        'INSERT INTO ventas (id, puesto_id, dia, monedas) VALUES',
        "  (1, 3, 'lunes', 40);",
      ),
      tests: [
        {
          nombre: "El caldero pasa de los escribas a los aones",
          codigo: "esperar(consulta(\"SELECT gremio_id FROM puestos WHERE nombre = 'El caldero'\")[0].gremio_id).igualA(4)",
        },
        {
          nombre: "y La muralla se cierra",
          codigo: "esperar(consulta(\"SELECT abierto FROM puestos WHERE nombre = 'La muralla'\")[0].abierto).igualA(0)",
        },
        {
          nombre: "los escribas se quedan con dos puestos en vez de tres",
          codigo: "esperar(consulta('SELECT COUNT(*) AS n FROM puestos WHERE gremio_id = 1')[0].n).igualA(2)",
        },
        {
          nombre: "y aquí el único puesto cerrado es La muralla",
          codigo: codigo(
            "esperar(consulta('SELECT nombre FROM puestos WHERE abierto = 0').map((f) => f.nombre))",
            "  .igualA(['La muralla'])",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Cuatro líneas, cada una acabada en punto y coma. Las dos de dentro son `UPDATE` de los del reto cinco, cada uno con su `WHERE`.", 0),
    pista("Cada `UPDATE` cambia **una** columna de **una** fila. No metas los dos cambios en la misma orden: son puestos distintos.", 1),
    pista("Y la pregunta que hay que hacerse siempre delante de dos órdenes seguidas: **¿qué pasa si la segunda falla?** Sin `BEGIN`, la primera ya está escrita y el acuerdo queda a medias. Con `BEGIN`, o las dos o ninguna.", 2),
  ],
  recompensa: { croquetas: 11 },
}
