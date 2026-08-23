import { codigo, pista } from '../comun.js'
import { TRAZOS } from '../tablas-de-elantris.js'

export default {
  id: "trazos-07-cada-regla-lo-suyo",
  mundo: "trazos",
  entorno: "sql",
  tipo: "emparejar",
  titulo: "Cada regla salta por su lado",
  enunciado: codigo(
    "Seis órdenes que la base **rechaza**, cada una por una regla distinta del esquema. Empareja",
    "cada una con lo que la para.",
    "",
    "Merece la pena reconocer estos errores de vista: son los seis que vas a ver en tu vida",
    "cuando un programa intente guardar algo que no debe.",
  ),
  esquema: TRAZOS.esquema,
  datos: TRAZOS.datos,
  parejas: [
    {
      izquierda: "INSERT INTO puestos (nombre, gremio_id) VALUES ('Aon Aon', 1)",
      derecha: "`UNIQUE` en `nombre`: ya hay un puesto con ese nombre y esa columna no admite repetidos.",
    },
    {
      izquierda: "INSERT INTO puestos (nombre, gremio_id) VALUES ('Nuevo', 99)",
      derecha: "Clave ajena: no existe ningún gremio con el 99, así que la fila apuntaría al vacío.",
    },
    {
      izquierda: "DELETE FROM gremios WHERE id = 1",
      derecha: "Clave ajena por el otro lado: ese gremio tiene puestos, y borrarlo los dejaría apuntando a nada.",
    },
    {
      izquierda: "INSERT INTO ventas (puesto_id, dia, monedas) VALUES (1, 'martes', 50)",
      derecha: "`UNIQUE (puesto_id, dia)`: ese puesto ya tiene un apunte de ese día. La pareja no se puede repetir.",
    },
    {
      izquierda: "INSERT INTO ventas (puesto_id, dia, monedas) VALUES (1, 'jueves', -20)",
      derecha: "`CHECK (monedas >= 0)`: no hay ventas negativas, y la tabla lo dice.",
    },
    {
      izquierda: "INSERT INTO ventas (dia, monedas) VALUES ('jueves', 30)",
      derecha: "`NOT NULL` en `puesto_id`: esa columna es obligatoria y no se ha dado ningún valor.",
    },
  ],
  pistas: [
    pista("Mira el esquema de abajo y ve marcando qué regla toca cada orden. Dos de ellas chocan con la misma clase de regla desde lados distintos.", 0),
    pista("Hay dos `UNIQUE` en el esquema y son distintos: uno sobre una columna sola y otro sobre una pareja de columnas. Cada uno tiene su orden aquí.", 1),
    pista("Y de las dos claves ajenas: una salta al **meter** algo que apunta a lo que no existe, y la otra al **borrar** algo a lo que otros apuntan. La base no te deja dejar los datos a medias por ninguno de los dos lados.", 2),
  ],
  recompensa: { croquetas: 8 },
}
