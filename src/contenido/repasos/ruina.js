/**
 * Las preguntas del repaso de «ruina», el último de la primera era.
 *
 * Va en su propio fichero y se pide al abrir el repaso. Ver `repasos/index.js`.
 */
export default {
  id: "repaso-ruina",
  mundo: "ruina",
  quien: "brisa",
  titulo: "El caso del final",
  preguntas: [
    {
      pregunta: "¿Por qué el registro puede exigir datos completos si el mundo se los manda incompletos?",
      opciones: [
        {
          texto: "Porque hay una frontera -la fábrica- donde los datos crudos se convierten en objetos de fiar.",
          correcta: true,
          porque: "Es la idea que sostiene toda la primera era. Un solo sitio donde algo puede faltar, y a partir de ahí todo lo de dentro puede ser exigente. Sin esa frontera, cada método tiene que defenderse por su cuenta con `??`, y una errata en una clave no la caza nadie.",
        },
        {
          texto: "Porque PHP rellena las claves que faltan con valores por defecto.",
          porque: "No rellena nada: avisa y devuelve `null`. Y eso es peor que reventar, porque el `null` se cuela hacia abajo y el aviso se pierde en un fichero que nadie lee.",
        },
        {
          texto: "Porque los tipos declarados en el constructor convierten lo que les llegue.",
          porque: "Comprueban, no rellenan. Un `int $sacos` al que le pasan `null` lanza un error, que es lo que se quiere; lo que no hace es inventarse un cero.",
        },
      ],
    },
    {
      pregunta: "`anotar` lanza y `deLista` no lanza nunca. ¿Cuál está mal?",
      opciones: [
        {
          texto: "Ninguna: depende de quién esté al otro lado.",
          correcta: true,
          porque: "`anotar` la llama un programador y le está pidiendo algo imposible: lanzar es lo honrado. `deLista` recibe lo que llegue del mundo -un fichero, un formulario- y ahí lo raro es normal: anota lo que puede y calla. Que una función lance o recoja no depende de lo grave que sea el problema, sino de quién la llama.",
        },
        {
          texto: "`deLista`: una excepción no se puede tragar sin más.",
          porque: "Como regla general es cierto -un `catch` vacío es la manera de perder un error del todo-, y aquí es a propósito y está documentado: la función promete no quejarse. Lo que sí sería un fallo es tragarla y no dejar rastro en un sitio donde nadie lo espera.",
        },
        {
          texto: "`anotar`: debería devolver `false` en vez de lanzar.",
          porque: "Un `false` se puede ignorar sin querer, y una excepción obliga a decidir. Además, `false` no dice **cuál** de los dos problemas ha sido; el mensaje de la excepción, sí.",
        },
      ],
    },
    {
      pregunta: "Una urgente llamada `'A'` y una normal llamada `'A'`. ¿Está repetida?",
      opciones: [
        {
          texto: "No, porque su nombre visible es `'A!'` y se compara por lo que se ve.",
          correcta: true,
          porque: "La urgente cambia su `nombre()`, así que el nombre con el que aparece en el informe es otro. Comparar por el dato de dentro y no por lo que el objeto dice de sí mismo es la diferencia entre pasar un test y pasar el otro: hay uno para cada caso.",
        },
        {
          texto: "Sí: las dos guardan el mismo nombre por dentro.",
          porque: "Lo guardan y no es lo que se compara. El registro no sabe -ni tiene que saber- cómo guarda cada clase sus datos: solo le pide `nombre()`.",
        },
        {
          texto: "Depende del orden en que se anoten.",
          porque: "No: la comparación es la misma en los dos sentidos. El orden no cambia si dos nombres son iguales.",
        },
      ],
    },
    {
      pregunta: "¿Qué hace el `?:` en `$a->prioridad() - $b->prioridad() ?: $b->netos() - $a->netos()`?",
      opciones: [
        {
          texto: "Si la primera resta da cero -empatan en prioridad-, pasa a la segunda.",
          correcta: true,
          porque: "Cero no cuenta como cierto, así que `?:` se va a la derecha. Es el único sitio del juego donde `?:` es la herramienta correcta y no `??`: aquí lo que se pregunta es «¿esto es cero?», que es justo lo que `?:` mira.",
        },
        {
          texto: "Suma las dos comparaciones para ordenar por las dos a la vez.",
          porque: "No suma nada: elige una de las dos. Sumarlas daría un número sin sentido, porque las escalas no son comparables.",
        },
        {
          texto: "Devuelve la segunda si la primera es negativa.",
          porque: "Un número negativo cuenta como cierto en PHP, así que con una prioridad menor la primera manda y la segunda no se mira. Solo el cero pasa a la derecha.",
        },
      ],
    },
    {
      pregunta: "¿Por qué `deArray` devuelve `Registrable` y no `self`?",
      opciones: [
        {
          texto: "Porque puede devolver dos clases distintas, y lo único que las dos prometen es el contrato.",
          correcta: true,
          porque: "`self` significa «esta clase», y la fábrica devuelve una `Expedicion` o una `Urgente` según los datos. El tipo tiene que ser lo que las dos cumplen. Y a quien la llama le da igual cuál sea: por eso funciona.",
        },
        {
          texto: "Porque `self` no se puede usar en un método estático.",
          porque: "Se puede, y es lo normal en una fábrica que solo devuelve su propia clase. Aquí no vale por otro motivo.",
        },
        {
          texto: "Porque una interfaz siempre es un tipo de retorno mejor que una clase.",
          porque: "No siempre: si solo hay una clase posible, decir cuál es más informativo. La regla es prometer lo que de verdad se cumple, ni más ni menos.",
        },
      ],
    },
    {
      pregunta: "El informe y `porPrioridad` ordenan igual. ¿Qué se hace con eso?",
      opciones: [
        {
          texto: "Sacar lo que ordena a un método privado que usen los dos.",
          correcta: true,
          porque: "Con el `usort` escrito dos veces, el día que cambie el orden vas a cambiar uno de los dos. Y `private` porque es fontanería: hay un test que comprueba que solo son públicos los seis métodos que se piden.",
        },
        {
          texto: "Que `informe` llame a `porPrioridad` y monte el texto con los nombres.",
          porque: "Casi, y se queda corto: `porPrioridad` devuelve solo los nombres, y el informe necesita también los netos. Haría falta volver a buscar cada objeto por su nombre, que es peor.",
        },
        {
          texto: "Dejarlo: son tres líneas y duplicarlas no hace daño.",
          porque: "Es duplicación de conocimiento -la regla de orden- y no de código. Las dos van a cambiar juntas, así que juntarlas es lo correcto.",
        },
      ],
    },
    {
      pregunta: "Un total que no cuadra con las líneas de un informe. ¿Qué se mira primero?",
      opciones: [
        {
          texto: "Sobre qué lista se cuenta el total y sobre qué lista se pintaron las líneas.",
          correcta: true,
          porque: "Casi siempre son dos listas distintas: una filtrada y otra no. Dos cuentas paralelas se desincronizan solas. La regla que lo evita: contar sobre la misma lista que has pintado.",
        },
        {
          texto: "Si el `array_reduce` tiene el valor de partida correcto.",
          porque: "Es lo segundo que hay que mirar y da otro síntoma: un total desplazado por una cantidad fija, no un total que no tiene nada que ver con las líneas.",
        },
        {
          texto: "Si el `usort` está ordenando bien.",
          porque: "El orden no cambia una suma. Si el total no cuadra, el orden no tiene nada que ver.",
        },
      ],
    },
    {
      pregunta: "Tres clases sin parentesco necesitan el mismo cálculo. ¿Qué forma le das?",
      opciones: [
        {
          texto: "Una interfaz para poder pedirlas en un parámetro, y un rasgo con el cálculo que exija lo que necesita.",
          correcta: true,
          porque: "Cada cosa a lo suyo: la interfaz es la promesa pública -permite escribir una función que reciba cualquiera de las tres- y el rasgo es la manera de cumplirla sin copiar el cálculo. El `abstract` de dentro del rasgo es lo que le permite funcionar sin saber en qué propiedad guarda cada clase su lista.",
        },
        {
          texto: "Una clase madre de la que hereden las tres.",
          porque: "Parentesco inventado para compartir tres líneas. El precio se paga el día que una de las tres necesite algo que las otras no.",
        },
        {
          texto: "Copiarlo en las tres: son tres líneas.",
          porque: "Tres sitios donde arreglar el mismo fallo, y las tres dicen la misma regla, así que van a cambiar juntas. Eso es duplicación de conocimiento, y sí es un problema.",
        },
      ],
    },
    {
      pregunta: "Has terminado la primera era. ¿Qué es lo que sigue sin saber hacer?",
      opciones: [
        {
          texto: "Lo que se aprende trabajando: leer el código de otros, decidir con información incompleta y equivocarte en algo que cueste dinero.",
          correcta: true,
          porque: "Y decirlo no es humildad falsa: es la diferencia entre saber un lenguaje y saber el oficio. Sabes escribir PHP moderno, estructurarlo, defenderlo de los datos y dejarlo legible. Eso es mucho más de lo que sabe la mayoría de quien lleva un año, y no es lo mismo que llevar un año.",
        },
        {
          texto: "Nada importante: con esto ya se puede escribir cualquier programa.",
          porque: "Se puede escribir cualquier programa pequeño, que no es poco. Lo que falta no son piezas del lenguaje: es lo que pasa cuando el programa lo mantienen cuatro personas durante tres años.",
        },
        {
          texto: "Las partes avanzadas de PHP: generadores, fibras, reflexión.",
          porque: "Son piezas y se aprenden en una tarde cuando hacen falta. Lo que cuesta no es aprender una pieza nueva: es decidir cuál hace falta.",
        },
      ],
    },
  ],
}
