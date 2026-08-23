import { codigo, pista } from '../comun.js'

export default {
  id: "inspeccion-02-la-lista-de-lo-que-vale",
  mundo: "inspeccion",
  entorno: "worker",
  tipo: "codigo",
  titulo: "La lista de lo que vale",
  enunciado: codigo(
    "`nombreDeArchivoValido` decide qué nombres de fichero acepta el sistema. Está escrita",
    "como una **lista de lo que se prohíbe**: si no aparece nada de la lista, pasa.",
    "",
    "Y esa lista siempre está incompleta. Siempre. Lo que le falta hoy es lo que va a usar",
    "quien venga a entrar.",
    "",
    "Reescríbela como una **lista de lo que se permite**: solo letras minúsculas sin tilde,",
    "números, guion, guion bajo y un punto, entre 1 y 40 caracteres. Todo lo demás, fuera.",
    "",
    "Nada de bucles: esto es una expresión regular de una línea.",
  ),
  inicial: codigo(
    "const PROHIBIDOS = ['..', '/', '\\\\\\\\']",
    "",
    "function nombreDeArchivoValido(nombre) {",
    "  for (const malo of PROHIBIDOS) {",
    "    if (nombre.includes(malo)) return false",
    "  }",
    "  return nombre.length > 0",
    "}",
  ),
  solucion: codigo(
    "const PERMITIDO = /^[a-z0-9._-]{1,40}$/",
    "",
    "function nombreDeArchivoValido(nombre) {",
    "  return PERMITIDO.test(nombre)",
    "}",
  ),
  requisitos: [
    { tipo: "prohibeBucles", texto: "Sin bucles: esto es una sola expresión regular" },
    { tipo: "usaLlamada", valor: "test", texto: "La comprobación se hace con `test` de una expresión regular" },
  ],
  tests: [
    { nombre: "un nombre normal pasa", codigo: "esperar(nombreDeArchivoValido('informe-2024.txt'), 'informe-2024.txt').esVerdadero()" },
    { nombre: "y otro con guion bajo, también", codigo: "esperar(nombreDeArchivoValido('mi_nota.md'), 'mi_nota.md').esVerdadero()" },
    { nombre: "el vacío no", codigo: "esperar(nombreDeArchivoValido(''), 'el vacío').esFalso()" },
    {
      nombre: "el ataque que la lista de prohibidos ya paraba: subir un directorio",
      codigo: "esperar(nombreDeArchivoValido('../secreto'), '../secreto').esFalso()",
    },
    {
      nombre: "el ataque que no paraba: la barra invertida de Windows",
      codigo: "esperar(nombreDeArchivoValido('..\\\\\\\\secreto'), 'la barra invertida').esFalso()",
    },
    {
      nombre: "el ataque que tampoco paraba: el punto y coma de una orden",
      codigo: "esperar(nombreDeArchivoValido('nota.txt; rm -rf'), 'con punto y coma').esFalso()",
    },
    {
      nombre: "ni el byte nulo, que corta la cadena en muchos sistemas",
      codigo: "esperar(nombreDeArchivoValido('nota.txt\\\\u0000.jpg'), 'con byte nulo').esFalso()",
    },
    {
      nombre: "ni un nombre con espacios y comillas",
      codigo: "esperar(nombreDeArchivoValido('mi \"nota\".txt'), 'con comillas').esFalso()",
    },
    {
      nombre: "ni un nombre absurdamente largo",
      codigo: "esperar(nombreDeArchivoValido('a'.repeat(300)), 'trescientas letras').esFalso()",
    },
    {
      nombre: "ni mayúsculas, que en unos sistemas de ficheros son otra cosa y en otros la misma",
      codigo: "esperar(nombreDeArchivoValido('Informe.TXT'), 'con mayúsculas').esFalso()",
    },
  ],
  variantes: [
    {
      titulo: "La lista de lo que vale · otra tanda",
      tests: [
        { nombre: "un nombre de una sola letra pasa", codigo: "esperar(nombreDeArchivoValido('a'), 'una letra').esVerdadero()" },
        { nombre: "cuarenta caracteres pasan", codigo: "esperar(nombreDeArchivoValido('a'.repeat(40)), 'cuarenta').esVerdadero()" },
        { nombre: "cuarenta y uno, no", codigo: "esperar(nombreDeArchivoValido('a'.repeat(41)), 'cuarenta y uno').esFalso()" },
        {
          nombre: "el ataque del salto de línea, que cuela cabeceras en un protocolo",
          codigo: "esperar(nombreDeArchivoValido('nota\\\\ntxt'), 'con salto de línea').esFalso()",
        },
        {
          nombre: "el ataque de la ruta absoluta",
          codigo: "esperar(nombreDeArchivoValido('/etc/passwd'), 'ruta absoluta').esFalso()",
        },
        {
          nombre: "ni una tilde, aunque parezca inofensiva",
          codigo: "esperar(nombreDeArchivoValido('canción.txt'), 'con tilde').esFalso()",
        },
      ],
    },
  ],
  pistas: [
    pista("Se borra todo lo que hay y se escribe otra cosa. La lista de prohibidos no se arregla: se tira.", 0),
    pista(
      "Una expresión regular anclada por los dos lados —principio y fin— y con las clases de caracteres que sí valen dentro.",
      1,
    ),
    pista(
      "Los corchetes llevan las cuatro cosas permitidas, y las llaves detrás dicen cuántas veces. El guion va al final de los corchetes o no significa lo que crees.",
      2,
    ),
  ],
  recompensa: { croquetas: 6 },
}
