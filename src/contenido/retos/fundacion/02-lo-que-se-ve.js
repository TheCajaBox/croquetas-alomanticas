import { codigo, pista } from '../comun.js'

export default {
  id: "fundacion-02-lo-que-se-ve",
  mundo: "fundacion",
  entorno: "php",
  tipo: "eleccion",
  titulo: "Lo que se ve desde fuera",
  enunciado: codigo(
    "Cada propiedad y cada método de una clase decide quién puede tocarlo. `public` lo ve",
    "todo el mundo; `private`, solo la propia clase; `protected`, la clase y las que hereden",
    "de ella.",
    "",
    "Aquí no se escribe: se mira y se decide.",
  ),
  pregunta: codigo(
    "```php",
    "class Cuenta",
    "{",
    "    private int $saldo = 0;",
    "",
    "    public function ingresar(int $cuanto): void",
    "    {",
    "        if ($cuanto > 0) {",
    "            $this->saldo += $cuanto;",
    "        }",
    "    }",
    "",
    "    public function saldo(): int",
    "    {",
    "        return $this->saldo;",
    "    }",
    "}",
    "```",
    "",
    "¿Qué se gana poniendo `$saldo` en `private` en vez de `public`?",
  ),
  opciones: [
    {
      texto:
        "Que el saldo solo se pueda cambiar por la puerta que la clase abre, y esa puerta comprueba que el ingreso sea positivo.",
      correcta: true,
      porque:
        "Eso es todo el asunto, y no va de secretos: va de que **haya un solo sitio** por donde pasa cada cambio. Con `$saldo` público, cualquiera puede escribir `$cuenta->saldo = -500` desde cualquier rincón del programa y la comprobación no se ejecuta. Con `private`, la regla de que un ingreso es positivo vive dentro de la clase y no se puede rodear.",
    },
    {
      texto: "Que el saldo se guarda cifrado y no se puede leer sin permiso.",
      porque:
        "No hay nada cifrado ni escondido de verdad: `private` es una regla del lenguaje mientras compila, no una medida de seguridad. Quien tenga el código puede cambiarla en un segundo. Lo que impide es el descuido, no el ataque.",
    },
    {
      texto: "Que el programa va más rápido, porque PHP no tiene que comprobar el acceso.",
      porque:
        "La diferencia de velocidad es inapreciable y, si acaso, al revés: llamar a un método cuesta un poco más que leer una propiedad. Esto no se decide por velocidad.",
    },
    {
      texto: "Nada: es una costumbre heredada de otros lenguajes y en PHP da igual.",
      porque:
        "La diferencia se nota el día que el saldo sale mal. Con la propiedad pública hay que buscar en todo el programa quién la ha tocado; con `private`, la lista de sospechosos son los métodos de esta clase, y caben en una pantalla.",
    },
  ],
  explicacion: codigo(
    "La regla práctica, que sirve desde el primer día: **empieza todo en `private` y abre solo",
    "lo que haga falta**. Es mucho más fácil abrir después que cerrar: cerrar significa buscar",
    "quién lo estaba usando.",
    "",
    "Y hay una consecuencia que se ve enseguida: si para usar tu clase alguien necesita tocar",
    "seis propiedades en el orden correcto, la clase está mal diseñada. Lo que tiene que ser",
    "público son **las cosas que se hacen** -ingresar, cobrar, resumir-, no los datos con los",
    "que se hacen.",
  ),
  pistas: [
    pista("Fíjate en qué comprueba `ingresar` y pregúntate qué pasaría si alguien pudiera cambiar `$saldo` sin pasar por ahí.", 0),
    pista("`private` no esconde nada de nadie que tenga el código: lo que hace es que el compilador se queje.", 1),
    pista("La pregunta que responde esto es: «cuando el saldo salga mal, ¿dónde tengo que buscar?».", 2),
  ],
  recompensa: { croquetas: 6 },
}
