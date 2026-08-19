import { codigo, pista } from '../comun.js'

export default {
  id: "elendel-08-esperar-a-varios",
  mundo: "elendel",
  entorno: "worker",
  tipo: "codigo",
  titulo: "Cuando uno de los avisos no llega",
  enunciado: codigo(
    "En Los Áridos usaste `Promise.all` para esperar a varios a la vez. Tiene un problema",
    "grande: **si uno falla, se pierde todo**, incluso lo que ya había llegado bien.",
    "",
    "Pides el parte a los cuatro puestos de la ciudad. Alguno estará cerrado, y eso no",
    "puede dejarte sin los otros tres.",
    "",
    "Escribe `reunirPartes(peticiones)`, que **espere a todas** y devuelva",
    "`{ recibidos, fallidos }`: la lista de los partes que llegaron y cuántos no llegaron.",
    "El orden de `recibidos` tiene que ser el de las peticiones.",
  ),
  inicial: codigo(
    "async function reunirPartes(peticiones) {",
    "  // Espera a todas, hayan salido bien o mal, y reparte el resultado.",
    "}",
  ),
  solucion: codigo(
    "async function reunirPartes(peticiones) {",
    "  const resultados = await Promise.allSettled(peticiones)",
    "",
    "  return {",
    "    recibidos: resultados",
    "      .filter((resultado) => resultado.status === 'fulfilled')",
    "      .map((resultado) => resultado.value),",
    "    fallidos: resultados.filter((resultado) => resultado.status === 'rejected').length,",
    "  }",
    "}",
  ),
  requisitos: [
    { tipo: "declaraVariable", valor: "reunirPartes" },
    { tipo: "usaAsync" },
    { tipo: "usaLlamada", valor: "allSettled" },
    { tipo: "prohibeLlamada", valor: "all" },
    { tipo: "prohibeVar" },
  ],
  tests: [
    {
      nombre: "con todos respondiendo, los trae todos y no cuenta fallos",
      codigo: codigo(
        "const salida = await reunirPartes([",
        "  Promise.resolve('Elendel'), Promise.resolve('Dulsing'),",
        "])",
        "esperar(salida).igualA({ recibidos: ['Elendel', 'Dulsing'], fallidos: 0 })",
      ),
    },
    {
      nombre: "un puesto cerrado no se lleva por delante a los demás",
      codigo: codigo(
        "const salida = await reunirPartes([",
        "  Promise.resolve('Elendel'),",
        "  Promise.reject(new Error('cerrado')),",
        "  Promise.resolve('Los Áridos'),",
        "])",
        "esperar(salida).igualA({ recibidos: ['Elendel', 'Los Áridos'], fallidos: 1 })",
      ),
    },
    {
      nombre: "si no contesta nadie, la lista viene vacía",
      codigo: codigo(
        "const salida = await reunirPartes([",
        "  Promise.reject(new Error('uno')), Promise.reject(new Error('otro')),",
        "])",
        "esperar(salida).igualA({ recibidos: [], fallidos: 2 })",
      ),
    },
    {
      nombre: "sin peticiones, no hay ni recibidos ni fallidos",
      codigo: "esperar(await reunirPartes([])).igualA({ recibidos: [], fallidos: 0 })",
    },
    {
      nombre: "respeta el orden de las peticiones, no el de llegada",
      codigo: codigo(
        "const lento = new Promise((listo) => setTimeout(() => listo('lento'), 20))",
        "const salida = await reunirPartes([lento, Promise.resolve('rápido')])",
        "esperar(salida.recibidos).igualA(['lento', 'rápido'])",
      ),
    },
  ],
  pistas: [
    pista("`Promise.all` no vale aquí, y de hecho el reto lo prohíbe. Su hermana espera a todas pase lo que pase y nunca falla.", 0),
    pista("`Promise.allSettled` devuelve una lista de informes, uno por petición y en el mismo orden. Cada informe dice cómo acabó.", 1),
    pista("Cada informe es `{ status: 'fulfilled', value }` o `{ status: 'rejected', reason }`. Con eso, separar los buenos de los malos es filtrar dos veces por `status`.", 2),
  ],
  recompensa: { croquetas: 15 },
}
