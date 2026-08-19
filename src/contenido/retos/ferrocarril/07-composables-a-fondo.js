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
  pistas: [
    pista("`unref(x)` es el atajo de `isRef(x) ? x.value : x`. Con eso, dentro de la función da igual qué te hayan pasado.", 0),
    pista("Lo importante es **dónde** se llama a `unref`. Si lo llamas al principio de la función, coges el valor de ese momento y se acabó.", 1),
    pista("Tiene que ir **dentro** de la función de la `computed`. Así se vuelve a leer cada vez que se recalcula, y por eso el computed se entera de que la ref cambió: solo depende de lo que lee mientras se ejecuta.", 2),
  ],
  recompensa: { croquetas: 16 },
}
