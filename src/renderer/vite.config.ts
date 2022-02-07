import { join } from 'path'
import { builtinModules } from 'module'
import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import resolve from 'vite-plugin-resolve'
import pkg from '../../package.json'

export default defineConfig({
  mode: process.env.NODE_ENV,
  root: __dirname,
  plugins: [
    react(),
  ],
  base: './',
  build: {
    emptyOutDir: true,
    outDir: '../../dist/renderer'
  },
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
      'src': join(__dirname, '../../src')
    }
  },
  server: {
    host: pkg.env.HOST,
    port: pkg.env.PORT
  }
})

// I have no idea what this does
export function resolveElectron (resolves: Parameters<typeof resolve>[0] = {}): Plugin {
  const builtIns = builtinModules.filter(t => !t.startsWith('_'))

  const electronExport = () =>
    `
    /**
     * All exports module see https://www.electronjs.org -> API -> Renderer Process Modules
     */
    const electron = require("electron");
    const {
      clipboard,
      nativeImage,
      shell,
      contextBridge,
      crashReporter,
      ipcRenderer,
      webFrame,
      desktopCapturer,
      deprecate,
    } = electron;
    
    export {
      electron as default,
      clipboard,
      nativeImage,
      shell,
      contextBridge,
      crashReporter,
      ipcRenderer,
      webFrame,
      desktopCapturer,
      deprecate,
    }
    `

  const builtinModulesExport = (modules: string[]) => modules
    .map(moduleId => {
      const nodeModule = require(moduleId)
      const requireModule = `const M = require("${moduleId}");`
      const exportDefault = `export default M;`
      const exportMembers = Object.keys(nodeModule)
        .map(attr => `export const ${attr} = M.${attr}`).join(';\n') + 'l'
      const nodeModuleCode = `
        ${requireModule}
        ${exportDefault}
        ${exportMembers}
      `

      return { [moduleId]: nodeModuleCode }
    })
    .reduce((memo, item) => Object.assign(memo, item), {})

  return resolve({
    electron: electronExport(),
    ...builtinModulesExport(builtIns),
    ...resolves
  })

}