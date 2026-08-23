import { codigo, pista } from '../comun.js'

export default {
  id: "original-01-lo-que-prueba-una-firma",
  mundo: "original",
  entorno: "worker",
  tipo: "eleccion",
  titulo: "Lo que prueba una firma",
  enunciado: codigo(
    "Un sistema entrega un papel firmado con un secreto que solo él conoce:",
    "",
    "```",
    "{\"usuario\":\"gaotona\",\"rol\":\"arbitrador\",\"caduca\":1717} . 9f2c4a71",
    "```",
    "",
    "El contenido va **a la vista** —cualquiera lo lee— y detrás va la firma. El sistema",
    "recalcula la firma al recibirlo y la compara.",
    "",
    "¿Qué prueba esa firma?",
  ),
  pregunta: "El papel llega de vuelta con la firma correcta. ¿Qué se sabe con seguridad?",
  opciones: [
    {
      texto: "Que el contenido no se ha tocado desde que lo firmó quien tiene el secreto.",
      correcta: true,
      porque:
        "Eso, y solo eso. Se llama **integridad**: el papel es el original. La firma no esconde nada —el contenido se lee sin ningún secreto— y no prueba quién lo trae: prueba que nadie lo ha cambiado. Y hay una tercera cosa que sí prueba: que lo emitió quien tiene el secreto, porque sin el secreto no se puede calcular esa firma.",
    },
    {
      texto: "Que el contenido está cifrado y nadie puede leerlo.",
      correcta: false,
      porque:
        "El contenido está a la vista. Firmar y cifrar son cosas distintas: firmar protege de que **lo cambien**, cifrar protege de que **lo lean**. Confundirlas lleva a meter datos privados en un papel firmado pensando que están escondidos, y es un error muy visto.",
    },
    {
      texto: "Que quien lo trae es el usuario que dice el papel.",
      correcta: false,
      porque:
        "Prueba que el papel es auténtico, no que lo traiga su dueño. Un papel robado tiene la firma perfectamente correcta, y por eso hacen falta las otras defensas del primer mundo: que caduque, que se pueda revocar, que viaje por un canal cifrado.",
    },
    {
      texto: "Que el usuario tiene el rol que pone, ahora mismo.",
      correcta: false,
      porque:
        "Prueba que tenía ese rol **cuando se firmó**. Es el desfase del cuarto mundo con otro envoltorio: un rol dentro de un papel firmado es un permiso copiado, y quitárselo a alguien no le quita nada hasta que el papel caduque. Por eso los papeles firmados llevan poca cosa dentro y caducan pronto.",
    },
  ],
  pistas: [
    pista("Fíjate en que el contenido se lee sin ningún secreto. ¿Qué puede estar protegiendo entonces?", 0),
    pista(
      "Hay dos protecciones distintas y se confunden todo el rato: que no lo lean y que no lo cambien.",
      1,
    ),
    pista(
      "Piensa qué pasa si alguien intenta cambiar el `rol` a «general» y volver a mandar el papel: no puede recalcular la firma, porque no tiene el secreto.",
      2,
    ),
  ],
  recompensa: { croquetas: 4 },
}
