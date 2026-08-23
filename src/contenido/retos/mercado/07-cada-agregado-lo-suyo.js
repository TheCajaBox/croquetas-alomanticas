import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "mercado-07-cada-agregado-lo-suyo",
  mundo: "mercado",
  entorno: "sql",
  tipo: "emparejar",
  titulo: "Cada agregado trae lo suyo",
  enunciado: codigo(
    "Los cinco agregados que se usan el noventa por ciento del tiempo, aplicados a la tabla",
    "`ventas` entera -las dieciséis filas, sin agrupar nada-.",
    "",
    "Empareja cada consulta con lo que devuelve. Están las cifras en la tabla de abajo y son",
    "sumas cortas.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  parejas: [
    {
      izquierda: "SELECT COUNT(*) FROM ventas",
      derecha: "16 — cuántas filas hay. Cuenta filas, no valores, así que los nulos no le afectan.",
    },
    {
      izquierda: "SELECT SUM(monedas) FROM ventas",
      derecha: "1275 — la suma de la columna en las dieciséis filas.",
    },
    {
      izquierda: "SELECT MAX(monedas) FROM ventas",
      derecha: "200 — el valor más alto de la columna, que es una venta de Los dos ríos.",
    },
    {
      izquierda: "SELECT MIN(monedas) FROM ventas",
      derecha: "35 — el más bajo, que es cualquiera de las tres ventas de Aon Ashe.",
    },
    {
      izquierda: "SELECT COUNT(DISTINCT puesto_id) FROM ventas",
      derecha: "8 — cuántos puestos distintos han vendido algo. No cuenta filas: cuenta valores sin repetir.",
    },
    {
      izquierda: "SELECT COUNT(DISTINCT dia) FROM ventas",
      derecha: "3 — cuántos días distintos hay, aunque en cada uno haya varias ventas.",
    },
  ],
  pistas: [
    pista("Las dos primeras son de contar y sumar, y son las más directas: dieciséis filas y su suma.", 0),
    pista("`MAX` y `MIN` devuelven **un valor de la columna**, no la fila entera. Para saber de quién es ese valor hace falta otra cosa, y llega en El Dor.", 1),
    pista("`COUNT(DISTINCT columna)` es el que se olvida y el que más falta hace: contesta a «¿cuántos hay **distintos**?», que no es lo mismo que «¿cuántas filas hay?». Los dos últimos usan la misma idea sobre columnas distintas.", 2),
  ],
  recompensa: { croquetas: 7 },
}
