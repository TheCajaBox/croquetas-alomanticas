import { codigo, pista } from '../comun.js'

export default {
  id: "cien-dias-08-lo-que-no-se-reconoce",
  mundo: "cien-dias",
  entorno: "worker",
  tipo: "bug",
  titulo: "Lo que no se reconoce",
  enunciado: codigo(
    "`autorizar(rol, accion)` decide qué puede hacer cada rol. Está escrita con un `switch` y",
    "funciona: los tres roles hacen lo que les toca y las pruebas pasan.",
    "",
    "Y el día que alguien añada una acción nueva al sistema, esa acción nacerá **abierta para",
    "todos**. Arréglalo: lo que no se reconozca se deniega.",
  ),
  inicial: codigo(
    "function autorizar(rol, accion) {",
    "  switch (accion) {",
    "    case 'ver':",
    "      return true",
    "    case 'firmar':",
    "      return rol === 'arbitrador' || rol === 'general'",
    "    case 'borrar':",
    "      return rol === 'general'",
    "    default:",
    "      return true",
    "  }",
    "}",
  ),
  solucion: codigo(
    "const QUIEN_PUEDE = {",
    "  ver: ['escriba', 'arbitrador', 'general'],",
    "  firmar: ['arbitrador', 'general'],",
    "  borrar: ['general'],",
    "}",
    "",
    "function autorizar(rol, accion) {",
    "  const permitidos = QUIEN_PUEDE[accion]",
    "  // Lista o nada: `QUIEN_PUEDE['toString']` no es nulo -todos los objetos",
    "  // heredan `toString`- así que preguntar si existe no basta.",
    "  if (!Array.isArray(permitidos)) return false",
    "  return permitidos.includes(rol)",
    "}",
  ),
  requisitos: [
    { tipo: "prohibeLlamada", valor: "autorizar", texto: "Sin llamarse a sí misma: esto es una tabla, no una recursión" },
    { tipo: "usaLlamada", valor: "includes", texto: "Cada acción declara quién puede, y se busca ahí" },
    { tipo: "usaLlamada", valor: "isArray", texto: "Lo que sale de la tabla tiene que ser una lista, no cualquier cosa" },
  ],
  tests: [
    {
      nombre: "los tres roles pueden ver",
      codigo: codigo(
        "for (const rol of ['escriba', 'arbitrador', 'general']) {",
        "  esperar(autorizar(rol, 'ver'), rol + ' puede ver').esVerdadero()",
        "}",
      ),
    },
    {
      nombre: "firmar es de arbitradores y generales",
      codigo: codigo(
        "esperar(autorizar('arbitrador', 'firmar'), 'arbitrador firma').esVerdadero()",
        "esperar(autorizar('general', 'firmar'), 'general firma').esVerdadero()",
        "esperar(autorizar('escriba', 'firmar'), 'escriba firma').esFalso()",
      ),
    },
    {
      nombre: "borrar es solo del general",
      codigo: codigo(
        "esperar(autorizar('general', 'borrar'), 'general borra').esVerdadero()",
        "esperar(autorizar('arbitrador', 'borrar'), 'arbitrador borra').esFalso()",
        "esperar(autorizar('escriba', 'borrar'), 'escriba borra').esFalso()",
      ),
    },
    {
      nombre: "el ataque: una acción que nadie ha declarado se deniega",
      codigo: codigo(
        "esperar(autorizar('escriba', 'exportar'), 'exportar').esFalso()",
        "esperar(autorizar('general', 'exportar'), 'exportar siendo general').esFalso()",
      ),
    },
    {
      nombre: "el ataque de la acción vacía",
      codigo: codigo(
        "esperar(autorizar('general', ''), 'la acción vacía').esFalso()",
        "esperar(autorizar('general', undefined), 'sin acción').esFalso()",
      ),
    },
    {
      nombre: "el ataque del rol inventado",
      codigo: codigo(
        "esperar(autorizar('emperador', 'borrar'), 'un rol que no existe').esFalso()",
        "esperar(autorizar('emperador', 'ver'), 'ni para ver').esFalso()",
        "esperar(autorizar(undefined, 'ver'), 'sin rol').esFalso()",
      ),
    },
    {
      nombre: "el ataque del nombre de una propiedad heredada",
      codigo: codigo(
        "// `constructor` y `toString` están en todos los objetos, así que una tabla",
        "// mal consultada diría que existen como acciones.",
        "esperar(autorizar('general', 'constructor'), 'constructor').esFalso()",
        "esperar(autorizar('general', 'toString'), 'toString').esFalso()",
      ),
    },
  ],
  variantes: [
    {
      titulo: "Lo que no se reconoce · otra tanda",
      tests: [
        {
          nombre: "el escriba solo puede ver",
          codigo: codigo(
            "esperar(autorizar('escriba', 'ver'), 'ver').esVerdadero()",
            "for (const accion of ['firmar', 'borrar', 'exportar', 'revocar']) {",
            "  esperar(autorizar('escriba', accion), accion).esFalso()",
            "}",
          ),
        },
        {
          nombre: "el ataque de las acciones que suenan parecidas",
          codigo: codigo(
            "for (const accion of ['Ver', 'VER', ' ver', 'ver ', 'verr']) {",
            "  esperar(autorizar('general', accion), accion).esFalso()",
            "}",
          ),
        },
        {
          nombre: "y las declaradas siguen funcionando",
          codigo: codigo(
            "esperar(autorizar('general', 'borrar'), 'borrar').esVerdadero()",
            "esperar(autorizar('arbitrador', 'firmar'), 'firmar').esVerdadero()",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("El `default` es el problema, y no basta con cambiarlo: la forma del código invita al fallo.", 0),
    pista(
      "Un `switch` de permisos crece hacia abajo y cada rama es un `if` distinto. Una **tabla** —qué acción, quién puede— no tiene ese problema: lo que no está en la tabla no existe.",
      1,
    ),
    pista(
      "Ojo con consultar la tabla: `QUIEN_PUEDE['toString']` no es `undefined`, porque todos los objetos heredan `toString`. Comprobar que lo que sale es una lista antes de usarla resuelve eso y el caso de la acción inventada a la vez.",
      2,
    ),
  ],
  recompensa: { croquetas: 7 },
}
