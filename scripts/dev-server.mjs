process.env.NODE_ENV = 'development'

import { fileURLToPath  } from 'url'
import { join, dirname } from 'path'
import { createRequire } from 'module'
import { spawn } from 'child_process'
import { createServer, build } from 'vite'
import electron from 'electron'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const pkg = require('../package.json')

const watchMain = () => {
  let electronProcess = null

  return build({
    configFile: 'scripts/vite.config.mjs',
    root: join(__dirname, '../src/main'),
    build: {
      outDir: '../../dist/main',
      watch: true
    },
    plugins: [{
      name: 'electron-main-watcher',
      writeBundle() {
        if (electronProcess) electronProcess.kill()

        electronProcess = spawn(electron, ['.'], {
          stdio: 'inherit',
          env: Object.assign(process.env, pkg.env)
        })
      }
    }]
  })
}

const watchPreload = server => build({
  configFile: 'scripts/vite.config.mjs',
  root: join(__dirname, '../src/preload'),
  build: {
    outDir: '../../dist/preload',
    watch: true
  },
  plugins: [{
    name: 'electron-reload-watcher',
    writeBundle() {
      server.ws.send({ type: 'full-reload' })
    }
  }]
})

// Server bootstrap
const server = await createServer({ configFile: 'src/renderer/vite.config.ts' })

await server.listen()
await watchPreload(server)
await watchMain()