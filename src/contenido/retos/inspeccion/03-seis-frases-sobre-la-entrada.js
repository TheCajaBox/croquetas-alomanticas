import { codigo, pista } from '../comun.js'

export default {
  id: "inspeccion-03-seis-frases-sobre-la-entrada",
  mundo: "inspeccion",
  entorno: "worker",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre lo que llega de fuera",
  enunciado: codigo(
    "Seis frases sobre validar. Cuatro son cosas que se dicen mucho en las revisiones de",
    "código y no aguantan un examen. Marca cada una.",
  ),
  afirmaciones: [
    {
      texto: "Todo lo que llega del cliente hay que comprobarlo en el servidor, aunque el cliente ya lo comprobara.",
      verdadera: true,
      porque:
        "La comprobación del cliente es una cortesía: avisa al usuario antes de que pierda el tiempo. La del servidor es la que decide, porque es la única que se ejecuta en un ordenador que controlas tú. Las dos hacen falta y no son la misma cosa.",
    },
    {
      texto: "Una lista de lo que se prohíbe protege igual que una lista de lo que se permite, si está bien hecha.",
      verdadera: false,
      porque:
        "No puede estarlo. La lista de prohibidos tiene que enumerar todo lo malo que existe **y todo lo malo que se inventará**; la de permitidos enumera lo poco que tu programa necesita, y eso cabe. La diferencia es que una lista incompleta de permitidos rechaza algo válido —molesta— y una lista incompleta de prohibidos deja pasar un ataque.",
    },
    {
      texto: "Escapar un texto lo deja seguro para cualquier sitio donde se ponga.",
      verdadera: false,
      porque:
        "Escapar depende del **destino**. Lo que es seguro dentro de un párrafo de HTML es un agujero dentro de un atributo sin comillas, y lo que vale para HTML no vale para una URL, ni para JavaScript, ni para SQL. No existe «escapar» a secas: existe escapar *para* algo.",
    },
    {
      texto: "Validar y escapar son lo mismo con dos nombres.",
      verdadera: false,
      porque:
        "Validar es **decidir si algo entra**: se hace una vez, al recibirlo, y la respuesta es sí o no. Escapar es **preparar algo para un destino**: se hace cada vez que se escribe, y la respuesta es un texto transformado. Un dato válido hay que escaparlo igual, porque «Fernández & hijos» es un nombre perfectamente válido y en HTML hay que escribirlo de otra manera.",
    },
    {
      texto: "Si el dato viene de tu propia base de datos, ya no hace falta escaparlo.",
      verdadera: false,
      porque:
        "Ahí entró desde fuera en algún momento. Se llama XSS almacenado y es el peor de los tres tipos: el ataque se guarda una vez y se sirve a todo el que entre, durante años. Confiar en la base de datos es confiar en todo lo que alguna vez pasó por ella.",
    },
    {
      texto: "Un dato puede ser válido y aun así no poder escribirse tal cual en una página.",
      verdadera: true,
      porque:
        "Es el caso normal, no la excepción. `<script>` no es un nombre válido y `Muñoz & Cía. \"El Yunque\"` sí lo es, y los dos hay que escaparlos para meterlos en HTML. Validar no exime de escapar, y esta es la confusión que hace que la gente escriba validaciones cada vez más paranoicas en vez de escapar en el sitio correcto.",
    },
  ],
  pistas: [
    pista("Dos son verdad. Las cuatro falsas dicen, de cuatro maneras, que una comprobación te ahorra otra.", 0),
    pista(
      "Dos de las falsas confunden validar con escapar. Son operaciones distintas: una decide y la otra transforma.",
      1,
    ),
    pista(
      "La de la base de datos es la más peligrosa de creerse, porque el dato que hay dentro entró desde fuera algún día.",
      2,
    ),
  ],
  recompensa: { croquetas: 5 },
}
