/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/ipc-main
  https://www.electronjs.org/docs/latest/api/ipc-renderer

  ipcMain:
  Communicate asynchronously from the main process to renderer processes.
  Only available in the main process.
  
  ipcRenderer:
  Communicate asynchronously from a renderer process to the main process.
  Only available in a renderer process.

  Electron's ipcMain and ipcRenderer are used to establish communication between the
  main process and the renderer process in Electron. Although, we are using NW.js's
  "Separate Context Mode", which means that there is only one process for all Node
  related activities, which means we can mimic ipc's behaviour by just using a global
  object.
*/

const BrowserWindowManager = require('./utils/BrowserWindowManager')

global.__nwjs_ipcSharedMemory = global.__nwjs_ipcSharedMemory || {
    send: {},
    invoke: {}
}
var ipcSharedMemory = global.__nwjs_ipcSharedMemory

const ipcRenderer = {
    on(channel, callback) {
        BrowserWindowManager.getCurrentWindow().then(win => win.webContents.on(channel, callback))
        return this
    },
    send(channel, ...args) {
        const event = new Event(channel)
        const win = BrowserWindowManager.getCurrentWindowSync()
        if (win) {
            event.sender = win.webContents
        }
        
        args = args.map((x) => x)
        args.unshift(event)
        
        const callbacks = ipcSharedMemory.send[channel]
        if (callbacks === undefined) {
            return
        }
        callbacks.forEach(callback => callback.apply(null, args))
    },
    sendSync(channel, ...args) {
        const event = new Event(channel)
        const win = BrowserWindowManager.getCurrentWindowSync()
        if (win) {
            event.sender = win.webContents
        }
        
        args = args.map((x) => x)
        args.unshift(event)

        const callback = ipcSharedMemory.send[channel]
        if (callback === undefined || callback.length === 0) {
            return
        }
        const val = callback[0].apply(null, args)
        return val || event.returnValue
    },
    async invoke(channel, ...args) {
        const event = new Event(channel)
        const win = BrowserWindowManager.getCurrentWindowSync()
        if (win) {
            event.sender = win.webContents
        }
        
        args = args.map((x) => x)
        args.unshift(event)

        const callback = ipcSharedMemory.invoke[channel]
        if (callback === undefined) {
            throw new Error(`No function is prepared to answer the invoke of "${channel}" channel`)
        }
        return await callback.apply(null, args)
    }
}

const ipcMain = {
    on(channel, callback) {
        if (ipcSharedMemory.send[channel] === undefined) {
            ipcSharedMemory.send[channel] = []
        }
        ipcSharedMemory.send[channel].push(callback)
    },
    handle(channel, asyncCallback) {
        ipcSharedMemory.invoke[channel] = asyncCallback
    }
}

class IpcMainEvent {

}

module.exports = {ipcRenderer, ipcMain, IpcMainEvent}