import { codigo } from '../comun.js'
import { SELLOS } from '../tablas-de-sel.js'

export default {
  id: "grieta-12-el-registro-publico",
  mundo: "grieta",
  entorno: "sql",
  tipo: "codigo",
  titulo: "Jefe: el registro público",
  jefe: true,
  enunciado: codigo(
    "Todo el mundo junto, y sin pistas. Tres entradas, y las tres traen ataque.",
    "",
    "El registro público lista, para la clase de sello que entra en `:clase`:",
    "",
    "- el `nombre` del arbitrador,",
    "- y `cuantas`: cuántas firmas **no secretas** ha hecho con un sello de esa clase que",
    "  **no esté revocado**, contando solo los documentos cuyo nombre contenga el trozo que",
    "  entra en `:parte`.",
    "",
    "Y solo salen los que lleguen al mínimo que entra en `:minimo`. Ordenado por `cuantas` de",
    "más a menos y, a igualdad, por `nombre` alfabéticamente.",
    "",
    "Los que tienen un sello de esa clase y **ninguna** firma que cuente tienen que salir con",
    "un cero si el mínimo lo permite: por eso la unión con las firmas es por la izquierda, y",
    "por eso las condiciones de la firma —que no sea secreta, que el documento encaje— van",
    "**dentro del `ON`** y no en el `WHERE`. Puestas en el `WHERE`, esas filas desaparecen.",
    "",
    "Las tres entradas van como parámetros. El trozo del documento se busca con `LIKE`, y el",
    "patrón se monta pegando los porcentajes al parámetro con `||`: los comodines los pone tu",
    "consulta, no el valor.",
  ),
  esquema: SELLOS.esquema,
  datos: SELLOS.datos,
  entradas: { clase: "menor' OR '1'='1", parte: "' UNION SELECT nombre FROM arbitradores --", minimo: 0 },
  inicial: codigo(
    "-- Lo que entra:",
    "--   clase  = menor' OR '1'='1",
    "--   parte  = ' UNION SELECT nombre FROM arbitradores --",
    "--   minimo = 0",
    "-- Pegado dentro, cada uno abre su grieta: el primero anula el WHERE y el",
    "-- segundo cuela otra consulta.",
    "SELECT a.nombre, COUNT(f.id) AS cuantas",
    "FROM arbitradores a",
    "JOIN sellos s ON s.arbitrador_id = a.id AND s.revocado = 0",
    "LEFT JOIN firmas f ON f.sello_id = s.id",
    "  AND f.secreto = 0",
    "  AND f.documento LIKE '%'",
    "WHERE s.clase = 'menor' OR '1'='1'",
    "GROUP BY a.id, a.nombre",
    "HAVING COUNT(f.id) >= 0",
    "ORDER BY cuantas DESC, a.nombre ASC;",
  ),
  solucion: codigo(
    "SELECT a.nombre, COUNT(f.id) AS cuantas",
    "FROM arbitradores a",
    "JOIN sellos s ON s.arbitrador_id = a.id AND s.revocado = 0",
    "LEFT JOIN firmas f ON f.sello_id = s.id",
    "  AND f.secreto = 0",
    "  AND f.documento LIKE '%' || :parte || '%'",
    "WHERE s.clase = :clase",
    "GROUP BY a.id, a.nombre",
    "HAVING COUNT(f.id) >= :minimo",
    "ORDER BY cuantas DESC, a.nombre ASC;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: ":clase", texto: "La clase entra como parámetro" },
    { tipo: "usaPalabra", valor: ":parte", texto: "El trozo del documento, también" },
    { tipo: "usaPalabra", valor: ":minimo", texto: "Y el mínimo" },
    { tipo: "usaPalabra", valor: "LEFT JOIN", texto: "Los que no tienen firmas que cuenten salen con cero" },
    { tipo: "usaPalabra", valor: "HAVING", texto: "El mínimo se aplica al resultado de contar" },
    { tipo: "prohibeAsterisco", texto: "Las columnas, por su nombre" },
  ],
  tests: [
    {
      nombre: "el ataque de la clase no devuelve nada: no hay ninguna clase que se llame así",
      codigo: "esperar(filas, 'las filas').tieneLongitud(0)",
    },
    {
      nombre: "el ataque no está pegado en la consulta",
      codigo: codigo(
        "const escrita = consultaEscrita",
        "esperar(escrita, 'la consulta').noContiene(\"'1'='1\")",
        "esperar(escrita, 'la consulta').noContiene('UNION')",
        "esperar(escrita, 'la consulta').noContiene('--')",
      ),
    },
    {
      nombre: "los tres parámetros están en la consulta",
      codigo: codigo(
        "esperar(consultaEscrita, 'la consulta').contiene(':clase')",
        "esperar(consultaEscrita, 'la consulta').contiene(':parte')",
        "esperar(consultaEscrita, 'la consulta').contiene(':minimo')",
      ),
    },
    {
      nombre: "las condiciones de la firma van dentro del ON y no en el WHERE",
      codigo: codigo(
        "const sinEspacios = consultaEscrita.replace(/\\s+/g, ' ')",
        "const desdeWhere = sinEspacios.slice(sinEspacios.indexOf('WHERE'))",
        "esperar(desdeWhere, 'lo que va del WHERE en adelante').noContiene('secreto')",
        "esperar(desdeWhere, 'lo que va del WHERE en adelante').noContiene('LIKE')",
      ),
    },
    {
      nombre: "el filtro de los sellos revocados sigue escrito",
      codigo: "esperar(consultaEscrita.replace(/\\s+/g, ' '), 'la consulta').contiene('revocado = 0')",
    },
    {
      nombre: "y el de las firmas secretas también",
      codigo: "esperar(consultaEscrita.replace(/\\s+/g, ' '), 'la consulta').contiene('secreto = 0')",
    },
  ],
  variantes: [
    {
      titulo: "El registro público · los sellos menores",
      entradas: { clase: "menor", parte: "", minimo: 0 },
      tests: [
        {
          nombre: "Gaotona y d'Alai, con una firma cada uno",
          codigo: codigo(
            "esperar(filas.map((f) => f.nombre), 'los nombres').igualA(['Gaotona', \"d'Alai\"])",
            "esperar(filas.map((f) => f.cuantas), 'las cuentas').igualA([1, 1])",
          ),
        },
        {
          nombre: "el ataque del sello revocado: quien lo tiene revocado no sale, aunque haya firmado",
          codigo: codigo(
            "esperar(filas.map((f) => f.nombre), 'los nombres').noContiene(\"Robert'); DROP TABLE sellos; --\")",
            "// Y tiene un sello menor y una firma pública. Lo que no tiene es el sello en pie.",
            "const suyas = consulta(\"SELECT f.id FROM firmas f JOIN sellos s ON s.id = f.sello_id WHERE s.arbitrador_id = 5 AND f.secreto = 0\")",
            "esperar(suyas, 'sus firmas públicas').tieneLongitud(1)",
          ),
        },
        {
          nombre: "las dos columnas y en su orden",
          codigo: "esperar(columnas, 'las columnas').igualA(['nombre', 'cuantas'])",
        },
      ],
    },
    {
      titulo: "El registro público · el cero de quien no encaja",
      entradas: { clase: "menor", parte: "catastro", minimo: 0 },
      tests: [
        {
          nombre: "d'Alai con una y Gaotona con cero: el cero también sale",
          codigo: codigo(
            "esperar(filas.map((f) => f.nombre), 'los nombres').igualA([\"d'Alai\", 'Gaotona'])",
            "esperar(filas.map((f) => f.cuantas), 'las cuentas').igualA([1, 0])",
          ),
        },
        {
          nombre: "el ataque del WHERE: si las condiciones de la firma se van al WHERE, el cero desaparece",
          codigo: codigo(
            "esperar(filas, 'las filas').tieneLongitud(2)",
          ),
        },
      ],
    },
    {
      titulo: "El registro público · con mínimo",
      entradas: { clase: "menor", parte: "catastro", minimo: 1 },
      tests: [
        {
          nombre: "con el mínimo en uno, el cero se cae",
          codigo: codigo(
            "esperar(filas, 'las filas').tieneLongitud(1)",
            "esperar(filas[0].nombre, 'el nombre').igualA(\"d'Alai\")",
            "esperar(filas[0].cuantas, 'la cuenta').igualA(1)",
          ),
        },
      ],
    },
    {
      titulo: "El registro público · los imperiales",
      entradas: { clase: "imperial", parte: "", minimo: 0 },
      tests: [
        {
          nombre: "solo Gaotona: el imperial de Frava está revocado",
          codigo: codigo(
            "esperar(filas.map((f) => f.nombre), 'los nombres').igualA(['Gaotona'])",
          ),
        },
        {
          nombre: "y su firma secreta no se cuenta: tiene dos firmas y sale una",
          codigo: codigo(
            "esperar(filas[0].cuantas, 'la cuenta').igualA(1)",
            "const todas = consulta('SELECT id FROM firmas WHERE sello_id = 1')",
            "esperar(todas, 'todas sus firmas con ese sello').tieneLongitud(2)",
          ),
        },
      ],
    },
    {
      titulo: "El registro público · un nombre con apóstrofo dentro",
      entradas: { clase: "menor", parte: "copia", minimo: 1 },
      tests: [
        {
          nombre: "el escriba del apóstrofo sale sin romper nada",
          codigo: codigo(
            "esperar(filas, 'las filas').tieneLongitud(1)",
            "esperar(filas[0].nombre, 'el nombre').igualA(\"d'Alai\")",
          ),
        },
      ],
    },
  ],
  recompensa: { croquetas: 13 },
}
