import { codigo, pista } from '../comun.js'

export default {
  id: "es6-06b-verdadero-o-falso",
  mundo: "es6",
  entorno: "worker",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre lo que falta",
  enunciado: codigo(
    "`?.` y `??` son cortos de escribir y fáciles de usar mal, porque se parecen a otras",
    "cosas que no hacen lo mismo. Seis frases: marca cada una y luego mira el porqué.",
    "",
    "Se corrigen todas juntas, así que piénsatelas antes de enviar.",
  ),
  afirmaciones: [
    {
      texto: "`ficha?.nombre` devuelve `undefined` si `ficha` no existe, en vez de reventar.",
      verdadera: true,
      porque: "Eso es exactamente lo que hace. Si `ficha` es `null` o `undefined`, la expresión entera para ahí y vale `undefined`, sin lanzar el `Cannot read properties of undefined` de siempre.",
    },
    {
      texto: "`ficha?.nombre` también te protege si `nombre` no existe dentro de `ficha`.",
      porque: "No hace falta protegerse de eso: pedir una propiedad que no está nunca ha dado error, simplemente vale `undefined`. Lo que revienta es pedirle algo a la **nada**, y de eso es de lo que protege `?.`.",
    },
    {
      texto: "`0 ?? 5` vale `5`.",
      porque: "Vale `0`. `??` solo se salta a la derecha cuando la izquierda es `null` o `undefined`. El cero es un valor perfectamente bueno y se queda. Con `||` sí saldría `5`, y por eso `||` estropea los contadores y los precios que valen cero.",
    },
    {
      texto: "`'' || 'sin nombre'` vale `'sin nombre'`, pero `'' ?? 'sin nombre'` vale `''`.",
      verdadera: true,
      porque: "Ahí está la diferencia entera. `||` mira si es *falsy* —y el texto vacío lo es—; `??` solo mira si falta de verdad. Cuando el vacío es un valor legítimo, `??`; cuando quieres un valor por defecto para cualquier cosa vacía, `||`.",
    },
    {
      texto: "`agentes?.[0]` y `buscar?.()` son formas válidas de lo mismo.",
      verdadera: true,
      porque: "El encadenamiento opcional funciona también con corchetes y con llamadas. `agentes?.[0]` no revienta si no hay lista, y `buscar?.()` solo llama a la función si existe — muy útil para callbacks que pueden no venir.",
    },
    {
      texto: "`ficha?.nombre = 'Wax'` es la forma segura de asignar cuando `ficha` puede no existir.",
      porque: "Eso ni siquiera se puede escribir: da error de sintaxis. `?.` sirve para **leer**, no para asignar. Si `ficha` puede no existir, hay que comprobarlo antes y decidir qué hacer, porque «no asignar y seguir como si nada» casi nunca es lo que quieres.",
    },
  ],
  pistas: [
    pista("Dos de las seis van de la diferencia entre `??` y `||`. La clave está en qué considera «vacío» cada uno: uno es muy estricto y el otro muy amplio.", 0),
    pista("`?.` protege de una cosa muy concreta: pedirle algo a `null` o a `undefined`. Pedir una propiedad que no existe dentro de un objeto que sí existe nunca ha sido un error.", 1),
    pista("La última va de si `?.` sirve para escribir además de para leer. Piensa qué debería pasar si el objeto no existe: ¿dónde se guardaría el valor?", 2),
  ],
  recompensa: { croquetas: 8 },
}
