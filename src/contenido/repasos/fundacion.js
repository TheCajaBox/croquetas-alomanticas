/**
 * Las preguntas del repaso de «fundacion».
 *
 * Van en su propio fichero y se piden al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
  id: "repaso-fundacion",
  mundo: "fundacion",
  quien: "brisa",
  titulo: "El caso de la Fundación",
  preguntas: [
    {
      pregunta: "¿Qué imprime esto?\n\n```php\n$uno = new Saco(4);\n$otro = $uno;\n$otro->cuantos = 99;\necho $uno->cuantos;\n```",
      opciones: [
        {
          texto: "99: las dos variables llevan al mismo objeto.",
          correcta: true,
          porque: "Asignar un objeto copia la manija, no el objeto. Es lo contrario de lo que hacen los arrays, y es la diferencia práctica más importante entre los dos. Para copiar de verdad está `clone`, que además copia por encima.",
        },
        {
          texto: "4: `$otro` es una copia, como con los arrays.",
          porque: "Los arrays sí se copian al asignarlos. Los objetos no, y tiene su lógica: un objeto representa una cosa concreta, y si se copiara al pasarlo a una función esa función trabajaría con otra.",
        },
        {
          texto: "Un error: no se puede asignar un objeto a otra variable.",
          porque: "Se puede, y se hace todo el rato. Lo que hay que tener claro es qué se está asignando.",
        },
      ],
    },
    {
      pregunta: "Una clase hija define su propio constructor y no llama a `parent::__construct()`. ¿Qué pasa?",
      opciones: [
        {
          texto: "Las propiedades que rellenaba la madre se quedan sin inicializar.",
          correcta: true,
          porque: "Definir un constructor en la hija sustituye el de la madre; no se ejecutan los dos. Y con propiedades tipadas, leer una sin inicializar lanza un error inmediato -no da `null`-, que al menos es ruidoso. Si la hija no define ninguno, se hereda el de la madre entero.",
        },
        {
          texto: "PHP ejecuta primero el de la madre y luego el de la hija.",
          porque: "Eso hacen otros lenguajes. PHP no: hay que llamarlo a mano, y es la fuente número uno de objetos a medio construir.",
        },
        {
          texto: "PHP avisa al cargar la clase de que falta la llamada.",
          porque: "No avisa. El error aparece más tarde, cuando alguien lee una de esas propiedades, y en otro sitio del código.",
        },
      ],
    },
    {
      pregunta: "¿Por qué una clase hija no puede leer una propiedad `private` de su madre?",
      opciones: [
        {
          texto: "Porque `private` significa «solo esta clase», y una hija es otra clase. Lo que abre la puerta a las hijas es `protected`.",
          correcta: true,
          porque: "Y hay una salida mejor que abrirla: que la hija no toque los datos de la madre y llame a un método suyo -`parent::resumen()`-. Cuanto menos sepa la hija de cómo guarda la madre sus cosas, más se puede cambiar la madre sin romper nada.",
        },
        {
          texto: "Sí puede: `private` solo cierra la puerta al código de fuera de la jerarquía.",
          porque: "Eso es `protected`. `private` es estrictamente esta clase, y sorprende la primera vez justamente por eso.",
        },
        {
          texto: "Porque la propiedad no existe en la hija hasta que se declara otra vez.",
          porque: "Existe: la hija tiene todas las propiedades de la madre. Lo que no tiene es permiso para mirarla.",
        },
      ],
    },
    {
      pregunta: "¿Cuál es la diferencia entre heredar de una clase y cumplir una interfaz?",
      opciones: [
        {
          texto: "Heredar dice «esto es como aquello» y trae código; una interfaz dice «esto sabe hacer aquello» y no trae nada.",
          correcta: true,
          porque: "Y por eso la interfaz es más útil: la promesa es más pequeña. Un carro y un saco no tienen nada que ver y los dos saben decir su total; obligarlos a compartir una madre para eso sería inventarse un parentesco. Se puede heredar de una sola clase y cumplir todas las interfaces que quieras.",
        },
        {
          texto: "Ninguna importante: una interfaz es una clase sin propiedades.",
          porque: "Una interfaz no se puede instanciar, no trae cuerpos de métodos y no guarda datos. Lo que comparte con una clase es que sirve como tipo.",
        },
        {
          texto: "Que la interfaz se comprueba al ejecutar y la herencia al compilar.",
          porque: "Las dos se comprueban al cargar la clase: si falta un método de la interfaz, el error sale ahí, antes de ejecutar nada.",
        },
      ],
    },
    {
      pregunta: "¿Para qué sirve escribir el tipo en `public function guardar(Guardable $cosa): void`?",
      opciones: [
        {
          texto: "Para que PHP no deje entrar nada que no cumpla el contrato, sin escribir ni un `if`.",
          correcta: true,
          porque: "Media comprobación gratis y con un error claro en la puerta. Y además documenta: quien lea la firma sabe qué se puede guardar sin leer el cuerpo.",
        },
        {
          texto: "Solo para documentar: PHP no comprueba los tipos de los parámetros.",
          porque: "Los comprueba, y lanza un `TypeError` si no cuadran. Los comentarios documentan; los tipos documentan y además se cumplen.",
        },
        {
          texto: "Para que el método vaya más rápido al no tener que averiguar el tipo.",
          porque: "La diferencia de velocidad es inapreciable. Esto se hace por corrección, no por rendimiento.",
        },
      ],
    },
    {
      pregunta: "Una propiedad estática pública, `public static int $cuantas`. ¿Qué problema tiene?",
      opciones: [
        {
          texto: "Que es una variable global con otro nombre: cualquiera la cambia desde cualquier sitio y nadie sabe quién.",
          correcta: true,
          porque: "Y en las pruebas se nota antes que en producción: el valor sobrevive de un test al siguiente, así que el orden de los tests empieza a importar. Si de verdad hay que compartir algo, `private static` con un método que lo lea; y antes de eso, preguntarse por qué comparte.",
        },
        {
          texto: "Que se reinicia con cada objeto nuevo.",
          porque: "Al contrario: hay una sola para toda la clase y sobrevive a todos los objetos. Eso es precisamente lo que la hace útil y peligrosa.",
        },
        {
          texto: "Que no se puede leer desde fuera de la clase.",
          porque: "Siendo `public` se lee y se escribe desde cualquier parte con `Clase::$cuantas`. Ese es el problema, no la limitación.",
        },
      ],
    },
    {
      pregunta: "Un avión y un perro necesitan el mismo método `anota()`. ¿Qué se usa?",
      opciones: [
        {
          texto: "Un `trait`: comparte el código sin inventar un parentesco que no existe.",
          correcta: true,
          porque: "Heredar obligaría a una madre común que no significa nada. Un `trait` es código que se pega dentro de la clase con `use`, y puede exigir lo que necesite declarando un método `abstract`. Lo que no es es un tipo: no se puede pedir un `Registra` en un parámetro.",
        },
        {
          texto: "Una clase madre `Anotable` de la que hereden los dos.",
          porque: "Es lo primero que apetece y es un parentesco falso. Un avión no es un tipo de cosa-que-anota; solo resulta que también anota.",
        },
        {
          texto: "Una interfaz con el método `anota()` escrito dentro.",
          porque: "Una interfaz no puede traer el cuerpo del método, y aquí lo que se comparte es justamente el cuerpo. Las dos cosas se usan juntas: la interfaz como promesa pública, el rasgo como forma de cumplirla.",
        },
      ],
    },
    {
      pregunta: "¿Qué tiene de malo que `inventario()` ordene `$this->dentro` con `usort` directamente?",
      opciones: [
        {
          texto: "Que un método que solo consulta acaba cambiando el objeto, y cada llamada lo reordena.",
          correcta: true,
          porque: "`usort` cambia el array que le das. Copiar a una variable local antes de ordenar cuesta una línea. La costumbre general —un método que consulta no cambia nada— evita una familia entera de fallos que se notan tarde y en otro sitio.",
        },
        {
          texto: "Que `usort` no funciona con propiedades, solo con variables locales.",
          porque: "Funciona igual. El problema no es que no pueda: es que puede.",
        },
        {
          texto: "Nada: ordenar la lista por dentro es más eficiente.",
          porque: "Es más eficiente y es incorrecto. Quien llama a `inventario()` no espera que el almacén cambie por preguntarle algo.",
        },
      ],
    },
    {
      pregunta: "`Class \"Cuadrilla\\Saco\" not found`. ¿Qué es lo primero que hay que mirar?",
      opciones: [
        {
          texto: "Si falta el `use`, o si el `namespace` del fichero no coincide con el nombre que estás pidiendo.",
          correcta: true,
          porque: "Casi nunca significa que la clase no exista. Las tres causas, en orden: falta el `use` -y PHP la busca dentro del namespace donde estás-, el apellido no coincide, o el autoload no se ha rehecho. La comprobación que resuelve las tres en un minuto: escribe el nombre completo con la barra delante.",
        },
        {
          texto: "Si falta el `require` del fichero donde está la clase.",
          porque: "En PHP moderno no se escribe ningún `require`: las clases las carga el autoload la primera vez que se mencionan. Si hay que escribir requires a mano, algo más está mal.",
        },
        {
          texto: "Si la clase tiene el constructor mal escrito.",
          porque: "El error habría sido otro. `not found` es literal: PHP no ha encontrado el fichero donde vive esa clase con ese nombre.",
        },
      ],
    },
  ],
}
