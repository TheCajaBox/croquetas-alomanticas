import { codigo, pista } from '../comun.js'

export default {
  id: "sello-02-la-prueba-de-que-sabias",
  mundo: "sello",
  entorno: "worker",
  tipo: "codigo",
  titulo: "La prueba de que la sabías",
  enunciado: codigo(
    "Arriba tienes dos funciones ya escritas que **no hay que tocar**: `hashRapido`, que",
    "revuelve un texto y devuelve una firma corta, y `hashLento`, que hace eso mismo muchas",
    "veces seguidas para que cueste tiempo.",
    "",
    "`registrar` funciona: da de alta a alguien y devuelve su ficha. Y guarda la contraseña",
    "tal cual.",
    "",
    "Cámbiala para que guarde **el hash lento** de la contraseña en `huella`, y para que la",
    "contraseña no aparezca por ninguna parte de la ficha.",
    "",
    "Usa 1000 vueltas, y llama a `hashLento` y no a `hashRapido`: la parte lenta es la que\n     protege.",
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
    "// Tu parte.",
    "function registrar(usuario, clave) {",
    "  return { usuario, huella: clave }",
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
    "// Tu parte.",
    "function registrar(usuario, clave) {",
    "  return { usuario, huella: hashLento(clave, 1000) }",
    "}",
  ),
  requisitos: [
    {
      tipo: "usaLlamada",
      valor: "hashLento",
      texto: "La huella sale de `hashLento`, no de `hashRapido`: la parte lenta es la que protege",
    },
  ],
  tests: [
    {
      nombre: "la ficha ya no lleva la contraseña dentro",
      codigo: "esperar(registrar('shai', 'abeja14').huella, 'la huella').noEsIgualA('abeja14')",
    },
    {
      nombre: "el ataque: la tabla robada no lleva la contraseña en ninguna parte",
      codigo: "esperar(JSON.stringify(registrar('shai', 'abeja14')), 'la ficha entera').noContiene('abeja14')",
    },
    {
      nombre: "el nombre de usuario sí se guarda, que hace falta",
      codigo: "esperar(registrar('shai', 'abeja14').usuario, 'el usuario').igualA('shai')",
    },
    {
      nombre: "la misma contraseña da siempre la misma huella",
      codigo:
        "esperar(registrar('shai', 'abeja14').huella, 'la huella').igualA(registrar('gaotona', 'abeja14').huella)",
    },
    {
      nombre: "y dos contraseñas distintas dan huellas distintas",
      codigo:
        "esperar(registrar('shai', 'abeja14').huella, 'la huella').noEsIgualA(registrar('shai', 'abeja15').huella)",
    },
    {
      nombre: "la huella se puede guardar como texto",
      codigo: "esperar(registrar('shai', 'abeja14').huella, 'la huella').esDeTipo('string')",
    },
  ],
  variantes: [
    {
      titulo: "La prueba de que la sabías · otra tanda",
      tests: [
        {
          nombre: "el ataque, con una contraseña larga: tampoco aparece",
          codigo:
            "esperar(JSON.stringify(registrar('hanshuxen', 'muralla-de-tres-metros')), 'la ficha').noContiene('muralla-de-tres-metros')",
        },
        {
          nombre: "con una contraseña de un solo carácter",
          codigo: "esperar(registrar('a', 'x').huella, 'la huella').noEsIgualA('x')",
        },
        {
          nombre: "la contraseña vacía tampoco se guarda tal cual",
          codigo: "esperar(registrar('nadie', '').huella, 'la huella').noEsIgualA('')",
        },
        {
          nombre: "dos claves que se parecen mucho dan huellas que no se parecen",
          codigo:
            "esperar(registrar('a', 'abeja14').huella, 'la huella').noEsIgualA(registrar('a', 'abeja41').huella)",
        },
      ],
    },
  ],
  pistas: [
    pista("Lo único que cambia es lo que pones en `huella`.", 0),
    pista("`hashLento` recibe dos cosas: el texto y cuántas vueltas dar.", 1),
    pista("`huella: hashLento(clave, 1000)`. Y ya está: la contraseña no vuelve a aparecer.", 2),
  ],
  recompensa: { croquetas: 5 },
}
