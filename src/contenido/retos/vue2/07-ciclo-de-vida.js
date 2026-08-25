import { codigo, pista } from '../comun.js'

export default {
  id: "vue2-07-ciclo-de-vida",
  mundo: "vue2",
  entorno: "vue2",
  tipo: "codigo",
  titulo: "Jefe: el reloj de la mansión",
  jefe: true,
  enunciado: codigo(
    "Último asunto de la casa vieja. Un componente tiene una vida: nace, se pinta, cambia y",
    "se muere. Y si al morirse deja cosas encendidas, la casa se llena de relojes sonando solos.",
    "",
    "Declara `componente` con:",
    "",
    "- `data`: `segundos` (0), `registro` (lista vacía) y `avisos` (lista vacía)",
    "- `created()`: apunta `'created'` en el registro",
    "- `mounted()`: apunta `'mounted'` y arranca un `setInterval` que suba `segundos` cada 20 ms,",
    "  guardándolo en `this.temporizador`",
    "- `watch` sobre `segundos`: cada cambio apunta en `avisos` el texto `'viejo -> nuevo'`",
    "- `beforeDestroy()`: **para el intervalo** y apunta `'beforeDestroy'`",
    "- plantilla: un `<p class=\"reloj\">` con los segundos",
    "",
    "Lo importante del reto es lo último. Un intervalo que sigue vivo después de destruir el",
    "componente es una fuga, y de las que no se ven hasta que es tarde.",
  ),
  inicial: codigo(
    "const componente = {",
    "  data() {",
    "    return { segundos: 0, registro: [], avisos: [] }",
    "  },",
    "  // created, mounted, watch y beforeDestroy van aquí.",
    "  template: `<p class=\"reloj\">{{ segundos }}</p>`,",
    "}",
  ),
  solucion: codigo(
    "const componente = {",
    "  data() {",
    "    return { segundos: 0, registro: [], avisos: [] }",
    "  },",
    "  created() {",
    "    this.registro.push('created')",
    "  },",
    "  mounted() {",
    "    this.registro.push('mounted')",
    "    this.temporizador = setInterval(() => {",
    "      this.segundos += 1",
    "    }, 20)",
    "  },",
    "  watch: {",
    "    segundos(nuevo, viejo) {",
    "      this.avisos.push(`${viejo} -> ${nuevo}`)",
    "    },",
    "  },",
    "  beforeDestroy() {",
    "    clearInterval(this.temporizador)",
    "    this.registro.push('beforeDestroy')",
    "  },",
    "  template: `<p class=\"reloj\">{{ segundos }}</p>`,",
    "}",
  ),
  requisitos: [
    { tipo: "declaraVariable", valor: "componente" },
    { tipo: "usaPropiedad", valor: "created" },
    { tipo: "usaPropiedad", valor: "mounted" },
    { tipo: "usaPropiedad", valor: "watch" },
    { tipo: "usaPropiedad", valor: "beforeDestroy" },
    { tipo: "usaLlamada", valor: "clearInterval" },
  ],
  tests: [
    {
      nombre: "nace antes de pintarse",
      codigo: codigo(
        "const reloj = montar(componente)",
        "esperar(reloj.vm.registro).igualA(['created', 'mounted'])",
      ),
    },
    {
      nombre: "el reloj corre",
      codigo: codigo(
        "const reloj = montar(componente)",
        "await new Promise((sigue) => setTimeout(sigue, 90))",
        "esperar(reloj.vm.segundos > 1, 'que hayan pasado más de un segundo').esVerdadero()",
      ),
    },
    {
      nombre: "lo pinta en pantalla",
      codigo: codigo(
        "const reloj = montar(componente)",
        "await new Promise((sigue) => setTimeout(sigue, 90))",
        "await siguienteTick()",
        "esperar(reloj.texto('.reloj')).igualA(String(reloj.vm.segundos))",
      ),
    },
    {
      nombre: "el watch apunta el antes y el después",
      codigo: codigo(
        "const reloj = montar(componente)",
        "await new Promise((sigue) => setTimeout(sigue, 90))",
        "esperar(reloj.vm.avisos[0], 'el primer aviso').igualA('0 -> 1')",
        "esperar(reloj.vm.avisos.length > 1, 'que haya más de un aviso').esVerdadero()",
      ),
    },
    {
      nombre: "al destruirlo se apaga y no se queda sonando solo",
      codigo: codigo(
        "const reloj = montar(componente)",
        "await new Promise((sigue) => setTimeout(sigue, 60))",
        "reloj.vm.$destroy()",
        "esperar(reloj.vm.registro).contiene('beforeDestroy')",
        "const congelado = reloj.vm.segundos",
        "await new Promise((sigue) => setTimeout(sigue, 80))",
        "esperar(reloj.vm.segundos, 'los segundos tras destruirlo').igualA(congelado)",
      ),
    },
  ],
  // El jefe se practica montando y destruyendo el reloj otra vez. Lo que importa
  // sigue siendo lo mismo: que el intervalo quede guardado para poder pararlo, y
  // que al morir el componente se pare de verdad.
  variantes: [
    {
      titulo: "Jefe: el reloj de la mansión · otra tanda",
      tests: [
        {
          nombre: "el registro arranca con created, sigue con mounted y de momento nada más",
          codigo: codigo(
            "const reloj = montar(componente)",
            "esperar(reloj.vm.registro[0], 'el primer apunte').igualA('created')",
            "esperar(reloj.vm.registro[1], 'el segundo apunte').igualA('mounted')",
            "esperar(reloj.vm.registro).tieneLongitud(2)",
          ),
        },
        {
          nombre: "recién montado marca cero y todavía no ha avisado de nada",
          codigo: codigo(
            "const reloj = montar(componente)",
            "esperar(reloj.texto('.reloj')).igualA('0')",
            "esperar(reloj.vm.avisos).tieneLongitud(0)",
          ),
        },
        {
          nombre: "el temporizador queda guardado, que es lo que después permite pararlo",
          codigo: codigo(
            "const reloj = montar(componente)",
            "esperar(reloj.vm.temporizador, 'el temporizador').existe()",
          ),
        },
        {
          nombre: "al rato ya ha avisado, y el aviso lleva su flecha de antes a después",
          codigo: codigo(
            "const reloj = montar(componente)",
            "await new Promise((sigue) => setTimeout(sigue, 90))",
            "esperar(reloj.vm.avisos.length > 0, 'que haya avisado alguna vez').esVerdadero()",
            "esperar(reloj.vm.avisos[0]).contiene('->')",
          ),
        },
        {
          nombre: "y lo que se pinta son solo cifras, sin adornos",
          codigo: codigo(
            "const reloj = montar(componente)",
            "await new Promise((sigue) => setTimeout(sigue, 60))",
            "await siguienteTick()",
            "esperar(/^\\d+$/.test(reloj.texto('.reloj')), 'que el reloj pinte solo cifras').esVerdadero()",
          ),
        },
      ],
    },
    {
      titulo: "Jefe: el reloj de la mansión · y otra",
      tests: [
        {
          nombre: "un reloj nuevo no hereda el registro del anterior",
          codigo: codigo(
            "const primero = montar(componente)",
            "const segundo = montar(componente)",
            "esperar(segundo.vm.registro).igualA(['created', 'mounted'])",
          ),
        },
        {
          nombre: "mientras el reloj vive, el registro no crece: ahí ya no se apunta nadie",
          codigo: codigo(
            "const reloj = montar(componente)",
            "await new Promise((sigue) => setTimeout(sigue, 60))",
            "esperar(reloj.vm.registro).tieneLongitud(2)",
          ),
        },
        {
          nombre: "al destruirlo, el tercer apunte es beforeDestroy",
          codigo: codigo(
            "const reloj = montar(componente)",
            "reloj.vm.$destroy()",
            "esperar(reloj.vm.registro).tieneLongitud(3)",
            "esperar(reloj.vm.registro[2]).igualA('beforeDestroy')",
          ),
        },
        {
          nombre: "y después de destruirlo deja de avisar: el intervalo se paró de verdad",
          codigo: codigo(
            "const reloj = montar(componente)",
            "const avisos = reloj.vm.avisos",
            "await new Promise((sigue) => setTimeout(sigue, 90))",
            "reloj.vm.$destroy()",
            "const cuantos = avisos.length",
            "esperar(cuantos > 0, 'que hubiera avisado antes de apagarlo').esVerdadero()",
            "await new Promise((sigue) => setTimeout(sigue, 90))",
            "esperar(avisos.length, 'los avisos después de apagarlo').igualA(cuantos)",
          ),
        },
      ],
    },
  ],
  recompensa: { croquetas: 20 },
}
