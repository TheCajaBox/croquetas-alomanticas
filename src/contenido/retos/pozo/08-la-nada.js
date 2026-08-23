import { codigo, pista } from '../comun.js'

export default {
  id: "pozo-08-la-nada",
  mundo: "pozo",
  entorno: "php",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre la nada",
  enunciado: codigo(
    "`null` no es un valor como los demás: significa «aquí no hay nada, y consta». No es cero,",
    "no es un texto vacío y no es `false`, aunque en un `if` los cuatro se comporten igual.",
    "",
    "La mitad de los fallos que llegan a producción son un `null` donde alguien esperaba un",
    "dato. Estas seis frases son las que hay que tener claras para que no pasen.",
    "",
    "Seis frases. Márcalas todas y luego lee el porqué de cada una.",
  ),
  afirmaciones: [
    {
      texto: "`$a ?? 'algo'` devuelve `'algo'` cuando `$a` vale `null`, y también cuando vale `0`.",
      porque:
        "Solo cuando vale `null` —o cuando la variable no existe—. Y esa es justo la gracia de `??`: distingue «no hay dato» de «el dato es cero». Con `?:` no: `0 ?: 'algo'` devuelve `'algo'`, y ahí es donde un precio de cero euros se convierte en otra cosa sin que nadie se entere.",
    },
    {
      texto: "`isset($lista['clave'])` devuelve `false` si la clave existe pero vale `null`.",
      verdadera: true,
      porque:
        "`isset` pregunta dos cosas a la vez: que exista **y** que no sea `null`. Cuando hace falta distinguir «no está» de «está y vale nada», la que responde es `array_key_exists`, que solo mira si la clave existe.",
    },
    {
      texto: "Leer una clave que no existe revienta el programa.",
      porque:
        "No revienta: avisa —`Undefined array key`— y sigue adelante con `null`. Eso es peor que reventar, porque el `null` se cuela hacia abajo y el aviso se pierde entre otros cien. Por eso se lee con `??` cuando puede no estar.",
    },
    {
      texto: "`$agente?->sombrero` devuelve `null` si `$agente` es `null`, sin dar error.",
      verdadera: true,
      porque:
        "Es el encadenamiento opcional. Sin él, pedirle algo a `null` lanza un error de los que sí paran el programa. Con él, la cadena entera se rinde y devuelve `null` en cuanto encuentra la nada, y el resto ni se intenta.",
    },
    {
      texto: "Una función que se queda sin `return` devuelve `null`.",
      verdadera: true,
      porque:
        "Y es la fuente número uno de `null` inesperados. Un `return` dentro de un `if` que no se cumple deja la función terminando por abajo, y por abajo se devuelve `null`. Declarar el tipo de retorno —`: string`— convierte ese descuido en un error inmediato, que es exactamente lo que uno quiere.",
    },
    {
      texto: "`null == false` es cierto, y `null === false` es falso.",
      verdadera: true,
      porque:
        "`==` convierte antes de comparar y para él la nada y lo falso son parecidos; `===` exige que el tipo coincida y `null` es su propio tipo. La costumbre buena es preguntar `=== null`, o mejor `is_null` cuando queda más legible, y no fiarse de `==`.",
    },
  ],
  pistas: [
    pista("Piensa en la diferencia entre «no tengo el dato» y «el dato que tengo es cero». `??` la respeta; un `if` normal no.", 0),
    pista("Tres de las seis son ciertas y tres son falsas, y las falsas lo son por poco: cambian una palabra de lo que pasa de verdad.", 1),
    pista("Prueba en un reto anterior: `$vacio = null; var_dump($vacio ?? 'algo'); var_dump(0 ?? 'algo');`. La segunda devuelve `0`.", 2),
  ],
  recompensa: { croquetas: 6 },
}
