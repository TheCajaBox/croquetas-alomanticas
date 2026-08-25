import { codigo, pista } from '../comun.js'

export default {
  id: "taller-08-el-almacen",
  mundo: "taller",
  entorno: "worker",
  tipo: "codigo",
  jefe: true,
  titulo: "Jefe: el almacén de metales",
  enunciado: codigo(
    "Todo el taller en una sola clase.",
    "",
    "Escribe `Almacen`, que lleva las reservas de metales de la comisaría:",
    "",
    "- `constructor()` — nace vacío.",
    "- `guardar(metal, cantidad)` — suma esa cantidad al metal. Si la cantidad no es",
    "  positiva, lanza `'La cantidad tiene que ser positiva'`.",
    "- `sacar(metal, cantidad)` — resta. Si no hay bastante, lanza",
    "  `'No hay suficiente estaño'` (con el metal que sea).",
    "- `cuanto(metal)` — cuánto queda; `0` si nunca hubo.",
    "- `get metales` — la lista de metales **que tienen existencias**, ordenada",
    "  alfabéticamente.",
    "- `get total` — la suma de todo lo que hay.",
    "",
    "Y una cosa más: **el inventario tiene que ser privado**. Nadie puede cambiar las",
    "existencias sin pasar por `guardar` y `sacar`.",
  ),
  inicial: codigo(
    "class Almacen {",
    "  // el inventario privado, y los cuatro métodos y dos get",
    "}",
    "",
    "const almacen = new Almacen()",
    "almacen.guardar('estaño', 10)",
    "almacen.guardar('acero', 5)",
    "console.log(almacen.metales, almacen.total)",
  ),
  solucion: codigo(
    "class Almacen {",
    "  #inventario = new Map()",
    "",
    "  guardar(metal, cantidad) {",
    "    if (cantidad <= 0) {",
    "      throw new Error('La cantidad tiene que ser positiva')",
    "    }",
    "    this.#inventario.set(metal, this.cuanto(metal) + cantidad)",
    "  }",
    "",
    "  sacar(metal, cantidad) {",
    "    if (cantidad <= 0) {",
    "      throw new Error('La cantidad tiene que ser positiva')",
    "    }",
    "    if (cantidad > this.cuanto(metal)) {",
    "      throw new Error(`No hay suficiente ${metal}`)",
    "    }",
    "",
    "    const queda = this.cuanto(metal) - cantidad",
    "    if (queda === 0) {",
    "      this.#inventario.delete(metal)",
    "    } else {",
    "      this.#inventario.set(metal, queda)",
    "    }",
    "  }",
    "",
    "  cuanto(metal) {",
    "    return this.#inventario.get(metal) ?? 0",
    "  }",
    "",
    "  get metales() {",
    "    return [...this.#inventario.keys()].sort((a, b) => a.localeCompare(b))",
    "  }",
    "",
    "  get total() {",
    "    return [...this.#inventario.values()].reduce((suma, n) => suma + n, 0)",
    "  }",
    "}",
    "",
    "const almacen = new Almacen()",
    "almacen.guardar('estaño', 10)",
    "almacen.guardar('acero', 5)",
    "console.log(almacen.metales, almacen.total)",
  ),
  requisitos: [
    { tipo: "usaDeclaracion", valor: "class" },
    { tipo: "usaLlamada", valor: "Map" },
    { tipo: "usaLlamada", valor: "Error" },
  ],
  tests: [
    {
      nombre: "nace vacío",
      codigo: codigo(
        "const a = new Almacen()",
        "esperar(a.total).igualA(0)",
        "esperar(a.metales).tieneLongitud(0)",
      ),
    },
    {
      nombre: "guarda y cuenta",
      codigo: codigo(
        "const a = new Almacen()",
        "a.guardar('estaño', 10)",
        "esperar(a.cuanto('estaño')).igualA(10)",
      ),
    },
    {
      nombre: "guardar dos veces el mismo metal suma",
      codigo: codigo(
        "const a = new Almacen()",
        "a.guardar('estaño', 10)",
        "a.guardar('estaño', 5)",
        "esperar(a.cuanto('estaño')).igualA(15)",
      ),
    },
    {
      nombre: "un metal que nunca hubo está a cero, no undefined",
      codigo: "esperar(new Almacen().cuanto('aluminio')).igualA(0)",
    },
    {
      nombre: "sacar resta",
      codigo: codigo(
        "const a = new Almacen()",
        "a.guardar('acero', 10)",
        "a.sacar('acero', 4)",
        "esperar(a.cuanto('acero')).igualA(6)",
      ),
    },
    {
      nombre: "no se puede sacar más de lo que hay",
      codigo: codigo(
        "const a = new Almacen()",
        "a.guardar('estaño', 3)",
        "esperar(() => a.sacar('estaño', 10)).lanzaError('No hay suficiente estaño')",
      ),
    },
    {
      nombre: "y el error nombra el metal que falta",
      codigo: codigo(
        "const a = new Almacen()",
        "esperar(() => a.sacar('bronce', 1)).lanzaError('No hay suficiente bronce')",
      ),
    },
    {
      nombre: "guardar cantidades absurdas lanza",
      codigo: codigo(
        "const a = new Almacen()",
        "esperar(() => a.guardar('estaño', 0)).lanzaError('La cantidad tiene que ser positiva')",
        "esperar(() => a.guardar('estaño', -5)).lanzaError('La cantidad tiene que ser positiva')",
      ),
    },
    {
      nombre: "un error no deja el almacén a medias",
      codigo: codigo(
        "const a = new Almacen()",
        "a.guardar('estaño', 3)",
        "try { a.sacar('estaño', 10) } catch (e) {}",
        "esperar(a.cuanto('estaño')).igualA(3)",
      ),
    },
    {
      nombre: "el metal que se agota desaparece de la lista",
      codigo: codigo(
        "const a = new Almacen()",
        "a.guardar('estaño', 5)",
        "a.guardar('acero', 2)",
        "a.sacar('estaño', 5)",
        "esperar(a.metales).igualA(['acero'])",
      ),
    },
    {
      nombre: "los metales salen ordenados",
      codigo: codigo(
        "const a = new Almacen()",
        "a.guardar('peltre', 1)",
        "a.guardar('acero', 1)",
        "a.guardar('estaño', 1)",
        "esperar(a.metales).igualA(['acero', 'estaño', 'peltre'])",
      ),
    },
    {
      nombre: "el total suma todos los metales",
      codigo: codigo(
        "const a = new Almacen()",
        "a.guardar('estaño', 10)",
        "a.guardar('acero', 5)",
        "a.guardar('bronce', 2)",
        "esperar(a.total).igualA(17)",
      ),
    },
    {
      nombre: "el inventario no se toca desde fuera",
      codigo: codigo(
        "const a = new Almacen()",
        "a.guardar('estaño', 10)",
        "a.inventario = new Map([['estaño', 99999]])",
        "esperar(a.cuanto('estaño')).igualA(10)",
      ),
    },
    {
      nombre: "dos almacenes no comparten existencias",
      codigo: codigo(
        "const a = new Almacen()",
        "const b = new Almacen()",
        "a.guardar('estaño', 10)",
        "esperar(b.total).igualA(0)",
      ),
    },
  ],
  // El jefe se practica dando vueltas al almacén: llenarlo, vaciarlo del todo y
  // volver a llenarlo. Ahí es donde se ve si el metal agotado desaparece de la
  // lista o se queda a cero haciendo bulto.
  variantes: [
    {
      titulo: "Jefe: el almacén de metales · otra tanda",
      tests: [
        {
          nombre: "vaciar un metal lo quita de la lista, y volver a guardarlo lo devuelve",
          codigo: codigo(
            "const a = new Almacen()",
            "a.guardar('zinc', 3)",
            "a.sacar('zinc', 3)",
            "esperar(a.metales).igualA([])",
            "a.guardar('zinc', 1)",
            "esperar(a.metales).igualA(['zinc'])",
          ),
        },
        {
          nombre: "el total baja cuando se saca, no solo sube cuando se guarda",
          codigo: codigo(
            "const a = new Almacen()",
            "a.guardar('estaño', 10)",
            "a.guardar('acero', 5)",
            "a.sacar('estaño', 4)",
            "esperar(a.total).igualA(11)",
          ),
        },
        {
          nombre: "las tildes no se cuelan al principio de la lista: estaño va entre aluminio y zinc",
          codigo: codigo(
            "const a = new Almacen()",
            "a.guardar('estaño', 1)",
            "a.guardar('zinc', 1)",
            "a.guardar('aluminio', 1)",
            "esperar(a.metales).igualA(['aluminio', 'estaño', 'zinc'])",
          ),
        },
        {
          nombre: "un metal agotado vuelve a estar a cero, no a undefined",
          codigo: codigo(
            "const a = new Almacen()",
            "a.guardar('bronce', 2)",
            "a.sacar('bronce', 2)",
            "esperar(a.cuanto('bronce')).igualA(0)",
          ),
        },
        {
          nombre: "y guardar el mismo metal en dos almacenes no los mezcla",
          codigo: codigo(
            "const a = new Almacen()",
            "const b = new Almacen()",
            "a.guardar('acero', 3)",
            "b.guardar('acero', 7)",
            "esperar(a.cuanto('acero')).igualA(3)",
            "esperar(b.cuanto('acero')).igualA(7)",
          ),
        },
      ],
    },
    {
      titulo: "Jefe: el almacén de metales · y otra",
      tests: [
        {
          nombre: "sacar justo lo que hay se puede: es «no hay bastante», no «no hay de sobra»",
          codigo: codigo(
            "const a = new Almacen()",
            "a.guardar('peltre', 4)",
            "a.sacar('peltre', 4)",
            "esperar(a.cuanto('peltre')).igualA(0)",
            "esperar(a.total).igualA(0)",
          ),
        },
        {
          nombre: "pedir un metal que nunca pisó el almacén lanza nombrándolo",
          codigo: codigo(
            "const a = new Almacen()",
            "esperar(() => a.sacar('aluminio', 1)).lanzaError()",
          ),
        },
        {
          nombre: "el total de tres metales es la suma de los tres, y preguntarlo no lo cambia",
          codigo: codigo(
            "const a = new Almacen()",
            "a.guardar('estaño', 10)",
            "a.guardar('acero', 15)",
            "a.guardar('bronce', 5)",
            "esperar(a.total).igualA(30)",
            "esperar(a.total).igualA(30)",
          ),
        },
        {
          nombre: "una cantidad que no vale no crea el metal a medias",
          codigo: codigo(
            "const a = new Almacen()",
            "try { a.guardar('acero', -1) } catch (e) {}",
            "esperar(a.metales).tieneLongitud(0)",
            "esperar(a.cuanto('acero')).igualA(0)",
          ),
        },
        {
          nombre: "el inventario no asoma ni entre las propiedades del almacén",
          codigo: "esperar(Object.keys(new Almacen()), 'lo que se ve del almacén').tieneLongitud(0)",
        },
        {
          nombre: "y un metal con nombre de catálogo también vale de clave",
          codigo: codigo(
            "const a = new Almacen()",
            "a.guardar('duraluminio-12', 4)",
            "esperar(a.cuanto('duraluminio-12')).igualA(4)",
            "esperar(a.metales).igualA(['duraluminio-12'])",
          ),
        },
      ],
    },
  ],
  recompensa: { croquetas: 18 },
}
