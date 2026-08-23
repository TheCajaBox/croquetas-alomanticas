import { codigo, pista } from '../comun.js'
import { PUESTOS } from '../tablas-de-kae.js'

export default {
  id: "kae-10-la-lupa-del-like",
  mundo: "kae",
  entorno: "sql",
  tipo: "emparejar",
  titulo: "La lupa del LIKE",
  enunciado: codigo(
    "`=` compara textos enteros: o son iguales letra por letra o no. `LIKE` compara **la",
    "forma**, y para eso tiene dos comodines:",
    "",
    "- `%` vale por cualquier trozo de texto, **incluso por ninguno**.",
    "- `_` vale por un carácter y exactamente uno.",
    "",
    "Los puestos del mercado se llaman como se llaman. Empareja cada condición con lo que",
    "devuelve al aplicarla sobre la columna `nombre`.",
  ),
  esquema: PUESTOS.esquema,
  datos: PUESTOS.datos,
  parejas: [
    {
      izquierda: "nombre LIKE 'Aon %'",
      derecha: "Los tres de los escribas: «Aon Aon», «Aon Ien» y «Aon Ashe».",
    },
    {
      izquierda: "nombre LIKE 'La %'",
      derecha: "«La piedra» y «La muralla»: los dos que empiezan por ese artículo.",
    },
    {
      izquierda: "nombre LIKE '%a'",
      derecha: "«La piedra» y «La muralla»: los que acaban en esa letra, empiecen como quieran.",
    },
    {
      izquierda: "nombre LIKE 'Aon ___'",
      derecha: "«Aon Aon» y «Aon Ien»: los de tres letras justas después del espacio.",
    },
    {
      izquierda: "nombre = 'Aon %'",
      derecha: "Ninguno. Sin `LIKE`, el `%` es un carácter más y ningún puesto se llama así.",
    },
    {
      izquierda: "nombre LIKE '%'",
      derecha: "Los ocho. Ese comodín también vale por «nada», así que no descarta a nadie.",
    },
  ],
  pistas: [
    pista("Mira dónde está el comodín. Al final significa «empieza por»; al principio, «acaba en»; en los dos lados, «lleva dentro».", 0),
    pista("`_` no es lo mismo que `%`: cuenta caracteres. `'Aon ___'` exige tres exactos, así que «Ashe», que tiene cuatro, se queda fuera.", 1),
    pista("Y hay una pareja tramposa a propósito: la que no lleva `LIKE`. Sin `LIKE` los comodines no son comodines, son símbolos normales, y entonces la comparación es literal.", 2),
  ],
  recompensa: { croquetas: 6 },
}
