<?php

/**
 * Las aserciones de los retos de PHP.
 *
 * Mismos nombres y **mismas palabras** que `public/sandbox/aserciones.js`: quien
 * juega no tiene por qué notar que detrás hay dos motores distintos, y un
 * mensaje de fallo redactado de otra manera se lee como otro juego.
 *
 * Se escribe como fichero .php de verdad -y no como una cadena dentro del
 * worker- para poder leerlo y tocarlo como PHP. El worker lo mete con `?raw`.
 */

declare(strict_types=0);

final class FalloDeAsercion extends Exception
{
}

function gatos_describir(mixed $valor): string
{
    if (is_string($valor)) {
        return '"' . $valor . '"';
    }
    if ($valor === null) {
        return 'null';
    }
    if (is_bool($valor)) {
        return $valor ? 'true' : 'false';
    }
    if (is_float($valor) && is_nan($valor)) {
        return 'NAN';
    }
    if (is_array($valor)) {
        return json_encode($valor, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    if (is_object($valor)) {
        return 'un ' . get_class($valor);
    }
    if (is_callable($valor)) {
        return 'una función';
    }
    return (string) $valor;
}

/** Igualdad profunda: los retos comparan arrays constantemente. */
function gatos_son_iguales(mixed $a, mixed $b): bool
{
    if (is_float($a) && is_float($b) && is_nan($a) && is_nan($b)) {
        return true;
    }
    if (is_array($a) && is_array($b)) {
        if (count($a) !== count($b)) {
            return false;
        }
        foreach ($a as $clave => $valor) {
            if (!array_key_exists($clave, $b) || !gatos_son_iguales($valor, $b[$clave])) {
                return false;
            }
        }
        return true;
    }
    return $a === $b;
}

function gatos_fallar(string $mensaje): void
{
    throw new FalloDeAsercion($mensaje);
}

function gatos_normalizar(mixed $texto): string
{
    return trim(preg_replace('/\s+/u', ' ', (string) $texto));
}

final class Comprobador
{
    public function __construct(private mixed $valor, private string $nombre = 'el valor')
    {
    }

    public function igualA(mixed $esperado): void
    {
        if (!gatos_son_iguales($this->valor, $esperado)) {
            gatos_fallar(
                'Esperaba que ' . $this->nombre . ' fuera ' . gatos_describir($esperado)
                . ', pero es ' . gatos_describir($this->valor) . '.'
            );
        }
    }

    public function noEsIgualA(mixed $prohibido): void
    {
        if (gatos_son_iguales($this->valor, $prohibido)) {
            gatos_fallar(
                'Esperaba que ' . $this->nombre . ' NO fuera ' . gatos_describir($prohibido) . ', pero lo es.'
            );
        }
    }

    public function contiene(mixed $parte): void
    {
        if (!$this->tieneDentro($parte)) {
            gatos_fallar(
                'Esperaba que ' . $this->nombre . ' contuviera ' . gatos_describir($parte)
                . ', pero es ' . gatos_describir($this->valor) . '.'
            );
        }
    }

    public function noContiene(mixed $parte): void
    {
        if ($this->tieneDentro($parte)) {
            gatos_fallar(
                'Esperaba que ' . $this->nombre . ' NO contuviera ' . gatos_describir($parte) . ', pero sí.'
            );
        }
    }

    public function esVerdadero(): void
    {
        if ($this->valor !== true) {
            gatos_fallar('Esperaba que ' . $this->nombre . ' fuera true, pero es ' . gatos_describir($this->valor) . '.');
        }
    }

    public function esFalso(): void
    {
        if ($this->valor !== false) {
            gatos_fallar('Esperaba que ' . $this->nombre . ' fuera false, pero es ' . gatos_describir($this->valor) . '.');
        }
    }

    public function existe(): void
    {
        if ($this->valor === null) {
            gatos_fallar('Esperaba que ' . $this->nombre . ' existiera, pero es null.');
        }
    }

    public function esDeTipo(string $tipo): void
    {
        $suyo = get_debug_type($this->valor);
        if ($suyo !== $tipo) {
            gatos_fallar('Esperaba que ' . $this->nombre . ' fuera de tipo ' . $tipo . ', pero es ' . $suyo . '.');
        }
    }

    public function tieneLongitud(int $largo): void
    {
        $suyo = is_countable($this->valor) ? count($this->valor) : strlen((string) $this->valor);
        if ($suyo !== $largo) {
            gatos_fallar('Esperaba que ' . $this->nombre . ' tuviera ' . $largo . ' elementos, pero tiene ' . $suyo . '.');
        }
    }

    /** Compara texto sin que sobren ni falten espacios: es lo que se mira al imprimir. */
    public function diceLoMismoQue(mixed $esperado): void
    {
        if (gatos_normalizar($this->valor) !== gatos_normalizar($esperado)) {
            gatos_fallar(
                'Esperaba que ' . $this->nombre . ' dijera ' . gatos_describir($esperado)
                . ', pero dice ' . gatos_describir($this->valor) . '.'
            );
        }
    }

    /** El valor tiene que ser un callable que reviente al llamarlo. */
    public function lanzaError(): void
    {
        if (!is_callable($this->valor)) {
            gatos_fallar('Para comprobar que algo falla hay que pasar una función, no ' . gatos_describir($this->valor) . '.');
        }
        try {
            ($this->valor)();
        } catch (Throwable $error) {
            return;
        }
        gatos_fallar('Esperaba que ' . $this->nombre . ' lanzara un error, y no ha lanzado ninguno.');
    }

    private function tieneDentro(mixed $parte): bool
    {
        if (is_array($this->valor)) {
            foreach ($this->valor as $elemento) {
                if (gatos_son_iguales($elemento, $parte)) {
                    return true;
                }
            }
            return false;
        }
        return is_string($this->valor) && str_contains($this->valor, (string) $parte);
    }
}

function esperar(mixed $valor, string $nombre = 'el valor'): Comprobador
{
    return new Comprobador($valor, $nombre);
}
