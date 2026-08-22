import { codigo, pista } from '../comun.js'

export default {
  id: "tripulacion-11-las-piezas-del-array",
  mundo: "tripulacion",
  entorno: "php",
  tipo: "emparejar",
  titulo: "Preguntarle cosas a un array",
  enunciado: codigo(
    "Antes de recorrer un array casi siempre hay que preguntarle algo: si está vacío, si tiene",
    "una clave, si contiene un valor. PHP trae una función para cada pregunta y usar la de al",
    "lado es un fallo clásico.",
    "",
    "Empareja cada una con lo que hace.",
  ),
  parejas: [
    { izquierda: "count", derecha: "Cuántos elementos hay" },
    { izquierda: "array_key_exists", derecha: "Si esa clave está, aunque su valor sea null" },
    { izquierda: "isset", derecha: "Si esa clave está **y** su valor no es null" },
    { izquierda: "in_array", derecha: "Si ese valor está en algún sitio de la lista" },
    { izquierda: "array_keys", derecha: "La lista de los nombres, sin los valores" },
    { izquierda: "array_values", derecha: "La lista de los valores, perdiendo los nombres" },
  ],
  pistas: [
    pista("Dos preguntan por una clave y se diferencian en una sola cosa: qué contestan cuando el valor guardado es `null`.", 0),
    pista("Dos devuelven una lista nueva: una se queda con los nombres y la otra con los contenidos.", 1),
    pista("`in_array` busca **valores**, no claves. Es el error más repetido de los seis: con un inventario `['acero' => 4]`, `in_array('acero', $inv)` es `false`.", 2),
  ],
  recompensa: { croquetas: 6 },
}
