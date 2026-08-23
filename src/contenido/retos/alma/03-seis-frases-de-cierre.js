import { codigo, pista } from '../comun.js'

export default {
  id: "alma-03-seis-frases-de-cierre",
  mundo: "alma",
  entorno: "worker",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases de cierre",
  enunciado: codigo(
    "Seis frases sobre el oficio, no sobre una técnica. Las cuatro falsas son las que más se",
    "oyen al final de un proyecto.",
  ),
  afirmaciones: [
    {
      texto: "La mayoría de los agujeros están en las costuras entre dos defensas, no dentro de una.",
      verdadera: true,
      porque:
        "Los cuatro retos de este camino que no tenían ningún error son los cuatro de este tipo: el registro que apuntaba la clave, la validación que aprobaba una variable y usaba otra, el permiso comprobado sobre un dueño declarado, el papel descodificado y nunca verificado. Cada pieza bien y la unión mal.",
    },
    {
      texto: "Un sistema que ha pasado una auditoría está seguro.",
      verdadera: false,
      porque:
        "Está seguro **contra lo que se miró, el día que se miró**. Una auditoría es una foto: no cubre el código que se escribió después, ni la dependencia que se actualizó la semana pasada, ni el agujero que no estaba en su lista. Es valiosa y no es un certificado.",
    },
    {
      texto: "Si no se ha explotado nunca, es que no es explotable.",
      verdadera: false,
      porque:
        "Es que no te has enterado. La mayoría de las intrusiones se descubren meses después, y muchas las descubre un tercero. «No hemos tenido incidentes» y «no hemos detectado incidentes» son dos frases distintas, y casi siempre se dice la primera queriendo decir la segunda.",
    },
    {
      texto: "Añadir defensas siempre mejora la seguridad.",
      verdadera: false,
      porque:
        "Cada defensa añade una costura, y las costuras son donde están los agujeros. Una validación de más que aprueba un valor distinto del que se usa **crea** un problema. La seguridad no se mide en número de comprobaciones: se mide en si el camino del dato está claro de principio a fin.",
    },
    {
      texto: "Lo que no se puede comprobar con un test no está protegido de verdad.",
      verdadera: true,
      porque:
        "No porque un test lo arregle, sino porque una defensa que nadie comprueba se rompe en el siguiente cambio y nadie se entera. Todos los retos de este camino traen tests que son el ataque, y varios comprueban **la forma** del código y no el resultado: hay agujeros que se pueden tapar de manera que los tests de resultado no distinguen.",
    },
    {
      texto: "Contra un atacante con recursos ilimitados no hay nada que hacer, así que da igual.",
      verdadera: false,
      porque:
        "Es la frase que justifica no hacer nada, y confunde dos cosas. Nadie tiene recursos ilimitados: todo esto consiste en **hacer que atacarte cueste más de lo que vale**. El hash lento, la ventana de intentos, la caducidad corta: ninguno hace imposible el ataque; todos lo encarecen. Y la mayoría de los ataques no los hace nadie con recursos: los hace un programa probando lo de siempre.",
    },
  ],
  pistas: [
    pista("Dos son verdad. Las cuatro falsas son excusas para no seguir mirando.", 0),
    pista(
      "Dos de las falsas confunden «no lo sabemos» con «no pasa»: una con las auditorías y otra con los incidentes.",
      1,
    ),
    pista(
      "La de añadir defensas es la que suena mejor y es la más peligrosa de creerse: cada defensa nueva es una unión nueva, y las uniones son donde se rompe.",
      2,
    ),
  ],
  recompensa: { croquetas: 5 },
}
