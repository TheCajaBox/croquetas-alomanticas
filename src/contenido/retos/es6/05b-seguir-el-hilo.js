import { codigo, pista } from '../comun.js'

export default {
  id: "es6-05b-seguir-el-hilo",
  mundo: "es6",
  entorno: "worker",
  tipo: "trazar",
  titulo: "Por dentro de un reduce",
  enunciado: codigo(
    "`reduce` es el método que más gente usa copiando la forma sin saber qué pasa dentro.",
    "Y lo que pasa dentro es sencillo: **tu función se llama una vez por elemento**, y lo",
    "que devuelve en una llamada es lo que le llega como `suma` en la siguiente.",
    "",
    "Rellena la tabla, una fila por llamada. Ahí se ve entero.",
  ),
  codigoMostrado: codigo(
    "const metales = [",
    "  { nombre: 'acero', precio: 12 },",
    "  { nombre: 'peltre', precio: 30 },",
    "  { nombre: 'oro', precio: 8 },",
    "]",
    "",
    "const total = metales.reduce((suma, metal) => suma + metal.precio, 0)",
    "",
    "console.log(total)",
  ),
  variables: ["suma", "metal.precio", "devuelve"],
  pasos: [
    { etiqueta: "1.ª llamada", valores: { suma: "0", "metal.precio": "12", devuelve: "12" } },
    { etiqueta: "2.ª llamada", valores: { suma: "12", "metal.precio": "30", devuelve: "42" } },
    { etiqueta: "3.ª llamada", valores: { suma: "42", "metal.precio": "8", devuelve: "50" } },
  ],
  valoresPosibles: ["0", "8", "12", "30", "42", "50", "3", "25", "122", "undefined"],
  porque: codigo(
    "Mira la columna de `suma` y la de `devuelve`: **están desplazadas una fila**. Lo que",
    "una llamada devuelve es exactamente lo que la siguiente recibe como `suma`. Eso es",
    "`reduce` entero, y por eso se llama así — va plegando la lista sobre sí misma.",
    "",
    "El `0` del final de la línea no es un detalle: es lo que vale `suma` en la primera",
    "llamada, cuando todavía no hay nada acumulado. Si lo quitas, `reduce` coge el primer",
    "elemento de la lista como valor de partida — que aquí sería un objeto, y sumarle un",
    "número daría `[object Object]12`. De ahí sale ese resultado absurdo que todo el mundo",
    "ha visto alguna vez.",
  ),
  tests: [
    {
      nombre: "los tres precios suman 50",
      codigo: codigo(
        "esperar(consola.map((linea) => linea.texto).join(String.fromCharCode(10)))",
        "  .diceLoMismoQue('50')",
      ),
    },
  ],
  pistas: [
    pista("Empieza por la primera fila. `suma` vale al principio lo que pone al final de la llamada a `reduce`, después de la coma.", 0),
    pista("`devuelve` es el resultado de `suma + metal.precio` en esa misma fila. Calcúlalo fila por fila, sin adelantarte.", 1),
    pista("Cuando tengas la primera fila entera, la segunda sale sola: `suma` de la segunda es lo que devolvió la primera. Y así hasta abajo.", 2),
  ],
  recompensa: { croquetas: 9 },
}
