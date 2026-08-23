import { codigo, pista } from '../comun.js'
import { MUROS } from '../tablas-de-elantris.js'

export default {
  id: "muros-09-el-informe-de-los-gremios",
  mundo: "muros",
  entorno: "sql",
  tipo: "codigo",
  titulo: "Desde el otro lado",
  enunciado: codigo(
    "Hasta ahora se unía desde los puestos. Ahora al revés, y cambia lo que se pierde: el",
    "gremio de los aones no tiene ni un puesto, así que uniendo desde los gremios es **él** el",
    "que se queda sin pareja.",
    "",
    "Escribe una consulta que devuelva **los seis gremios** con tres columnas:",
    "",
    "- `gremio` — el nombre del gremio.",
    "- `maestro` — su maestro.",
    "- `puesto` — el nombre de uno de sus puestos, o nulo si no tiene ninguno.",
    "",
    "Ordenadas por el nombre del gremio y, dentro de cada gremio, por el del puesto.",
    "",
    "Ojo a cuántas filas salen: un gremio con tres puestos sale tres veces. Eso no es un fallo,",
    "es lo que significa unir.",
  ),
  esquema: MUROS.esquema,
  datos: MUROS.datos,
  inicial: codigo(
    "SELECT",
    "FROM gremios AS g",
    "-- Ahora la de la izquierda es gremios.",
  ),
  solucion: codigo(
    "SELECT g.nombre AS gremio, g.maestro AS maestro, p.nombre AS puesto",
    "FROM gremios AS g",
    "LEFT JOIN puestos AS p ON p.gremio_id = g.id",
    "ORDER BY g.nombre ASC, p.nombre ASC;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "LEFT JOIN", texto: "No se puede perder ningún gremio: `LEFT JOIN`" },
    { tipo: "usaPalabra", valor: "ON", texto: "Y su `ON`" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta" },
  ],
  tests: [
    {
      nombre: "las tres columnas, con sus nombres",
      codigo: "esperar(columnas, 'las columnas').igualA(['gremio', 'maestro', 'puesto'])",
    },
    {
      nombre: "nueve filas: los ocho puestos con gremio, más el gremio sin puestos",
      codigo: "esperar(filas, 'las filas').tieneLongitud(9)",
    },
    {
      nombre: "los seis gremios salen todos",
      codigo: codigo(
        "esperar([...new Set(filas.map((f) => f.gremio))].sort(), 'los gremios')",
        "  .igualA(['aones', 'canteros', 'cocineros', 'comercio', 'escribas', 'herreros'])",
      ),
    },
    {
      nombre: "el de los aones sale una vez, sin puesto",
      codigo: codigo(
        "const aones = filas.filter((f) => f.gremio === 'aones')",
        "esperar(aones, 'las filas de los aones').tieneLongitud(1)",
        "esperar(aones[0].puesto, 'su puesto').igualA(null)",
        "esperar(aones[0].maestro, 'su maestro').igualA('Raoden')",
      ),
    },
    {
      nombre: "el de los escribas sale tres veces, una por puesto",
      codigo: codigo(
        "const escribas = filas.filter((f) => f.gremio === 'escribas')",
        "esperar(escribas, 'las filas de los escribas').tieneLongitud(3)",
        "esperar(escribas.map((f) => f.puesto), 'sus puestos').igualA(['Aon Aon', 'Aon Ashe', 'Aon Ien'])",
      ),
    },
    {
      nombre: "el maestro de los cocineros está a nulo, y aun así el gremio sale",
      codigo: codigo(
        "const cocineros = filas.find((f) => f.gremio === 'cocineros')",
        "esperar(cocineros.maestro, 'el maestro de los cocineros').igualA(null)",
        "esperar(cocineros.puesto, 'su puesto').igualA('El caldero')",
      ),
    },
    {
      nombre: "el tenderete no está: no es de ningún gremio",
      codigo: "esperar(filas.map((f) => f.puesto), 'los puestos').noContiene('El tenderete')",
    },
    {
      nombre: "y los gremios en orden alfabético",
      codigo: "esperar(filas[0].gremio, 'el primer gremio').igualA('aones')",
    },
  ],
  variantes: [
    {
      titulo: "Desde el otro lado · otra tanda",
      datos: codigo(
        'INSERT INTO gremios (id, nombre, maestro) VALUES',
        "  (1, 'escribas',  'Adien'),",
        "  (2, 'canteros',  NULL),",
        "  (3, 'cocineros', 'Mareshe'),",
        "  (4, 'herreros',  'Saolin'),",
        "  (5, 'comercio',  'Roial'),",
        "  (6, 'aones',     'Raoden');",
        '',
        'INSERT INTO puestos (id, nombre, gremio_id, monedas) VALUES',
        "  (1, 'Aon Rao',      6,    260),",
        "  (2, 'El cincel',    2,    150),",
        "  (3, 'La brasa',     3,     80),",
        "  (4, 'Aon Dii',      6,    115),",
        "  (5, 'El fuelle',    4,    200),",
        "  (6, 'La balanza',   5,    340),",
        "  (7, 'El tenderete', NULL,  30);",
      ),
      tests: [
        { nombre: "las tres columnas", codigo: "esperar(columnas).igualA(['gremio', 'maestro', 'puesto'])" },
        {
          nombre: "siete filas: seis puestos con gremio, más el gremio que se queda vacío",
          codigo: "esperar(filas).tieneLongitud(7)",
        },
        {
          nombre: "aquí el que se queda sin puestos es el de los escribas",
          codigo: codigo(
            "const escribas = filas.filter((f) => f.gremio === 'escribas')",
            "esperar(escribas).tieneLongitud(1)",
            "esperar(escribas[0].puesto).igualA(null)",
          ),
        },
        {
          nombre: "y el de los aones sale dos veces",
          codigo: "esperar(filas.filter((f) => f.gremio === 'aones').map((f) => f.puesto)).igualA(['Aon Dii', 'Aon Rao'])",
        },
      ],
    },
  ],
  pistas: [
    pista("Es la consulta de antes con las tablas cambiadas de sitio. La que va en el `FROM` es la que no se pierde.", 0),
    pista("La condición del `ON` no cambia: sigue siendo la clave ajena de puestos contra el `id` de gremios. Da igual en qué orden la escribas.", 1),
    pista("Y hay dos nulos distintos en el resultado. Uno viene de la unión -el gremio sin puestos- y el otro estaba en la tabla -el gremio sin maestro-. Los dos se pintan igual y no significan lo mismo.", 2),
  ],
  recompensa: { croquetas: 9 },
}
