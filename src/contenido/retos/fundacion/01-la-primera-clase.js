import { codigo, pista } from '../comun.js'

export default {
  id: "fundacion-01-la-primera-clase",
  mundo: "fundacion",
  entorno: "php",
  tipo: "codigo",
  titulo: "La primera clase",
  enunciado: codigo(
    "Una clase es un **molde**: dice qué datos tiene una cosa y qué sabe hacer. Con el molde",
    "se fabrican objetos, y cada objeto tiene sus propios datos.",
    "",
    "```php",
    "class Saco",
    "{",
    "    public function __construct(public string $metal, public int $cuantos) {}",
    "}",
    "",
    "$uno = new Saco('acero', 4);",
    "echo $uno->metal;   // acero",
    "```",
    "",
    "`__construct` es lo que se ejecuta al hacer `new`. Poner `public` delante de un",
    "parámetro lo convierte además en una propiedad del objeto: es un atajo de PHP 8 y se usa",
    "siempre.",
    "",
    "Escribe la clase `Expedicion` con:",
    "",
    "- propiedades públicas `nombre` (texto) y `sacos` (entero), puestas en el constructor;",
    "- un método `resumen(): string` que devuelva `'Fadrex: 12 sacos'`;",
    "- un método `esBuena(): bool` que devuelva cierto si trae más de cinco sacos.",
  ),
  inicial: codigo(
    "<?php",
    "",
    "class Expedicion",
    "{",
    "    // El constructor con los dos parámetros públicos.",
    "",
    "    // Y los dos métodos. Dentro de un método, el objeto es `$this`.",
    "}",
  ),
  solucion: codigo(
    "<?php",
    "",
    "class Expedicion",
    "{",
    "    public function __construct(public string $nombre, public int $sacos) {}",
    "",
    "    public function resumen(): string",
    "    {",
    "        return $this->nombre . ': ' . $this->sacos . ' sacos';",
    "    }",
    "",
    "    public function esBuena(): bool",
    "    {",
    "        return $this->sacos > 5;",
    "    }",
    "}",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "class", texto: "Escribe una clase" },
    { tipo: "usaPalabra", valor: "__construct", texto: "Recibe los datos en el constructor" },
    { tipo: "usaPalabra", valor: "$this", texto: "Los métodos usan `$this` para llegar a sus datos" },
  ],
  tests: [
    {
      nombre: "guarda lo que le das",
      codigo: codigo(
        "$una = new Expedicion('Fadrex', 12);",
        "esperar($una->nombre, 'el nombre')->igualA('Fadrex');",
        "esperar($una->sacos, 'los sacos')->igualA(12);",
      ),
    },
    {
      nombre: "el resumen sale con su formato",
      codigo: codigo(
        "esperar((new Expedicion('Fadrex', 12))->resumen(), 'el resumen')->igualA('Fadrex: 12 sacos');",
      ),
    },
    {
      nombre: "seis sacos ya es buena",
      codigo: "esperar((new Expedicion('Urteau', 6))->esBuena(), 'esBuena')->esVerdadero();",
    },
    {
      nombre: "cinco no",
      codigo: "esperar((new Expedicion('Urteau', 5))->esBuena(), 'esBuena')->esFalso();",
    },
    {
      nombre: "y cero tampoco",
      codigo: "esperar((new Expedicion('Vacía', 0))->esBuena(), 'esBuena')->esFalso();",
    },
    {
      nombre: "dos objetos no comparten sus datos, que es la idea entera",
      codigo: codigo(
        "$una = new Expedicion('A', 1);",
        "$otra = new Expedicion('B', 99);",
        "esperar($una->sacos, 'los sacos de la primera')->igualA(1);",
        "esperar($otra->sacos, 'los sacos de la segunda')->igualA(99);",
      ),
    },
    {
      nombre: "el resumen de otra dice lo de otra",
      codigo: "esperar((new Expedicion('Luthadel', 1))->resumen(), 'el resumen')->igualA('Luthadel: 1 sacos');",
    },
  ],
  variantes: [
    {
      titulo: "La primera clase · otra tanda",
      tests: [
        {
          nombre: "una expedición con nombre largo",
          codigo: "esperar((new Expedicion('El Pozo de la Ascensión', 3))->resumen(), 'el resumen')->contiene('Ascensión: 3');",
        },
        { nombre: "cien sacos es buena", codigo: "esperar((new Expedicion('X', 100))->esBuena(), 'esBuena')->esVerdadero();" },
        { nombre: "y en negativo no", codigo: "esperar((new Expedicion('X', -3))->esBuena(), 'esBuena')->esFalso();" },
        {
          nombre: "tres objetos, tres juegos de datos",
          codigo: codigo(
            "$tres = [new Expedicion('A', 1), new Expedicion('B', 2), new Expedicion('C', 3)];",
            "esperar(array_map(fn($u) => $u->sacos, $tres), 'los sacos')->igualA([1, 2, 3]);",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("El constructor se llama `__construct`, con dos guiones bajos delante, y va dentro de la clase.", 0),
    pista("Dentro de un método, el objeto en el que estás se llama `$this`, y a sus datos se llega con una flecha: `$this->nombre`.", 1),
    pista("Poner `public` delante de cada parámetro del constructor crea la propiedad y la rellena. El cuerpo del constructor puede quedarse vacío: `{}`.", 2),
  ],
  recompensa: { croquetas: 9 },
}
