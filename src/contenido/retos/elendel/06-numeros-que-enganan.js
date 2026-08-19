import { codigo, pista } from '../comun.js'

export default {
  id: "elendel-06-numeros-que-enganan",
  mundo: "elendel",
  entorno: "worker",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre números",
  enunciado: codigo(
    "Los números de JavaScript tienen unas cuantas rarezas que no son rarezas: son cómo",
    "funcionan los decimales en cualquier ordenador. Conviene saberlas antes de escribir",
    "algo que maneje dinero.",
    "",
    "Marca las seis y corrige.",
  ),
  afirmaciones: [
    {
      texto: "`0.1 + 0.2 === 0.3` es falso.",
      verdadera: true,
      porque: "Da `0.30000000000000004`. No es un fallo de JavaScript: los decimales se guardan en binario y 0.1 no cabe exacto, igual que un tercio no cabe exacto en decimal. Pasa en casi todos los lenguajes. Por eso el dinero se guarda en céntimos enteros, no en euros con decimales.",
    },
    {
      texto: "`NaN === NaN` es verdadero, porque los dos son NaN.",
      porque: "Es `false`, y es el único valor de JavaScript que no es igual a sí mismo. Por eso comprobarlo con `===` no funciona nunca y hay que usar `Number.isNaN(x)`.",
    },
    {
      texto: "`parseInt('12px')` vale 12, pero `Number('12px')` es `NaN`.",
      verdadera: true,
      porque: "Exacto, y esa es la diferencia entre los dos. `parseInt` lee mientras entiende y se para al llegar a algo raro; `Number` exige que **todo** el texto sea un número. Para validar lo que escribe alguien quieres `Number`, que no se traga medias tintas.",
    },
    {
      texto: "`Math.round(-0.5)` vale `-1`.",
      porque: "Vale `-0`. `Math.round` redondea siempre hacia arriba en los empates, y hacia arriba desde -0.5 es 0. Si esperabas que se alejara del cero, esa es otra función distinta.",
    },
    {
      texto: "Un número entero muy grande puede dejar de ser exacto.",
      verdadera: true,
      porque: "A partir de 9.007.199.254.740.991 —`Number.MAX_SAFE_INTEGER`— los enteros empiezan a saltarse valores: `9007199254740992 + 1` sigue dando el mismo número. Para identificadores grandes hay que usar textos o `BigInt`.",
    },
    {
      texto: "`toFixed(2)` devuelve un número redondeado a dos decimales.",
      porque: "Devuelve un **texto**. `(1.005).toFixed(2)` da `'1.00'`, no `1.01`, y además es texto: sumarle algo lo pega en vez de sumarlo. Sirve para enseñar, nunca para calcular.",
    },
  ],
  pistas: [
    pista("Dos de las seis van de valores que no se comportan como esperarías al compararlos o redondearlos. Pruébalos mentalmente con casos concretos.", 0),
    pista("Una de las falsas dice que algo devuelve un número cuando en realidad devuelve otra cosa. Piensa qué tipo tiene lo que sale.", 1),
    pista("Las tres verdaderas son las tres cosas que hay que saber antes de escribir un programa que maneje dinero: los decimales no son exactos, los enteros tienen techo, y validar texto no es lo mismo que interpretarlo.", 2),
  ],
  recompensa: { croquetas: 11 },
}
