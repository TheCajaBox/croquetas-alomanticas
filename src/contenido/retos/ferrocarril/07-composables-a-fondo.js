import { codigo, pista } from '../comun.js'

export default {
  id: "ferro-07-composables-a-fondo",
  mundo: "ferrocarril",
  entorno: "vue3",
  tipo: "codigo",
  titulo: "Un composable que acepta lo que le den",
  enunciado: codigo(
    "Un composable que solo funciona si le pasas un número es medio composable: quien lo",
    "use con una `ref` —que es lo normal— se lleva un valor congelado.",
    "",
    "Los buenos aceptan **las dos cosas** y se comportan igual. Es lo que hacen todos los",
    "de la librería estándar de la comunidad, y es lo que separa un composable de una",
    "función suelta metida en un archivo aparte.",
    "",
    "Escribe `usarDescuento(precio, porcentaje)` que devuelva `{ rebajado }`, una",
    "`computed` con el precio ya rebajado. Las dos cosas pueden venir como número o como",
    "`ref`, y si vienen como `ref` el resultado tiene que seguir los cambios.",
  ),
  inicial: codigo(
    "const { ref, computed, unref } = Vue",
    "",
    "function usarDescuento(precio, porcentaje) {",
    "  // unref(x) devuelve x.value si es una ref, y x tal cual si no lo es.",
    "}",
  ),
  solucion: codigo(
    "const { ref, computed, unref } = Vue",
    "",
    "function usarDescuento(precio, porcentaje) {",
    "  const rebajado = computed(() => {",
    "    const base = unref(precio)",
    "    return base - (base * unref(porcentaje)) / 100",
    "  })",
    "",
    "  return { rebajado }",
    "}",
  ),
  requisitos: [
    { tipo: "declaraVariable", valor: "usarDescuento" },
    { tipo: "usaLlamada", valor: "computed" },
    { tipo: "usaLlamada", valor: "unref" },
    { tipo: "prohibeVar" },
  ],
  tests: [
    {
      nombre: "funciona con dos números sueltos",
      codigo: codigo(
        "const { rebajado } = usarDescuento(100, 10)",
        "esperar(rebajado.value).igualA(90)",
      ),
    },
    {
      nombre: "funciona con dos refs",
      codigo: codigo(
        "const { rebajado } = usarDescuento(ref(100), ref(25))",
        "esperar(rebajado.value).igualA(75)",
      ),
    },
    {
      nombre: "sigue los cambios de la ref del precio",
      codigo: codigo(
        "const precio = ref(100)",
        "const { rebajado } = usarDescuento(precio, 10)",
        "precio.value = 200",
        "esperar(rebajado.value, 'se quedó con el precio de antes').igualA(180)",
      ),
    },
    {
      nombre: "sigue los cambios del porcentaje",
      codigo: codigo(
        "const porcentaje = ref(0)",
        "const { rebajado } = usarDescuento(50, porcentaje)",
        "porcentaje.value = 50",
        "esperar(rebajado.value).igualA(25)",
      ),
    },
    {
      nombre: "se puede mezclar: uno suelto y otro ref",
      codigo: codigo(
        "const { rebajado } = usarDescuento(ref(80), 50)",
        "esperar(rebajado.value).igualA(40)",
      ),
    },
  ],
  // Lo que falla si `unref` se llama en el sitio equivocado es que la computed
  // deja de seguir a la ref. Estas tandas mezclan números y refs en todas las
  // combinaciones, y cambian las refs después de crear el descuento.
  variantes: [
    {
      titulo: "Un composable que acepta lo que le den · otra tanda",
      tests: [
        {
          nombre: "cien menos el veinte por ciento son ochenta",
          codigo: codigo(
            "const { rebajado } = usarDescuento(100, 20)",
            "esperar(rebajado.value).igualA(80)",
          ),
        },
        {
          nombre: "un descuento del cien por cien deja el precio a cero",
          codigo: codigo(
            "const { rebajado } = usarDescuento(50, 100)",
            "esperar(rebajado.value).igualA(0)",
          ),
        },
        {
          nombre: "un descuento de cero deja el precio como estaba",
          codigo: codigo(
            "const { rebajado } = usarDescuento(37, 0)",
            "esperar(rebajado.value).igualA(37)",
          ),
        },
        {
          nombre: "con las dos como refs, sigue los dos cambios y no solo el primero",
          codigo: codigo(
            "const precio = ref(200)",
            "const porcentaje = ref(10)",
            "const { rebajado } = usarDescuento(precio, porcentaje)",
            "esperar(rebajado.value).igualA(180)",
            "precio.value = 100",
            "esperar(rebajado.value).igualA(90)",
            "porcentaje.value = 50",
            "esperar(rebajado.value).igualA(50)",
          ),
        },
        {
          nombre: "y un precio de cero se queda en cero, descuento incluido",
          codigo: codigo(
            "const { rebajado } = usarDescuento(0, 30)",
            "esperar(rebajado.value).igualA(0)",
          ),
        },
      ],
    },
    {
      titulo: "Un composable que acepta lo que le den · y otra",
      tests: [
        {
          nombre: "precio en ref y porcentaje suelto: sesenta menos un cuarto son cuarenta y cinco",
          codigo: codigo(
            "const { rebajado } = usarDescuento(ref(60), 25)",
            "esperar(rebajado.value).igualA(45)",
          ),
        },
        {
          nombre: "y al revés sale lo mismo: al composable le da igual cómo le llegue cada cosa",
          codigo: codigo(
            "const { rebajado } = usarDescuento(60, ref(25))",
            "esperar(rebajado.value).igualA(45)",
          ),
        },
        {
          nombre: "los decimales salen tal cual, que aquí nadie redondea nada",
          codigo: codigo(
            "const { rebajado } = usarDescuento(10, 33)",
            "esperar(rebajado.value).igualA(6.7)",
          ),
        },
        {
          nombre: "cambiar la ref del precio dos veces se nota las dos veces",
          codigo: codigo(
            "const precio = ref(80)",
            "const { rebajado } = usarDescuento(precio, 15)",
            "esperar(rebajado.value).igualA(68)",
            "precio.value = 100",
            "esperar(rebajado.value).igualA(85)",
            "precio.value = 0",
            "esperar(rebajado.value).igualA(0)",
          ),
        },
        {
          nombre: "y lo que devuelve es una sola cosa, y se lee con punto value",
          codigo: codigo(
            "const salida = usarDescuento(1, 1)",
            "esperar(Object.keys(salida), 'lo que devuelve el composable').tieneLongitud(1)",
            "esperar(salida.rebajado.value, 'el precio rebajado').esDeTipo('number')",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("`unref(x)` es el atajo de `isRef(x) ? x.value : x`. Con eso, dentro de la función da igual qué te hayan pasado.", 0),
    pista("Lo importante es **dónde** se llama a `unref`. Si lo llamas al principio de la función, coges el valor de ese momento y se acabó.", 1),
    pista("Tiene que ir **dentro** de la función de la `computed`. Así se vuelve a leer cada vez que se recalcula, y por eso el computed se entera de que la ref cambió: solo depende de lo que lee mientras se ejecuta.", 2),
  ],
  recompensa: { croquetas: 16 },
}
