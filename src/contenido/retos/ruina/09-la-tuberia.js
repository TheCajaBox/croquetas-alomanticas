import { codigo, pista } from '../comun.js'

export default {
  id: "ruina-09-la-tuberia",
  mundo: "ruina",
  entorno: "php",
  tipo: "codigo",
  titulo: "La tubería entera",
  enunciado: codigo(
    "Objetos y listas a la vez, que es como se trabaja de verdad.",
    "",
    "Te damos la clase `Expedicion` con `nombre()`, `netos()` y `esBuena()`. Escribe tres",
    "funciones que reciban una lista de expediciones:",
    "",
    "- `nombresDeLasBuenas(array $expediciones): array` — los nombres de las que son buenas,",
    "  con las posiciones seguidas.",
    "- `totalDeLasBuenas(array $expediciones): int` — la suma de sus netos.",
    "- `laMejor(array $expediciones): ?Expedicion` — la que más netos trae, o `null` si no hay",
    "  ninguna buena.",
    "",
    "Sin un solo `foreach`.",
  ),
  inicial: codigo(
    "<?php",
    "",
    "class Expedicion",
    "{",
    "    public function __construct(private string $nombre, private int $sacos) {}",
    "",
    "    public function nombre(): string { return $this->nombre; }",
    "    public function netos(): int { return $this->sacos; }",
    "    public function esBuena(): bool { return $this->sacos > 5; }",
    "}",
    "",
    "// Las tres funciones.",
  ),
  solucion: codigo(
    "<?php",
    "",
    "class Expedicion",
    "{",
    "    public function __construct(private string $nombre, private int $sacos) {}",
    "",
    "    public function nombre(): string { return $this->nombre; }",
    "    public function netos(): int { return $this->sacos; }",
    "    public function esBuena(): bool { return $this->sacos > 5; }",
    "}",
    "",
    "function buenas(array $expediciones): array",
    "{",
    "    return array_values(array_filter($expediciones, fn($una) => $una->esBuena()));",
    "}",
    "",
    "function nombresDeLasBuenas(array $expediciones): array",
    "{",
    "    return array_map(fn($una) => $una->nombre(), buenas($expediciones));",
    "}",
    "",
    "function totalDeLasBuenas(array $expediciones): int",
    "{",
    "    return array_reduce(buenas($expediciones), fn($llevado, $una) => $llevado + $una->netos(), 0);",
    "}",
    "",
    "function laMejor(array $expediciones): ?Expedicion",
    "{",
    "    return array_reduce(",
    "        buenas($expediciones),",
    "        fn($mejor, $una) => $mejor === null || $una->netos() > $mejor->netos() ? $una : $mejor,",
    "        null",
    "    );",
    "}",
  ),
  requisitos: [
    { tipo: "prohibePalabra", valor: "foreach", texto: "Sin `foreach`" },
    { tipo: "usaLlamada", valor: "array_filter", texto: "Elige con `array_filter`" },
    { tipo: "usaLlamada", valor: "array_reduce", texto: "Aplasta con `array_reduce`" },
  ],
  tests: [
    {
      nombre: "los nombres de las buenas",
      codigo: codigo(
        "$suyas = [new Expedicion('A', 9), new Expedicion('B', 1), new Expedicion('C', 6)];",
        "esperar(nombresDeLasBuenas($suyas), 'los nombres')->igualA(['A', 'C']);",
      ),
    },
    {
      nombre: "y con las posiciones seguidas",
      codigo: codigo(
        "$suyas = [new Expedicion('A', 1), new Expedicion('B', 9)];",
        "esperar(array_keys(nombresDeLasBuenas($suyas)), 'las claves')->igualA([0]);",
      ),
    },
    {
      nombre: "el total de las buenas",
      codigo: codigo(
        "$suyas = [new Expedicion('A', 9), new Expedicion('B', 1), new Expedicion('C', 6)];",
        "esperar(totalDeLasBuenas($suyas), 'el total')->igualA(15);",
      ),
    },
    {
      nombre: "sin buenas, cero y lista vacía",
      codigo: codigo(
        "$suyas = [new Expedicion('A', 1)];",
        "esperar(totalDeLasBuenas($suyas), 'el total')->igualA(0);",
        "esperar(nombresDeLasBuenas($suyas), 'los nombres')->igualA([]);",
      ),
    },
    {
      nombre: "sin expediciones tampoco revienta",
      codigo: codigo(
        "esperar(totalDeLasBuenas([]), 'el total')->igualA(0);",
        "esperar(nombresDeLasBuenas([]), 'los nombres')->igualA([]);",
        "esperar(laMejor([]), 'la mejor')->igualA(null);",
      ),
    },
    {
      nombre: "la mejor es la que más trae",
      codigo: codigo(
        "$suyas = [new Expedicion('A', 9), new Expedicion('B', 20), new Expedicion('C', 6)];",
        "esperar(laMejor($suyas)->nombre(), 'la mejor')->igualA('B');",
      ),
    },
    {
      nombre: "y con una sola buena, esa",
      codigo: codigo(
        "$suyas = [new Expedicion('A', 1), new Expedicion('B', 6)];",
        "esperar(laMejor($suyas)->nombre(), 'la mejor')->igualA('B');",
      ),
    },
    {
      nombre: "si ninguna es buena, no hay mejor",
      codigo: "esperar(laMejor([new Expedicion('A', 5)]), 'la mejor')->igualA(null);",
    },
    {
      nombre: "seis netos ya es buena y cinco no",
      codigo: codigo(
        "esperar(nombresDeLasBuenas([new Expedicion('A', 6)]), 'los nombres')->igualA(['A']);",
        "esperar(nombresDeLasBuenas([new Expedicion('A', 5)]), 'los nombres')->igualA([]);",
      ),
    },
  ],
  variantes: [
    {
      titulo: "La tubería entera · otra tanda",
      tests: [
        {
          nombre: "cinco expediciones, tres buenas",
          codigo: codigo(
            "$suyas = [new Expedicion('A', 9), new Expedicion('B', 2), new Expedicion('C', 7),",
            "          new Expedicion('D', 1), new Expedicion('E', 8)];",
            "esperar(nombresDeLasBuenas($suyas), 'los nombres')->igualA(['A', 'C', 'E']);",
            "esperar(totalDeLasBuenas($suyas), 'el total')->igualA(24);",
            "esperar(laMejor($suyas)->nombre(), 'la mejor')->igualA('A');",
          ),
        },
        {
          nombre: "dos empatadas: vale cualquiera de las dos",
          codigo: codigo(
            "$suyas = [new Expedicion('A', 9), new Expedicion('B', 9)];",
            "esperar(['A', 'B'], 'la mejor')->contiene(laMejor($suyas)->nombre());",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Las tres empiezan por lo mismo: quedarse con las buenas. Escribe una función `buenas()` y que las tres la llamen.", 0),
    pista("`laMejor` es un `array_reduce` cuyo acumulador es una expedición -o `null` al empezar-. En cada vuelta se queda con la que más traiga.", 1),
    pista("El valor de partida de `laMejor` es `null`, y por eso hay que comprobar `$mejor === null` antes de pedirle sus netos. Sin eso, la primera vuelta revienta.", 2),
  ],
  recompensa: { croquetas: 12 },
}
