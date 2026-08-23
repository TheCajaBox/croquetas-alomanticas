import { codigo, pista } from '../comun.js'

export default {
  id: "cien-dias-10-el-limite-de-intentos",
  mundo: "cien-dias",
  entorno: "worker",
  tipo: "codigo",
  titulo: "El límite de intentos",
  enunciado: codigo(
    "Ahora escríbelo bien. Dos funciones:",
    "",
    "**`sePuedeIntentar(cuenta, ahora)`** — `true` si esa cuenta puede intentar entrar. No",
    "puede si tiene **tres o más fallos** dentro de los últimos **quince minutos**.",
    "",
    "**`apuntarFallo(cuenta, ahora)`** — apunta un fallo de esa cuenta en ese momento.",
    "",
    "Los tiempos van en milisegundos. `FALLOS` está dado y es donde se guardan: una lista de",
    "instantes por cuenta.",
    "",
    "Tres reglas que los tests comprueban:",
    "",
    "- **por cuenta**, no un contador para todo el sistema;",
    "- **en una ventana**: un fallo de hace veinte minutos ya no cuenta;",
    "- y **acertar no borra nada**: aquí no hay ninguna función que ponga la cuenta a cero, y",
    "  es a propósito.",
  ),
  inicial: codigo(
    "// Dado. No lo toques.",
    "const FALLOS = {}",
    "const QUINCE_MINUTOS = 15 * 60 * 1000",
    "const LIMITE = 3",
    "",
    "// Tu parte.",
    "function sePuedeIntentar(cuenta, ahora) {",
    "  return (FALLOS[cuenta] ?? []).length < LIMITE",
    "}",
    "",
    "function apuntarFallo(cuenta, ahora) {",
    "  FALLOS[cuenta] = [...(FALLOS[cuenta] ?? []), ahora]",
    "}",
  ),
  solucion: codigo(
    "// Dado. No lo toques.",
    "const FALLOS = {}",
    "const QUINCE_MINUTOS = 15 * 60 * 1000",
    "const LIMITE = 3",
    "",
    "// Tu parte.",
    "function recientes(cuenta, ahora) {",
    "  return (FALLOS[cuenta] ?? []).filter((cuando) => ahora - cuando < QUINCE_MINUTOS)",
    "}",
    "",
    "function sePuedeIntentar(cuenta, ahora) {",
    "  return recientes(cuenta, ahora).length < LIMITE",
    "}",
    "",
    "function apuntarFallo(cuenta, ahora) {",
    "  FALLOS[cuenta] = [...(FALLOS[cuenta] ?? []), ahora]",
    "}",
  ),
  requisitos: [
    { tipo: "usaLlamada", valor: "filter", texto: "Los fallos viejos se dejan fuera de la cuenta" },
    { tipo: "usaIdentificador", valor: "QUINCE_MINUTOS", texto: "La ventana es de quince minutos" },
  ],
  tests: [
    {
      nombre: "una cuenta nueva puede intentar",
      codigo: "esperar(sePuedeIntentar('shai', 1000), 'puede').esVerdadero()",
    },
    {
      nombre: "con dos fallos, todavía",
      codigo: codigo(
        "apuntarFallo('a', 1000)",
        "apuntarFallo('a', 2000)",
        "esperar(sePuedeIntentar('a', 3000), 'puede').esVerdadero()",
      ),
    },
    {
      nombre: "con tres, no",
      codigo: codigo(
        "apuntarFallo('b', 1000)",
        "apuntarFallo('b', 2000)",
        "apuntarFallo('b', 3000)",
        "esperar(sePuedeIntentar('b', 4000), 'puede').esFalso()",
      ),
    },
    {
      nombre: "el ataque de la fuerza bruta: cien intentos y sigue cerrada",
      codigo: codigo(
        "for (let i = 0; i < 100; i += 1) apuntarFallo('c', 1000 + i)",
        "esperar(sePuedeIntentar('c', 2000), 'puede').esFalso()",
      ),
    },
    {
      nombre: "la ventana: pasados los quince minutos, se puede otra vez",
      codigo: codigo(
        "apuntarFallo('d', 0)",
        "apuntarFallo('d', 1000)",
        "apuntarFallo('d', 2000)",
        "esperar(sePuedeIntentar('d', 3000), 'a los tres segundos').esFalso()",
        "esperar(sePuedeIntentar('d', 16 * 60 * 1000), 'a los dieciséis minutos').esVerdadero()",
      ),
    },
    {
      nombre: "y en el borde exacto de la ventana, el fallo ya no cuenta",
      codigo: codigo(
        "apuntarFallo('e', 0)",
        "apuntarFallo('e', 0)",
        "apuntarFallo('e', 0)",
        "esperar(sePuedeIntentar('e', 15 * 60 * 1000 - 1), 'un milisegundo antes').esFalso()",
        "esperar(sePuedeIntentar('e', 15 * 60 * 1000), 'justo al cumplirse').esVerdadero()",
      ),
    },
    {
      nombre: "el ataque de mezclar cuentas: bloquear una no bloquea otra",
      codigo: codigo(
        "for (const cuando of [1000, 2000, 3000]) apuntarFallo('f', cuando)",
        "esperar(sePuedeIntentar('f', 4000), 'la bloqueada').esFalso()",
        "esperar(sePuedeIntentar('g', 4000), 'otra cuenta').esVerdadero()",
      ),
    },
    {
      nombre: "el ataque del acierto en medio: no borra los fallos anteriores",
      codigo: codigo(
        "// Aquí no hay función de reinicio, y es la comprobación: si alguien la",
        "// añade, esto se cae.",
        "apuntarFallo('h', 1000)",
        "apuntarFallo('h', 2000)",
        "// (aquí acertaría, y no pasa nada)",
        "apuntarFallo('h', 3000)",
        "esperar(sePuedeIntentar('h', 4000), 'puede').esFalso()",
      ),
    },
    {
      nombre: "los fallos viejos se descuentan pero los recientes cuentan",
      codigo: codigo(
        "apuntarFallo('i', 0)",
        "apuntarFallo('i', 0)",
        "const luego = 20 * 60 * 1000",
        "apuntarFallo('i', luego)",
        "apuntarFallo('i', luego + 1)",
        "esperar(sePuedeIntentar('i', luego + 2), 'con dos recientes').esVerdadero()",
        "apuntarFallo('i', luego + 2)",
        "esperar(sePuedeIntentar('i', luego + 3), 'con tres recientes').esFalso()",
      ),
    },
  ],
  variantes: [
    {
      titulo: "El límite de intentos · otra tanda",
      tests: [
        {
          nombre: "tres fallos seguidos cierran, y a la hora se abre",
          codigo: codigo(
            "for (const cuando of [100, 200, 300]) apuntarFallo('z1', cuando)",
            "esperar(sePuedeIntentar('z1', 400), 'al momento').esFalso()",
            "esperar(sePuedeIntentar('z1', 60 * 60 * 1000), 'a la hora').esVerdadero()",
          ),
        },
        {
          nombre: "el ataque de mil intentos repartidos en un minuto",
          codigo: codigo(
            "for (let i = 0; i < 1000; i += 1) apuntarFallo('z2', 60 * i)",
            "esperar(sePuedeIntentar('z2', 60 * 1000), 'puede').esFalso()",
          ),
        },
        {
          nombre: "el ataque del relleno de credenciales: cada cuenta lleva su cuenta",
          codigo: codigo(
            "// Un intento en cada una de diez cuentas no bloquea ninguna. Eso es",
            "// verdad y es un ataque: por eso además hay que limitar por origen.",
            "for (let i = 0; i < 10; i += 1) apuntarFallo('z3-' + i, 1000)",
            "for (let i = 0; i < 10; i += 1) {",
            "  esperar(sePuedeIntentar('z3-' + i, 2000), 'la cuenta ' + i).esVerdadero()",
            "}",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Lo que falta es una sola idea: no contar los fallos viejos.", 0),
    pista(
      "«Viejo» es que hayan pasado más de quince minutos: la resta entre `ahora` y el instante apuntado.",
      1,
    ),
    pista(
      "Sale más limpio con una función aparte que devuelva los fallos que todavía cuentan; después, `sePuedeIntentar` solo tiene que mirar cuántos son. Y `apuntarFallo` no cambia.",
      2,
    ),
  ],
  recompensa: { croquetas: 8 },
}
