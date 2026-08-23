import { codigo, pista } from '../comun.js'

export default {
  id: "sello-05-la-sal",
  mundo: "sello",
  entorno: "worker",
  tipo: "codigo",
  titulo: "La sal",
  enunciado: codigo(
    "`registrar` ya hashea. Y tiene un problema que no se ve mirándola de una en una: dos",
    "personas con la misma contraseña quedan guardadas con **la misma huella**. Quien se lleve",
    "la tabla no necesita adivinar mil contraseñas: adivina una y entra en todas las cuentas",
    "que la compartían. Y las contraseñas más usadas están adivinadas desde hace años, en",
    "tablas hechas.",
    "",
    "La solución es la **sal**: un texto distinto para cada cuenta que se mezcla con la",
    "contraseña antes de hashear. No es un secreto —se guarda al lado de la huella— y no hace",
    "falta que lo sea: su trabajo es que dos huellas iguales dejen de ser iguales.",
    "",
    "Tienes `salNueva()` dada. Cambia `registrar` para que:",
    "",
    "- pida una sal nueva y la guarde en `sal`;",
    "- calcule la huella con `hashLento(sal + ':' + clave, 1000)`.",
  ),
  inicial: codigo(
    "// Dado. No lo toques.",
    "function hashRapido(texto) {",
    "  const n = [...texto].reduce((cuenta, letra) => (cuenta * 31 + letra.codePointAt(0)) % 1000000007, 7)",
    "  return n.toString(16).padStart(8, '0')",
    "}",
    "",
    "function hashLento(texto, vueltas) {",
    "  let firma = texto",
    "  for (let i = 0; i < vueltas; i += 1) firma = hashRapido(firma + ':' + i)",
    "  return firma",
    "}",
    "",
    "let cuantasSales = 0",
    "function salNueva() {",
    "  cuantasSales += 1",
    "  return 'sal' + cuantasSales + hashRapido('semilla' + cuantasSales)",
    "}",
    "",
    "// Tu parte.",
    "function registrar(usuario, clave) {",
    "  return { usuario, huella: hashLento(clave, 1000) }",
    "}",
  ),
  solucion: codigo(
    "// Dado. No lo toques.",
    "function hashRapido(texto) {",
    "  const n = [...texto].reduce((cuenta, letra) => (cuenta * 31 + letra.codePointAt(0)) % 1000000007, 7)",
    "  return n.toString(16).padStart(8, '0')",
    "}",
    "",
    "function hashLento(texto, vueltas) {",
    "  let firma = texto",
    "  for (let i = 0; i < vueltas; i += 1) firma = hashRapido(firma + ':' + i)",
    "  return firma",
    "}",
    "",
    "let cuantasSales = 0",
    "function salNueva() {",
    "  cuantasSales += 1",
    "  return 'sal' + cuantasSales + hashRapido('semilla' + cuantasSales)",
    "}",
    "",
    "// Tu parte.",
    "function registrar(usuario, clave) {",
    "  const sal = salNueva()",
    "  return { usuario, sal, huella: hashLento(sal + ':' + clave, 1000) }",
    "}",
  ),
  requisitos: [
    { tipo: "usaLlamada", valor: "salNueva", texto: "Cada cuenta pide su propia sal" },
    { tipo: "usaLlamada", valor: "hashLento", texto: "La huella sigue saliendo del hash lento" },
    { tipo: "usaPropiedad", valor: "sal", texto: "La sal se guarda: sin ella no se puede comprobar nada después" },
  ],
  tests: [
    {
      nombre: "dos cuentas con la misma contraseña ya no comparten huella",
      codigo:
        "esperar(registrar('shai', 'abeja14').huella, 'la huella').noEsIgualA(registrar('gaotona', 'abeja14').huella)",
    },
    {
      nombre: "y tampoco comparten sal",
      codigo: "esperar(registrar('shai', 'abeja14').sal, 'la sal').noEsIgualA(registrar('gaotona', 'abeja14').sal)",
    },
    {
      nombre: "la sal se guarda en la ficha, que hace falta para comprobar después",
      codigo: "esperar(registrar('shai', 'abeja14').sal, 'la sal').esDeTipo('string')",
    },
    {
      nombre: "la contraseña sigue sin aparecer",
      codigo: "esperar(JSON.stringify(registrar('shai', 'abeja14')), 'la ficha').noContiene('abeja14')",
    },
    {
      nombre: "la huella se puede recalcular con la sal guardada",
      codigo: codigo(
        "const ficha = registrar('shai', 'abeja14')",
        "esperar(hashLento(ficha.sal + ':' + 'abeja14', 1000), 'la huella recalculada').igualA(ficha.huella)",
      ),
    },
    {
      nombre: "y no se recalcula con otra contraseña",
      codigo: codigo(
        "const ficha = registrar('shai', 'abeja14')",
        "esperar(hashLento(ficha.sal + ':' + 'abeja15', 1000), 'la huella de otra clave').noEsIgualA(ficha.huella)",
      ),
    },
    {
      nombre: "ni con la sal de otra cuenta",
      codigo: codigo(
        "const una = registrar('shai', 'abeja14')",
        "const otra = registrar('gaotona', 'abeja14')",
        "esperar(hashLento(otra.sal + ':' + 'abeja14', 1000), 'con la sal ajena').noEsIgualA(una.huella)",
      ),
    },
  ],
  variantes: [
    {
      titulo: "La sal · otra tanda",
      tests: [
        {
          nombre: "tres cuentas con la misma clave dan tres huellas distintas",
          codigo: codigo(
            "const huellas = ['a', 'b', 'c'].map((quien) => registrar(quien, 'lamisma').huella)",
            "esperar(new Set(huellas).size, 'huellas distintas').igualA(3)",
          ),
        },
        {
          nombre: "la sal no es la contraseña disfrazada",
          codigo: "esperar(registrar('shai', 'abeja14').sal, 'la sal').noContiene('abeja14')",
        },
        {
          nombre: "con la clave vacía también hay sal",
          codigo: "esperar(registrar('nadie', '').sal, 'la sal').esDeTipo('string')",
        },
        {
          nombre: "y la huella de la clave vacía tampoco se repite entre cuentas",
          codigo: "esperar(registrar('a', '').huella, 'la huella').noEsIgualA(registrar('b', '').huella)",
        },
      ],
    },
  ],
  pistas: [
    pista("La sal hay que pedirla, guardarla y usarla. Tres cosas, y en ese orden.", 0),
    pista(
      "Guárdala en una constante antes de hashear: la necesitas dos veces, una para la ficha y otra para el hash.",
      1,
    ),
    pista(
      "El orden es: pedir la sal a una constante, ponerla en la ficha con ese nombre, y pasarla al hash pegada a la clave con dos puntos en medio. Tres usos de la misma constante en tres líneas seguidas.",
      2,
    ),
  ],
  recompensa: { croquetas: 6 },
}
