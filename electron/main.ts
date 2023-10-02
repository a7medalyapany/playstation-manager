import { app, BrowserWindow } from 'electron'
import path from 'node:path'

import { Ipc } from './ipc'
import { Sql } from './sqlite3'
const storage = require('electron-json-storage');


// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let ipc: Ipc;
const sql: Sql = Sql.getInstance();
let win: BrowserWindow | null = null

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    minHeight: 900,
    minWidth: 1300,
    show: false,
    icon: path.join(process.env.VITE_PUBLIC, 'logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: false,
      nodeIntegration: false,
    },
  })

  // win.webContents.openDevTools({
  //   mode: 'undocked'
  // })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
  win.once('ready-to-show', () => {
    win!.show()
  })
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  createWindow();

  ipc = new Ipc(win!, sql);
  if (ipc){
    console.log('IPC instance created successfully!')
  } else {
    console.log('Failed to create IPC instance.')
  }

  sql.createTables();

  storage.has('myData', function (error: any, hasData: boolean) {
    if (error) throw error;

    if (!hasData) {
      // Data doesn't exist, initialize it
      storage.set('myData', {
        credentials: {
          userName: 'admin',
          password: 'password',
        },
        prices: {
          PS3: {
            price: 15,
          },
          PS4: {
            price: 20,
          },
          PS5: {
            price: 25,
          },
        },
      }, function (error: any) {
        if (error) throw error;
      });
    }
  });
})
