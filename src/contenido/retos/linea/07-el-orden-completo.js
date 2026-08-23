import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "linea-07-el-orden-completo",
  mundo: "linea",
  entorno: "sql",
  tipo: "ordenar",
  titulo: "Las siete cláusulas, en su sitio",
  enunciado: codigo(
    "Las siete cláusulas de una consulta, desordenadas. Es lo que aprendiste en Kae con cinco y",
    "en El mercado con siete, y colocarlas de memoria es la señal de que el camino se ha",
    "quedado.",
    "",
    "Colócalas con las flechas y ejecútalo. Si te equivocas, no pasa nada: la base te dirá que",
    "no entiende nada, que es lo que hace cuando una cláusula se sale de sitio.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  lineas: [
    "SELECT p.nombre AS puesto, SUM(v.monedas) AS total",
    "FROM ventas AS v",
    "JOIN puestos AS p ON v.puesto_id = p.id",
    "WHERE v.monedas >= 40",
    "GROUP BY p.id",
    "HAVING SUM(v.monedas) > 100",
    "ORDER BY total DESC",
    "LIMIT 3;",
  ],
  tests: [
    {
      nombre: "los tres que más recaudan contando solo las ventas de 40 o más",
      codigo: codigo(
        "esperar(columnas, 'las columnas').igualA(['puesto', 'total'])",
        "esperar(filas.map((f) => f.puesto), 'los puestos').igualA(['Los dos ríos', 'El caldero', 'El yunque'])",
        "esperar(filas.map((f) => f.total), 'los totales').igualA([320, 210, 180])",
      ),
    },
    {
      nombre: "y Aon Ashe no está: sus tres ventas de 35 no se cuentan, así que no llega a 100",
      codigo: "esperar(filas.map((f) => f.puesto), 'los puestos').noContiene('Aon Ashe')",
    },
  ],
  pistas: [
    pista("Empieza por lo único que puede ir primero, y sigue por lo único que puede ir detrás. Después de `SELECT` va siempre `FROM`.", 0),
    pista("La unión va pegada al `FROM`, porque forma parte de decir de dónde salen las filas. Después se filtra, después se agrupa.", 1),
    pista("Y los dos que se confunden van seguidos y en este orden: primero el que filtra **filas** y luego el que filtra **montones**. Ordenar y cortar son siempre lo último.", 2),
  ],
  recompensa: { croquetas: 8 },
}
