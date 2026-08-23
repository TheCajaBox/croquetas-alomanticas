import { codigo, pista } from '../comun.js'
import { TRAZOS } from '../tablas-de-elantris.js'

export default {
  id: "trazos-10-monta-el-traspaso",
  mundo: "trazos",
  entorno: "sql",
  tipo: "completar",
  titulo: "Monta el traspaso",
  enunciado: codigo(
    "`El tenderete` se ha apuntado por fin a un gremio -al de los aones, el 4- y con el papeleo",
    "hay que corregir su venta del lunes: fueron 150 monedas y no 165.",
    "",
    "Las dos cosas van en el mismo trámite, así que van juntas.",
    "",
    "Faltan cuatro piezas. Elige la ficha y pulsa el hueco donde va.",
  ),
  esquema: TRAZOS.esquema,
  datos: TRAZOS.datos,
  plantilla: codigo(
    "___;",
    "",
    "UPDATE puestos ___ gremio_id = 4 WHERE id = 6;",
    "UPDATE ventas SET monedas = 150 ___ puesto_id = 6 AND dia = 'lunes';",
    "",
    "___;",
  ),
  fichas: ["BEGIN", "SET", "WHERE", "COMMIT", "ROLLBACK", "VALUES", "HAVING", "INSERT"],
  solucion: codigo(
    "BEGIN;",
    "",
    "UPDATE puestos SET gremio_id = 4 WHERE id = 6;",
    "UPDATE ventas SET monedas = 150 WHERE puesto_id = 6 AND dia = 'lunes';",
    "",
    "COMMIT;",
  ),
  tests: [
    {
      nombre: "el tenderete es de los aones",
      codigo: "esperar(consulta(\"SELECT gremio_id FROM puestos WHERE nombre = 'El tenderete'\")[0].gremio_id, 'su gremio').igualA(4)",
    },
    {
      nombre: "y su venta del lunes son 150",
      codigo: "esperar(consulta(\"SELECT monedas FROM ventas WHERE puesto_id = 6\")[0].monedas, 'sus monedas').igualA(150)",
    },
    {
      nombre: "las otras cinco ventas no se han tocado",
      codigo: codigo(
        "esperar(consulta('SELECT SUM(monedas) AS t FROM ventas WHERE puesto_id <> 6')[0].t, 'lo demás').igualA(595)",
        "esperar(cuantas('ventas'), 'las ventas').igualA(6)",
      ),
    },
    {
      nombre: "ya no queda ningún puesto sin gremio",
      codigo: "esperar(consulta('SELECT COUNT(*) AS n FROM puestos WHERE gremio_id IS NULL')[0].n, 'los sin gremio').igualA(0)",
    },
  ],
  pistas: [
    pista("El primero y el último hueco abren y cierran el trámite. Las dos palabras que van ahí son las de la transacción.", 0),
    pista("Los dos de dentro son las piezas de un `UPDATE`: la que dice qué columna se cambia y la que dice en qué filas.", 1),
    pista("Y ojo con el último hueco: hay dos fichas que cierran una transacción y hacen lo contrario. Aquí el trámite hay que **guardarlo**.", 2),
  ],
  recompensa: { croquetas: 8 },
}
