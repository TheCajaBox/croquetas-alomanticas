import { codigo, pista } from '../comun.js'

export default {
  id: "sello-03-seis-frases-sobre-huellas",
  mundo: "sello",
  entorno: "worker",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre huellas",
  enunciado: codigo(
    "Seis frases sobre los hashes. Unas son verdad y otras son lo que se repite por ahí sin",
    "haberlo comprobado nunca. Marca cada una.",
  ),
  afirmaciones: [
    {
      texto: "Del hash de una contraseña no se puede sacar la contraseña.",
      verdadera: true,
      porque:
        "No se puede **deshacer**: la operación va en un sentido. Lo que sí se puede es adivinar, probando contraseñas y comparando el resultado. Eso no es sacar el hash del revés, es fuerza bruta, y contra eso protege la lentitud y no el hash.",
    },
    {
      texto: "Dos contraseñas distintas nunca dan el mismo hash.",
      verdadera: false,
      porque:
        "Hay infinitas contraseñas posibles y una cantidad finita de hashes, así que **por fuerza** hay repeticiones: se llaman colisiones. En un hash bueno son tan raras que nadie las encuentra por casualidad, pero «raro» no es «nunca», y la diferencia importa cuando alguien las busca a propósito.",
    },
    {
      texto: "La misma contraseña da siempre el mismo hash.",
      verdadera: true,
      porque:
        "Y es lo que lo hace útil: por eso puedes comprobar una contraseña sin haberla guardado. Vuelves a hacer la cuenta y comparas los resultados. También es lo que lo hace peligroso sin sal, que es lo siguiente que vas a ver.",
    },
    {
      texto: "Un hash cifra la contraseña.",
      verdadera: false,
      porque:
        "Cifrar y hashear son cosas distintas y se confunden todo el rato. Lo cifrado se descifra —para eso se cifra: para recuperarlo—. El hash no vuelve. Si alguien te dice que ha «cifrado» las contraseñas, pregúntale con qué llave y dónde está esa llave.",
    },
    {
      texto: "Un hash lento es lento por estar mal programado.",
      verdadera: false,
      porque:
        "Es lento **a propósito** y es su virtud entera. Tú comprobarás una contraseña por inicio de sesión y no notarás un décimo de segundo; quien roba la tabla tiene que probar millones, y ahí un décimo de segundo por prueba es la diferencia entre una tarde y un siglo.",
    },
    {
      texto: "Si la contraseña es larga y rara, da igual cómo se guarde.",
      verdadera: false,
      porque:
        "Da igual para el que la adivina probando, no para el que se lleva la tabla. Guardada en texto claro, la contraseña más larga del mundo está tan robada como `1234`. Lo largo protege del que adivina; lo bien guardado protege del que entra.",
    },
  ],
  pistas: [
    pista("Dos de las seis son verdad. Las otras cuatro son cosas que suenan bien.", 0),
    pista(
      "Tres de las falsas se caen con la misma pregunta: ¿esto se puede deshacer o no?",
      1,
    ),
    pista(
      "La de las colisiones se decide contando: hay infinitas contraseñas y un número limitado de firmas posibles. Con eso ya está.",
      2,
    ),
  ],
  recompensa: { croquetas: 5 },
}
