<?php

/**
 * El guion que corre dentro del sandbox de PHP.
 *
 * Hace tres cosas, en este orden:
 *
 * 1. **Mira si el código cumple las reglas del reto**, con `token_get_all()`. Se
 *    comprueba aquí y no en JavaScript porque quien sabe de verdad dónde
 *    empieza una palabra clave y dónde una cadena es el propio PHP: buscarlo a
 *    base de expresiones regulares acabaría marcando la palabra «for» dentro de
 *    un comentario.
 * 2. **Incluye el código del jugador**, con la salida capturada: lo que imprima
 *    es su consola, no parte del informe.
 * 3. **Pasa los tests**, cada uno en su try/catch, para que un fallo no se lleve
 *    por delante los que vienen detrás.
 *
 * Todo en un solo proceso: arrancar PHP cuesta un rato y hacerlo una vez por
 * test multiplicaría la espera por siete sin ganar nada.
 */

require '/gatos/aserciones.php';

const MARCA = '__GATOS__';

$codigo = file_get_contents('/gatos/jugador.php');
$tests = json_decode(file_get_contents('/gatos/tests.json'), true) ?: [];
$requisitos = json_decode(file_get_contents('/gatos/requisitos.json'), true) ?: [];

// ---------------------------------------------------------------------------
// 1. Las reglas del reto
// ---------------------------------------------------------------------------

/** Los tokens del código, ya sin comentarios ni espacios en blanco. */
function gatos_tokens(string $codigo): array
{
    $limpios = [];
    foreach (token_get_all($codigo) as $token) {
        if (is_array($token)) {
            if (in_array($token[0], [T_WHITESPACE, T_COMMENT, T_DOC_COMMENT], true)) {
                continue;
            }
            $limpios[] = ['tipo' => token_name($token[0]), 'texto' => $token[1]];
            continue;
        }
        $limpios[] = ['tipo' => 'simbolo', 'texto' => $token];
    }
    return $limpios;
}

function gatos_usa_palabra(array $tokens, string $palabra): bool
{
    foreach ($tokens as $token) {
        if (strcasecmp($token['texto'], $palabra) === 0 && $token['tipo'] !== 'T_CONSTANT_ENCAPSED_STRING') {
            return true;
        }
    }
    return false;
}

/**
 * Cuántas veces aparece una palabra. Para los retos de refactor, que van justo
 * de eso: cuatro `if` donde bastaba uno, tres `foreach` donde bastaba una
 * llamada. Sin poder contar, «no te repitas» no se puede comprobar.
 */
function gatos_cuenta_palabra(array $tokens, string $palabra): int
{
    $veces = 0;
    foreach ($tokens as $token) {
        if (strcasecmp($token['texto'], $palabra) === 0 && $token['tipo'] !== 'T_CONSTANT_ENCAPSED_STRING') {
            $veces += 1;
        }
    }
    return $veces;
}

function gatos_llama_a(array $tokens, string $nombre): bool
{
    foreach ($tokens as $indice => $token) {
        if ($token['tipo'] !== 'T_STRING' || strcasecmp($token['texto'], $nombre) !== 0) {
            continue;
        }
        // Una llamada es un nombre seguido de un paréntesis. Sin eso es una
        // constante, o el nombre de una función que se está definiendo.
        if (($tokens[$indice + 1]['texto'] ?? '') === '(') {
            return true;
        }
    }
    return false;
}

/** Por si un reto declara una regla y se olvida de explicarla. */
function gatos_mensaje_de(string $tipo, string $valor): string
{
    return match ($tipo) {
        'usaPalabra' => "Tiene que aparecer `$valor`.",
        'prohibePalabra' => "Aquí no se puede usar `$valor`.",
        'usaLlamada' => "Tiene que llamar a `$valor()`.",
        'prohibeLlamada' => "Aquí no se puede llamar a `$valor()`.",
        'comoMucho' => "`$valor` no puede aparecer tantas veces.",
        'alMenos' => "`$valor` tiene que aparecer más veces.",
        default => 'Este reto tiene una norma que no se está cumpliendo.',
    };
}

$informeDeRequisitos = [];
$errorDeSintaxis = null;
// `token_get_all` no se queja del código roto: parte lo que puede y sigue. El
// que se queja es `require`, más abajo, y lo hace con un ParseError que sí se
// puede recoger. Así que aquí se tokeniza sin miedo.
$tokens = gatos_tokens($codigo);

foreach ($requisitos as $requisito) {
    $tipo = $requisito['tipo'] ?? '';
    $valor = (string) ($requisito['valor'] ?? '');

    // `veces` solo lo usan `comoMucho` y `alMenos`. Por defecto 1, que es el
    // caso de siempre: «esto aparece una vez y no cuatro».
    $veces = (int) ($requisito['veces'] ?? 1);

    $cumplido = match ($tipo) {
        'usaPalabra' => gatos_usa_palabra($tokens, $valor),
        'prohibePalabra' => !gatos_usa_palabra($tokens, $valor),
        'usaLlamada' => gatos_llama_a($tokens, $valor),
        'prohibeLlamada' => !gatos_llama_a($tokens, $valor),
        'comoMucho' => gatos_cuenta_palabra($tokens, $valor) <= $veces,
        'alMenos' => gatos_cuenta_palabra($tokens, $valor) >= $veces,
        default => true,
    };

    // El campo se llama `mensaje` porque es el que pinta el panel de
    // resultados. Con `texto` salían viñetas vacías: la lista de normas
    // incumplidas estaba ahí, pero sin una palabra dentro.
    $informeDeRequisitos[] = [
        'mensaje' => $requisito['texto'] ?? $requisito['mensaje'] ?? gatos_mensaje_de($tipo, $valor),
        'cumplido' => $cumplido,
        'tipo' => $tipo,
        'valor' => $valor,
    ];
}

// ---------------------------------------------------------------------------
// 2. El código del jugador
// ---------------------------------------------------------------------------

$fatal = null;
$consola = '';

ob_start();
try {
    require '/gatos/jugador.php';
} catch (ParseError $error) {
    // Esto no es un fallo de ejecución: es que lo escrito todavía no es PHP.
    // Merece su propio mensaje y su propia fase, como en JavaScript.
    $errorDeSintaxis = $error->getMessage();
} catch (Throwable $error) {
    $fatal = $error;
}
$consola = ob_get_clean();

// ---------------------------------------------------------------------------
// 3. Los tests
// ---------------------------------------------------------------------------

$resultados = [];

if ($errorDeSintaxis === null && $fatal === null) {
    foreach ($tests as $indice => $test) {
        $fichero = '/gatos/test-' . $indice . '.php';
        file_put_contents($fichero, "<?php\n" . ($test['codigo'] ?? ''));

        $resultado = ['nombre' => $test['nombre'] ?? ('test ' . ($indice + 1)), 'ok' => true];
        ob_start();
        try {
            require $fichero;
        } catch (FalloDeAsercion $fallo) {
            $resultado['ok'] = false;
            $resultado['mensaje'] = $fallo->getMessage();
        } catch (Throwable $error) {
            $resultado['ok'] = false;
            $resultado['mensaje'] = 'Ha reventado al comprobarlo: ' . $error->getMessage();
        }
        ob_end_clean();

        $resultados[] = $resultado;
    }
}

$error = null;
if ($errorDeSintaxis !== null) {
    $error = ['mensaje' => $errorDeSintaxis, 'sintaxis' => true];
} elseif ($fatal !== null) {
    $error = ['mensaje' => $fatal->getMessage(), 'linea' => $fatal->getLine()];
}

echo MARCA . json_encode([
    'tests' => $resultados,
    'consola' => $consola,
    'requisitos' => $informeDeRequisitos,
    'error' => $error,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
