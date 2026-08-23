import { codigo, pista } from '../comun.js'

export default {
  id: "ruina-04-seis-frases-del-final",
  mundo: "ruina",
  entorno: "php",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases de toda la era",
  enunciado: codigo(
    "Seis frases, una de cada mundo. No hay ninguna nueva: si has llegado hasta aquí, las seis",
    "las has visto pasar.",
    "",
    "Márcalas todas y luego lee el porqué de cada una.",
  ),
  afirmaciones: [
    {
      texto: "`'0'` cuenta como falso en un `if`, y `'0.0'` cuenta como cierto.",
      verdadera: true,
      porque:
        "La excepción es literalmente el texto `'0'`, no «cualquier texto que parezca cero». Con datos de un formulario -donde todo llega como texto- eso muerde de verdad, y el arreglo no es aprenderse la lista: es comparar con `=== '0'` o convertir a número a propósito.",
    },
    {
      texto: "`array_map` con una lista vacía devuelve `null`.",
      porque:
        "Devuelve una lista vacía, sin dar una vuelta y sin quejarse. Y eso vale para las tres: con la lista vacía, `array_filter` devuelve `[]` y `array_reduce` devuelve el valor de partida tal cual. No hay que tratar el caso vacío aparte, y eso es una de las cosas buenas de trabajar así.",
    },
    {
      texto: "`$stock ?? 99` devuelve `0` cuando el stock es `0`, y `$stock ?: 99` devuelve `99`.",
      verdadera: true,
      porque:
        "`??` pregunta si hay algo -si es `null` o no existe- y el cero es algo. `?:` pregunta si cuenta como cierto, y un cero, un texto vacío y un array vacío no cuentan. Un stock de cero unidades convertido en 99 es un fallo que nadie ve leyendo el código.",
    },
    {
      texto: "Pasar un objeto a una función y cambiarlo dentro cambia el objeto de quien llamó.",
      verdadera: true,
      porque:
        "Lo que se pasa es la manija, no el objeto. Es lo contrario de lo que pasa con un array, que sí se copia. Se aprovecha a propósito -un almacén al que le vas guardando cosas funciona así- y muerde cuando no te acuerdas.",
    },
    {
      texto: "Si una clase hija define un constructor, PHP ejecuta primero el de la madre y luego el de la hija.",
      porque:
        "No: el de la hija **sustituye** al de la madre, y hay que llamarlo a mano con `parent::__construct(...)`. Es la fuente número uno de objetos a medio construir, y el error aparece más tarde y en otro sitio, cuando alguien lee una propiedad sin rellenar.",
    },
    {
      texto: "Un refactor puede cambiar el orden en que salen las cosas si el resultado queda mejor.",
      porque:
        "Entonces no es un refactor. Un refactor conserva el comportamiento; mejorarlo está muy bien y va en un cambio aparte, donde se vea que el comportamiento cambia a propósito. Mezclar las dos cosas deja un cambio que nadie puede revisar.",
    },
  ],
  pistas: [
    pista("Una de cada mundo, en orden: La Ceniza, La tripulación, El Pozo, La Fundación otra vez... y la última es de El kandra.", 0),
    pista("Tres son ciertas y tres son falsas. Las falsas dicen que PHP hace lo cómodo o que un refactor puede hacer dos cosas a la vez.", 1),
    pista("La de `array_map` y la del constructor son las dos que más veces se dan por buenas sin comprobarlas.", 2),
  ],
  recompensa: { croquetas: 8 },
}
