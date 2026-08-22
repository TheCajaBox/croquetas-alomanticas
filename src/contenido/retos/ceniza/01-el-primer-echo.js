import { codigo, pista } from '../comun.js'

export default {
  id: "ceniza-01-el-primer-echo",
  mundo: "ceniza",
  entorno: "php",
  tipo: "codigo",
  titulo: "Lo primero que se dice",
  enunciado: codigo(
    "Un fichero de PHP empieza con `<?php` y a partir de ahí todo lo que escribas es código.",
    "",
    "Imprime **exactamente** estas dos líneas:",
    "",
    "```",
    "Los Pozos de Hathsin",
    "Trece cuadrillas",
    "```",
    "",
    "Se imprime con `echo`, y cada instrucción acaba en punto y coma. Para que salgan en dos",
    "líneas hace falta un salto de línea: `PHP_EOL`.",
  ),
  inicial: codigo(
    "<?php",
    "",
    "// Dos echo, o uno con un salto de línea en medio. Tú eliges.",
  ),
  solucion: codigo(
    "<?php",
    "",
    "echo 'Los Pozos de Hathsin' . PHP_EOL;",
    "echo 'Trece cuadrillas' . PHP_EOL;",
  ),
  tests: [
    {
      nombre: "imprime las dos líneas, y en ese orden",
      codigo: "esperar($consola, 'lo que has impreso')->diceLoMismoQue(\"Los Pozos de Hathsin\\nTrece cuadrillas\");",
    },
  ],
  pistas: [
    pista("`echo 'algo';` imprime algo. Y sí, el punto y coma hace falta.", 0),
    pista("Para juntar dos textos se usa un punto: `'hola' . 'adiós'`. Con `PHP_EOL` al final de cada línea se separan.", 1),
    pista("Necesitas dos instrucciones, cada una con su `echo`, su texto, su `PHP_EOL` pegado con un punto y su punto y coma. La segunda es igual que la primera cambiando el texto.", 2),
  ],
  recompensa: { croquetas: 4 },
}
