import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "dor-04-seis-frases-sobre-el-nulo",
  mundo: "dor",
  entorno: "sql",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre el nulo",
  enunciado: codigo(
    "El nulo es lo que más consultas rompe en silencio de todo SQL, y siempre por el mismo",
    "motivo: se piensa como «vacío» y funciona como «no lo sé».",
    "",
    "Seis frases. Se corrigen todas juntas.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  afirmaciones: [
    {
      texto: "`WHERE gremio_id = NULL` no encuentra el puesto sin gremio.",
      verdadera: true,
      porque:
        "No encuentra nada: devuelve cero filas. La comparación vale «desconocido» y el `WHERE` solo deja pasar lo verdadero. Y no da error, que es lo peor: una consulta que busca los huecos y devuelve cero filas parece decir «no hay huecos».",
    },
    {
      texto: "`WHERE gremio_id <> 1` devuelve todos los puestos que no son de los escribas.",
      porque:
        "Devuelve los cinco que son de otro gremio, y **se deja fuera al que no tiene ninguno**. Su comparación vale «desconocido», así que no pasa. Hay nueve puestos, tres son de escribas, y esa consulta devuelve cinco: falta uno y nadie lo echa de menos. Para incluirlo: `WHERE gremio_id <> 1 OR gremio_id IS NULL`.",
    },
    {
      texto: "Lo contrario de una condición desconocida sigue siendo desconocido.",
      verdadera: true,
      porque:
        "Y por eso el nulo se cuela por los dos lados. Si no sabes si algo es verdad, tampoco sabes si es mentira: `NOT (desconocido)` es desconocido. Es la razón de que una condición y su contraria puedan dejar fuera a la misma fila, que es lo que rompe la intuición.",
    },
    {
      texto: "`COUNT(*)` y `COUNT(gremio_id)` dan lo mismo en la tabla `puestos`.",
      porque:
        "Nueve y ocho. `COUNT(*)` cuenta filas y `COUNT(columna)` cuenta valores no nulos, y hay un puesto sin gremio. Es la misma diferencia que ya cazó el mundo anterior, aquí sin ninguna unión por medio: basta con que la columna tenga un hueco.",
    },
    {
      texto: "Un nulo no es lo mismo que un cero ni que el texto vacío.",
      verdadera: true,
      porque:
        "Son tres cosas distintas y conviene no mezclarlas al guardar datos. `0` es un número; `''` es un texto de longitud cero; `NULL` es «aquí no hay dato». Un puesto con `monedas = 0` vendió y no sacó nada; uno con `monedas = NULL` no se sabe qué hizo. Guardar ceros donde faltan datos estropea todas las medias que vengan después.",
    },
    {
      texto: "En un `ORDER BY`, los nulos van siempre al final.",
      porque:
        "No hay «siempre»: depende de la base. SQLite los pone primero al ordenar de menor a mayor -los trata como el valor más bajo-, PostgreSQL los pone al final, y todas admiten decirlo a mano con `NULLS FIRST` o `NULLS LAST`. Si el sitio de los huecos importa en tu informe, se dice; si no se dice, cambia al cambiar de base.",
    },
  ],
  pistas: [
    pista("Tres frases son verdad. Dos de las falsas se pueden comprobar ejecutando una consulta de tres palabras sobre la tabla de abajo.", 0),
    pista("La de `<> 1` es la que más daño hace en la vida real. Cuenta a mano cuántos puestos deberían salir y ejecútala.", 1),
    pista("Y la del `ORDER BY` es la única que habla de «siempre». Cuando una frase sobre SQL dice «siempre» y no está en el estándar, suele ser falsa.", 2),
  ],
  recompensa: { croquetas: 8 },
}
