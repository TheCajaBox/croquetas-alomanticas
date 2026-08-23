import { codigo, pista } from '../comun.js'

export default {
  id: "sello-04-el-registro-que-canta",
  mundo: "sello",
  entorno: "worker",
  tipo: "cazar-linea",
  titulo: "El registro que canta",
  enunciado: codigo(
    "Este código guarda las contraseñas bien: las hashea y no las almacena. Y aun así, el día",
    "que alguien se lleve los ficheros de registro del servidor tendrá todas las contraseñas",
    "en texto claro.",
    "",
    "**Una línea** lo estropea todo. Encuéntrala.",
  ),
  codigoMostrado: codigo(
    "function alta(usuario, clave) {",
    "  if (clave.length < 8) {",
    "    apuntar('alta rechazada: ' + usuario + ' (clave corta)')",
    "    return null",
    "  }",
    "  const huella = hashLento(clave, 1000)",
    "  apuntar(`alta de ${usuario} con clave ${clave}`)",
    "  cuentas.push({ usuario, huella })",
    "  apuntar('alta correcta: ' + usuario)",
    "  return { usuario }",
    "}",
  ),
  errorMostrado:
    "No hay error. El código funciona, pasa sus pruebas y no guarda ni una contraseña en la base de datos.",
  lineaCulpable: 7,
  explicaciones: {
    2: "Comprobar la longitud mínima está bien y aquí no cuenta nada de más: no escribe la clave en ningún sitio.",
    3: "Apunta que se ha rechazado un alta y por qué, con el nombre de usuario. Eso es lo que un registro tiene que apuntar.",
    6: "Aquí está bien hecho lo importante: se calcula la huella con el hash lento y la contraseña no se guarda en la cuenta.",
    7: "Aquí. La contraseña acaba de escribirse **en el registro**, en texto claro, con el nombre del usuario al lado. Da igual lo bien que se guarde en la base de datos: el fichero de registro lo lee cualquiera que tenga acceso al servidor, se copia a las herramientas de vigilancia, se envía a terceros y se guarda durante meses. Un registro es una base de datos más, y casi nunca se protege como tal.",
    8: "Guarda la cuenta con el usuario y la huella. Justo lo que hay que guardar y nada más.",
    9: "Apunta que el alta salió bien, con el usuario. Sin la clave. Así se hace.",
  },
  pistas: [
    pista("El código no falla. Lo que hay que buscar es una línea que **cuenta** algo de más.", 0),
    pista("Hay cuatro líneas que escriben en el registro. Tres apuntan lo que hay que apuntar.", 1),
    pista(
      "Mira qué mete cada `apuntar` dentro del texto. Una de las cuatro mete algo que no debería salir nunca de esa función.",
      2,
    ),
  ],
  recompensa: { croquetas: 5 },
}
