/**
 * El frente de PHP, que casi no hace nada. Y es a propósito.
 *
 * Las tres cosas que en JavaScript se pueden mirar antes de ejecutar, en PHP se
 * miran dentro del sandbox:
 *
 * - **Si se entiende**: lo dice PHP al incluir el fichero, con un `ParseError`
 *   que trae su propio mensaje. Aquí no hay analizador de PHP, y meter uno para
 *   repetir lo que el motor ya hace sería tener dos opiniones sobre lo mismo.
 * - **Las reglas del reto**: con `token_get_all()`, que es de PHP. Buscar la
 *   palabra `foreach` con expresiones regulares la encontraría dentro de un
 *   comentario o de una cadena, y marcaría por bueno lo que no lo es.
 * - **El bucle sin salida**: no hace falta inyectar nada. El puente ya mata el
 *   worker al agotarse el tiempo, y con eso se corta cualquier cosa.
 *
 * Así que aquí se devuelve el código tal cual y `requisitos: null`, que es la
 * manera de decirle al ejecutor «esto lo trae el sandbox».
 */
export default {
  id: 'php',

  revisar(codigo) {
    return { requisitos: null, codigo }
  },

  /**
   * Y por lo mismo, aquí no hay oído fino: comprobar las reglas mientras se
   * escribe necesitaría un analizador de PHP en el propio juego, y quien sabe de
   * PHP es PHP. Se dice `null` -«no puedo saberlo»- y no `[]`, que sería decir
   * que no falta ninguna.
   */
  enVivo() {
    return null
  },
}
