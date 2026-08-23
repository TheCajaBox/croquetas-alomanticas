import { codigo } from '../comun.js'
import { TRAZOS } from '../tablas-de-elantris.js'

export default {
  id: "trazos-12-el-cierre-del-mercado",
  mundo: "trazos",
  entorno: "sql",
  tipo: "codigo",
  jefe: true,
  titulo: "Jefe: el cierre del mercado",
  enunciado: codigo(
    "Aquí no hay pistas. Todo lo que hace falta lo has visto en los once retos de antes.",
    "",
    "El mercado cierra la temporada y el consejo ha aprobado un solo acuerdo con cuatro cosas.",
    "**O pasan las cuatro o no pasa ninguna**, así que va todo en una transacción:",
    "",
    "1. Se **borran** los apuntes de los puestos cerrados. Solo esos.",
    "2. Se **cierran** los puestos que no hayan vendido nada esta temporada.",
    "3. Se **apunta** un puesto nuevo: `Aon Rao`, del gremio de los aones -el 4-, abierto.",
    "4. Se **corrige** la venta del lunes de `Aon Aon`: fueron 130 monedas y no 140.",
    "",
    "Y una cosa que el consejo no ha dicho y decide si el cierre sale bien: **el orden en que",
    "escribas las órdenes cambia el resultado**. Si borras primero los apuntes de los cerrados,",
    "cuando llegues al paso 2 habrá puestos que parecerán no haber vendido nada porque acabas",
    "de borrar sus apuntes. Piensa qué paso necesita mirar los datos sin tocar.",
    "",
    "Lo que se comprueba al final es el estado de la base. Cómo llegues ahí es tuyo.",
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
    "-- 2 primero, porque después de borrar los apuntes de los cerrados no habría",
    "-- manera de distinguir «no vendió nada» de «se le borraron los apuntes».",
    "UPDATE puestos",
    "SET abierto = 0",
    "WHERE id NOT IN (SELECT puesto_id FROM ventas);",
    "",
    "DELETE FROM ventas",
    "WHERE puesto_id IN (SELECT id FROM puestos WHERE abierto = 0);",
    "",
    "INSERT INTO puestos (nombre, gremio_id, abierto) VALUES ('Aon Rao', 4, 1);",
    "",
    "UPDATE ventas",
    "SET monedas = 130",
    "WHERE puesto_id = 1 AND dia = 'lunes';",
    "",
    "COMMIT;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "BEGIN", texto: "Un solo acuerdo: abre la transacción" },
    { tipo: "usaPalabra", valor: "COMMIT", texto: "Y ciérrala" },
    { tipo: "usaPalabra", valor: "DELETE", texto: "Hay apuntes que se borran" },
    { tipo: "usaPalabra", valor: "INSERT", texto: "Y un puesto que se apunta" },
    { tipo: "alMenos", valor: "UPDATE", veces: 2, texto: "Dos cambios: los cierres y la corrección" },
    { tipo: "alMenosSentencias", veces: 6, texto: "Seis órdenes: el `BEGIN`, las cuatro cosas y el `COMMIT`" },
    { tipo: "prohibeAsterisco", texto: "Nada de asteriscos" },
  ],
  tests: [
    {
      nombre: "Aon Ien y La muralla quedan cerrados: ninguno de los dos ha vendido nada",
      codigo: codigo(
        "const cerrados = consulta('SELECT nombre FROM puestos WHERE abierto = 0 ORDER BY id').map((f) => f.nombre)",
        "esperar(cerrados, 'los cerrados').igualA(['Aon Ien', 'La muralla'])",
      ),
    },
    {
      nombre: "y los otros siguen abiertos, incluido el nuevo",
      codigo: codigo(
        "const abiertos = consulta('SELECT nombre FROM puestos WHERE abierto = 1 ORDER BY id').map((f) => f.nombre)",
        "esperar(abiertos, 'los abiertos').igualA(['Aon Aon', 'La piedra', 'El caldero', 'El tenderete', 'Aon Rao'])",
      ),
    },
    {
      nombre: "el puesto nuevo está, con su gremio",
      codigo: codigo(
        "const nuevo = consulta(\"SELECT gremio_id, abierto FROM puestos WHERE nombre = 'Aon Rao'\")",
        "esperar(nuevo, 'las filas de Aon Rao').tieneLongitud(1)",
        "esperar(nuevo[0], 'su fila').igualA({ gremio_id: 4, abierto: 1 })",
      ),
    },
    {
      nombre: "siete puestos: los seis de antes y el nuevo, sin borrar ninguno",
      codigo: codigo(
        "// El acuerdo cierra puestos, no los borra. Y no podría: la clave ajena para",
        "// cualquier `DELETE` de un puesto que tenga apuntes.",
        "esperar(cuantas('puestos'), 'los puestos').igualA(7)",
      ),
    },
    {
      nombre: "no se ha borrado ningún apunte: los cerrados no tenían ninguno",
      codigo: codigo(
        "// Es la trampa del reto. Los que se cierran son justamente los que no han",
        "// vendido nada, así que el paso 1 no encuentra nada que borrar. Si has borrado",
        "// algo, el orden de tus órdenes estaba al revés.",
        "esperar(cuantas('ventas'), 'las ventas').igualA(6)",
      ),
    },
    {
      nombre: "la venta del lunes de Aon Aon son 130",
      codigo: codigo(
        "esperar(consulta(\"SELECT monedas FROM ventas WHERE puesto_id = 1 AND dia = 'lunes'\")[0].monedas, 'sus monedas')",
        "  .igualA(130)",
      ),
    },
    {
      nombre: "y su venta del martes no se ha tocado",
      codigo: codigo(
        "esperar(consulta(\"SELECT monedas FROM ventas WHERE puesto_id = 1 AND dia = 'martes'\")[0].monedas, 'la del martes')",
        "  .igualA(60)",
      ),
    },
    {
      nombre: "el total del mercado baja exactamente diez monedas",
      codigo: codigo(
        "esperar(consulta('SELECT SUM(monedas) AS t FROM ventas')[0].t, 'el total').igualA(750)",
      ),
    },
    {
      nombre: "nadie ha cambiado de gremio por el camino",
      codigo: codigo(
        "const gremios = consulta('SELECT nombre, gremio_id FROM puestos WHERE id <= 6 ORDER BY id')",
        "esperar(gremios.map((f) => f.gremio_id), 'los gremios de los seis de antes').igualA([1, 2, 3, 1, 2, null])",
      ),
    },
    {
      nombre: "y el acuerdo está confirmado, no a medias",
      codigo: codigo(
        "// Sin `COMMIT`, la transacción se queda abierta. Los tests la ven -es la misma",
        "// conexión- y no se puede abrir otra encima, y eso es lo que lo distingue.",
        "consulta('BEGIN; COMMIT;')",
        "esperar(true, 'que la transacción esté cerrada').esVerdadero()",
      ),
    },
  ],
  variantes: [
    {
      titulo: "El cierre del mercado · otra temporada",
      datos: codigo(
        'INSERT INTO gremios (id, nombre) VALUES',
        "  (1, 'escribas'), (2, 'canteros'), (3, 'cocineros'), (4, 'aones');",
        '',
        'INSERT INTO puestos (id, nombre, gremio_id, abierto) VALUES',
        "  (1, 'Aon Aon',      1, 1),",
        "  (2, 'La piedra',    2, 0),",
        "  (3, 'El caldero',   3, 1),",
        "  (4, 'Aon Ien',      1, 1),",
        "  (5, 'La muralla',   2, 1),",
        "  (6, 'El tenderete', NULL, 1);",
        '',
        'INSERT INTO ventas (id, puesto_id, dia, monedas) VALUES',
        "  (1, 1, 'lunes',  140),",
        "  (2, 2, 'lunes',   80),",
        "  (3, 2, 'martes',  20),",
        "  (4, 4, 'lunes',   50);",
      ),
      tests: [
        {
          nombre: "se cierran los tres que no han vendido, y La piedra sigue cerrada",
          codigo: codigo(
            "const cerrados = consulta('SELECT nombre FROM puestos WHERE abierto = 0 ORDER BY id').map((f) => f.nombre)",
            "esperar(cerrados).igualA(['La piedra', 'El caldero', 'La muralla', 'El tenderete'])",
          ),
        },
        {
          nombre: "aquí sí se borran apuntes: los dos de La piedra, que estaba cerrada de antes",
          codigo: codigo(
            "// Esta es la variante que distingue el orden de verdad. La piedra llega",
            "// cerrada y con dos apuntes, así que el `DELETE` se los lleva.",
            "esperar(cuantas('ventas')).igualA(2)",
            "esperar(consulta('SELECT COUNT(*) AS n FROM ventas WHERE puesto_id = 2')[0].n).igualA(0)",
          ),
        },
        {
          nombre: "y las dos que quedan son las de los puestos que siguen abiertos",
          codigo: codigo(
            "esperar(consulta('SELECT puesto_id FROM ventas ORDER BY id').map((f) => f.puesto_id)).igualA([1, 4])",
          ),
        },
        {
          nombre: "Aon Rao está, y son siete puestos",
          codigo: codigo(
            "esperar(consulta(\"SELECT abierto FROM puestos WHERE nombre = 'Aon Rao'\")[0].abierto).igualA(1)",
            "esperar(cuantas('puestos')).igualA(7)",
          ),
        },
        {
          nombre: "y la corrección de Aon Aon está hecha",
          codigo: "esperar(consulta(\"SELECT monedas FROM ventas WHERE puesto_id = 1\")[0].monedas).igualA(130)",
        },
      ],
    },
  ],
  recompensa: { croquetas: 16 },
}
