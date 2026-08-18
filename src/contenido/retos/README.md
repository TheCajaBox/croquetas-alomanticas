# Cómo se escribe un reto

Cada reto es un módulo con `export default` y estos campos:

| Campo | Qué es |
|---|---|
| `id` | Único en todo el juego. Se usa en la URL y en la partida guardada. |
| `mundo` | `es6`, `vue2` o `vue3`. |
| `entorno` | `worker` (sin DOM), `vue2` o `vue3`. Decide en qué sandbox se ejecuta. |
| `tipo` | `codigo`, `bug`, `prediccion`, `eleccion`, `emparejar`, `ordenar` o `completar`. |
| `titulo`, `enunciado` | El enunciado admite Markdown sencillo. |
| `apunte` | La explicación del concepto, con la voz de Wax. Gratis y siempre visible. **Todos los retos lo llevan.** |
| `inicial` | Código de partida que aparece en el editor. |
| `solucion` | Solución de referencia. Se enseña solo cuando el reto ya está superado. |
| `requisitos` | Comprobaciones sobre el AST, antes de ejecutar. Ver `src/motor/chequeosEstaticos.js`. |
| `tests` | Lista de `{ nombre, codigo }`. |
| `pistas` | Tres, de menos a más reveladora. |
| `recompensa` | `{ croquetas }`. |
| `jefe` | `true` si cierra un mundo. |

## Los tests son cadenas de texto, no funciones

No es un capricho: los tests viajan al sandbox por `postMessage`, y por ahí no
pasan funciones. Cada test es el **código fuente** de su cuerpo.

El código del jugador y el de los tests comparten ámbito. Por eso el enunciado
puede pedir «declara `componente`» y el test lo usa directamente, sin exports:

```js
tests: [
  { nombre: 'devuelve la tarifa de un día', codigo: 'esperar(cobrar(1)).igualA(25)' },
]
```

Dentro de un test tienes disponible:

- `esperar(valor, etiqueta)` → `.igualA` `.noEsIgualA` `.contiene` `.noContiene`
  `.esVerdadero` `.esFalso` `.existe` `.esDeTipo` `.tieneLongitud`
  `.diceLoMismoQue` `.lanzaError`
- `consola` → lo que el código haya escrito con `console.log`
- Solo en los entornos de Vue: `montar(opciones)` y `siguienteTick()`

`montar` devuelve un mando a distancia del componente ya pintado: `texto(sel)`,
`textos(sel)`, `html(sel)`, `existe(sel)`, `contar(sel)`, `valor(sel)`,
`click(sel)`, `escribir(sel, texto)`, `vm` y `siguienteTick()`. Todo lo que
cambia el DOM devuelve una promesa: hay que esperarlo con `await`.

## Retos que no se escriben

Cuatro tipos se resuelven señalando y colocando, no tecleando:

- **`eleccion`** — trae `pregunta` y `opciones: [{ texto, correcta, porque }]`. El `porque`
  es obligatorio en **todas**, también en las falsas: media enseñanza está en entender por
  qué la que descartaste estaba mal. Si hay más de una `correcta`, el reto pasa solo a
  selección múltiple.
- **`emparejar`** — trae `parejas: [{ izquierda, derecha }]`. Las dos columnas se barajan
  con una semilla fija, así que el reto sale igual cada vez que se abre.
- **`ordenar`** — trae `lineas` en el orden correcto. Se barajan, el jugador las recoloca y
  al enviar **se ejecuta el código en el orden que haya puesto**, con sus `tests`. No se
  compara con la respuesta: se ejecuta, y así el que falla ve qué se rompe.
- **`completar`** — trae `plantilla` con huecos marcados `___`, un montón de `fichas` (con
  alguna de más, para que no salga por descarte) y una `solucion` de referencia para las
  pruebas. Al enviar también se ejecuta de verdad.

## Retos de predicción

Los de tipo `prediccion` no traen `inicial`. Traen `codigoMostrado` (que el
jugador lee pero no toca) y `respuestaEsperada` (el texto exacto que debería
salir). Al responder se ejecuta el código de verdad para que el jugador compare
su predicción con lo que pasa realmente.
