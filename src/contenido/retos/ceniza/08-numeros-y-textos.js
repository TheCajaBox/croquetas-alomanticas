import { codigo, pista } from '../comun.js'

export default {
  id: "ceniza-08-numeros-y-textos",
  mundo: "ceniza",
  entorno: "php",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre comparar",
  enunciado: codigo(
    "PHP convierte tipos por su cuenta cuando le parece que sabe lo que quieres. Eso es",
    "cómodo y es la fuente del fallo más difícil de ver que existe: el que no revienta.",
    "",
    "Seis frases. Márcalas todas y luego lee el porqué de cada una. Se corrigen juntas,",
    "así que piénsatelas antes de enviar.",
  ),
  afirmaciones: [
    {
      texto: "`'5' + 5` vale `10`.",
      verdadera: true,
      porque:
        "El `+` en PHP solo sabe sumar, así que convierte el texto `'5'` a número y suma: 10. Si quisieras pegarlos tendrías que usar el punto: `'5' . 5` vale `'55'`.",
    },
    {
      texto: "`1 == '1'` es `true`, y `1 === '1'` es `false`.",
      verdadera: true,
      porque:
        "Ahí está la diferencia entera. `==` compara valores y convierte si hace falta; `===` exige además el mismo tipo. Un entero y un texto nunca son idénticos, valgan lo que valgan.",
    },
    {
      texto: "`0 == 'abc'` es `true`, porque PHP convierte `'abc'` a cero.",
      porque:
        "Lo era, y era famoso por lo mal que salía. Desde PHP 8 ya no: cuando comparas un número con un texto que **no** parece un número, PHP convierte el número a texto en vez de al revés, y `'0'` no es `'abc'`. Así que es `false`. Si vienes de código antiguo, esto es de lo que más ha cambiado.",
    },
    {
      texto: "`'10' == '1e1'` es `true`.",
      verdadera: true,
      porque:
        "Los dos textos parecen números —`1e1` es notación científica: 1 por 10 elevado a 1— así que PHP los compara como números, y diez es diez. Comparar dos textos con `==` no siempre compara textos, y esta es la prueba.",
    },
    {
      texto: "`null == false` es `true`, y `null === false` también.",
      porque:
        "La primera mitad sí, la segunda no. Con `==` los dos se consideran «vacíos» y salen iguales; con `===` no, porque uno es de tipo `null` y el otro `bool`. Media frase verdadera es una frase falsa.",
    },
    {
      texto: "`empty($x)` es la manera de comprobar si una variable tiene algo dentro.",
      porque:
        "Depende de qué llames «algo». `empty` dice `true` para `null`, `''`, `0`, `'0'`, `false` y el array vacío: para `empty`, un cero está vacío. Con precios, cantidades y notas eso da fallos reales. Si lo que quieres saber es si **existe**, `isset`; si lo que quieres es «no es null», `!== null`.",
    },
  ],
  pistas: [
    pista("Dos de las seis van de `==` frente a `===`. Y una de ellas está a medias, que es la forma más limpia de que una frase sea falsa.", 0),
    pista("Una habla de algo que cambió en PHP 8: comparar un número con un texto que no parece un número ya no da lo que daba antes.", 1),
    pista("La última va de `empty`. Piensa qué contesta `empty` cuando le das el número cero, y si eso es lo que querrías en un carrito de la compra.", 2),
  ],
  recompensa: { croquetas: 7 },
}
