import { readFileSync } from 'node:fs'
import { PHP } from '@php-wasm/universal'
import { loadNodeRuntime } from '@php-wasm/node'
const php = new PHP(await loadNodeRuntime('8.5', { emscriptenOptions: { processId: 1 } }))
php.mkdir('/g')
php.writeFile('/g/x.php', readFileSync(process.argv[2], 'utf8'))
const salida = await php.runStream({ scriptPath: '/g/x.php' })
process.stdout.write(await salida.stdoutText)
process.exit(0)
