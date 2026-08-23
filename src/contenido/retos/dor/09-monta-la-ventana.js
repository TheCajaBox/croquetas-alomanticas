import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "dor-09-monta-la-ventana",
  mundo: "dor",
  entorno: "sql",
  tipo: "completar",
  titulo: "Monta la ventana",
  enunciado: codigo(
    "La consulta quiere, para cada venta, saber **qué número hace dentro de su día**: la primera",
    "del lunes, la segunda del lunes, y así. De más caras a más baratas.",
    "",
    "Fíjate en que aquí no se filtra nada y salen las dieciséis ventas: una función de ventana",
    "no reduce filas, las anota.",
    "",
    "Faltan cuatro piezas. Elige la ficha y pulsa el hueco donde va.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  plantilla: codigo(
    "SELECT",
    "  dia,",
    "  monedas,",
    "  ___() OVER (___ dia ___ monedas ___) AS numero",
    "FROM ventas",
    "ORDER BY dia ASC, numero ASC;",
  ),
  fichas: ["ROW_NUMBER", "PARTITION BY", "ORDER BY", "DESC", "ASC", "COUNT", "GROUP BY", "SUM"],
  solucion: codigo(
    "SELECT",
    "  dia,",
    "  monedas,",
    "  ROW_NUMBER() OVER (PARTITION BY dia ORDER BY monedas DESC) AS numero",
    "FROM ventas",
    "ORDER BY dia ASC, numero ASC;",
  ),
  tests: [
    { nombre: "las tres columnas", codigo: "esperar(columnas, 'las columnas').igualA(['dia', 'monedas', 'numero'])" },
    {
      nombre: "las dieciséis ventas: una ventana no reduce filas",
      codigo: "esperar(filas, 'las filas').tieneLongitud(16)",
    },
    {
      nombre: "la numeración empieza de nuevo en cada día",
      codigo: codigo(
        "const primeros = filas.filter((f) => f.numero === 1)",
        "esperar(primeros.map((f) => f.dia), 'los primeros de cada día').igualA(['lunes', 'martes', 'miércoles'])",
      ),
    },
    {
      nombre: "y el número 1 de cada día es su venta más alta",
      codigo: codigo(
        "esperar(filas.find((f) => f.dia === 'lunes' && f.numero === 1).monedas, 'la mejor del lunes').igualA(200)",
        "esperar(filas.find((f) => f.dia === 'martes' && f.numero === 1).monedas, 'la mejor del martes').igualA(120)",
      ),
    },
    {
      nombre: "el lunes tuvo ocho ventas y el miércoles una",
      codigo: codigo(
        "esperar(filas.filter((f) => f.dia === 'lunes'), 'las del lunes').tieneLongitud(8)",
        "esperar(filas.filter((f) => f.dia === 'miércoles'), 'las del miércoles').tieneLongitud(1)",
      ),
    },
  ],
  pistas: [
    pista("El primer hueco es la función que numera sin repetir. Los otros tres van dentro del `OVER`.", 0),
    pista("Dentro del `OVER` hay dos cosas: quién define los grupos y en qué orden se numera dentro de cada grupo. El enunciado dice «dentro de su día» y «de más caras a más baratas».", 1),
    pista("Ojo a no confundir el `ORDER BY` de dentro del `OVER` -que decide la numeración- con el de la última línea, que decide cómo se pinta el resultado. Son dos y hacen cosas distintas.", 2),
  ],
  recompensa: { croquetas: 9 },
}
