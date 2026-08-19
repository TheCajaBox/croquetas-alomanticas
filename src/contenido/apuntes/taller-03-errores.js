/**
 * El apunte de Wax para «taller-03-errores».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Devolver `null` cuando algo va mal parece cómodo y sale caro:",
    "",
    "```js",
    "const restante = retirar(100, 500)   // null",
    "// ...cincuenta líneas después",
    "console.log(restante + 10)           // 10. ¿Y esto de dónde sale?",
    "```",
    "",
    "El problema no es el `null`: es que **el fallo viaja en silencio** y revienta lejos",
    "de donde se produjo. Un error, en cambio, para el programa en el sitio exacto:",
    "",
    "```js",
    "if (cantidad <= 0) {",
    "  throw new Error('La cantidad tiene que ser positiva')",
    "}",
    "```",
    "",
    "`throw` corta la función ahí mismo, como un `return` pero de mala manera: nada de",
    "lo que venga después se ejecuta, y el error sube llamada a llamada hasta que",
    "alguien lo recoja o hasta que se acabe el programa.",
    "",
    "## Recogerlo",
    "",
    "```js",
    "try {",
    "  const restante = retirar(saldo, cantidad)",
    "  return { ok: true, saldo: restante }",
    "} catch (error) {",
    "  return { ok: false, error: error.message }",
    "}",
    "```",
    "",
    "En `try` va lo que puede salir mal. Si algo lanza, se salta el resto del `try` y",
    "entra en `catch` con el error entre las manos. `error.message` es el texto que le",
    "pusiste al `new Error(...)`.",
    "",
    "## Dónde poner cada cosa",
    "",
    "Esta es la parte que no es sintaxis y sí es criterio:",
    "",
    "- **Lanza** en la función que **detecta** el problema. Ella sabe qué ha pasado.",
    "- **Recoge** donde se puede **hacer algo** al respecto: enseñar un aviso,",
    "  reintentar, apuntarlo en el registro.",
    "",
    "Un `try/catch` alrededor de todo, con un `catch` vacío, es peor que no ponerlo:",
    "convierte un fallo ruidoso en un fallo silencioso, y los silenciosos son los que",
    "te tienen tres días buscando.",
)
