import { codigo, pista } from '../comun.js'

export default {
  id: "ceniza-04-las-comillas",
  mundo: "ceniza",
  entorno: "php",
  tipo: "eleccion",
  titulo: "Las dos comillas",
  enunciado: codigo(
    "Acabas de verlo funcionando: las comillas dobles miran dentro del texto y las simples no.",
    "Ahora hay que tenerlo claro, porque de aquí sale un fallo que se arrastra durante años.",
    "",
    "Aquí no se escribe: se elige.",
  ),
  pregunta: codigo(
    "```php",
    "$quien = 'Vin';",
    "",
    "echo 'Hola, $quien';",
    "```",
    "",
    "¿Qué imprime esto?",
  ),
  opciones: [
    {
      texto: "`Hola, $quien` — el dólar y el nombre de la variable, tal cual están escritos.",
      correcta: true,
      porque:
        "Eso es. Entre comillas simples PHP no interpreta nada: lo que hay dentro sale letra por letra, dólar incluido. Para que sustituyera haría falta `\"Hola, $quien\"` con dobles.",
    },
    {
      texto: "`Hola, Vin` — PHP sustituye la variable igual que con las dobles.",
      porque:
        "Es lo que casi todo el mundo espera el primer día, y es el fallo del que hablábamos. Las simples no sustituyen: para eso son las dobles.",
    },
    {
      texto: "Un error, porque `$quien` no se puede meter dentro de un texto.",
      porque:
        "Sí se puede, y de dos maneras: con comillas dobles (`\"Hola, $quien\"`) o pegándolo con un punto (`'Hola, ' . $quien`). Aquí no hay error de ningún tipo: hay un texto que sale literal.",
    },
    {
      texto: "`Hola, ` y nada más, porque la variable no se ve dentro de las comillas.",
      porque:
        "No desaparece nada. Todo lo que está entre las comillas se imprime, y ahí dentro está escrito `$quien`, así que se imprime `$quien`.",
    },
  ],
  pistas: [
    pista("Mira qué comillas son. Hay dos clases y hacen cosas distintas.", 0),
    pista("Con comillas simples PHP no entra a mirar el contenido. Ni variables, ni saltos de línea, ni nada.", 1),
    pista("Sale exactamente lo que está escrito entre las comillas, carácter por carácter.", 2),
  ],
  recompensa: { croquetas: 4 },
}
