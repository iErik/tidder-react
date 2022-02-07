import { app, BrowserWindow, shell } from 'electron'
import { release } from 'os'
import { join } from 'path'

let mainWindow = null

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 660,
    minWidth: 960,
    minHeight: 260,

    show: false,
    // frame: false
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs')
    }
  })

  if (app.isPackaged) {
    mainWindow.loadFile(join(__dirname, '../renderer.index.html'))
  } else {
    const pkg = await import('../../package.json')
    const url = `http://${pkg.env.HOST || '127.0.0.1'}:${pkg.env.PORT}`

    mainWindow.loadURL(url)
    mainWindow.webContents.openDevTools()
  }

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Make all links open in the browser, not in the app itself
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  mainWindow = null

  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()

  if (allWindows.length) allWindows[0].focus()
  else createWindow()
})

app.on('second-instance', () => {
  if (mainWindow) mainWindow.isMinimized()
    ? mainWindow.restore()
    : mainWindow.focus()
})