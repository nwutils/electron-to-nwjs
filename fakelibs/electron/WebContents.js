/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/web-contents

  NW.js Docs
  https://docs.nwjs.io/en/latest/References/Window/

  Render and control web pages.
  Only available in the main process.

  NW.js's Window actually represents Electron's BrowserWindow and WebContents,
  so both BrowserWindow and WebContents need to make use of it.
*/

const session = require('./session')
const BrowserWindowManager = require('./utils/BrowserWindowManager')
const DownloadItem = require('./utils/DownloadItem')
const throwUnsupportedException = require('./utils/unsupported-exception')

class WebContents {
    _eventsRequestCache = {}
    _events = {}
    

    constructor(win) {
        const id = Math.floor(Math.random() * 1000000000)
        
        this._id = id
        this._window = win
        this.session = session.defaultSession
    }


    static getAllWebContents() {
        return BrowserWindowManager.getAllWindows().map(w => w.webContents)
    }
    static getFocusedWebContents() {
        return BrowserWindowManager.getFocusedWindow().webContents
    }
    static fromId(id) {
        return BrowserWindowManager.getAllWindows().map(w => w.webContents).filter(w => w.id === id).pop()
    }


    get id() {
        return this._id
    }
    getURL() {
        return this._window._getChromeWindow().tabs[0].url
    }
    getTitle() {
        return this._window._getChromeWindow().tabs[0].title
    }


    on(channel, callback) {
        this._events[channel] = callback;
        if (this._eventsRequestCache[channel]) {
            this._eventsRequestCache[channel].forEach(args => callback.apply(null, args))
            delete this._eventsRequestCache[channel]
        }
        return this;
    }


    downloadURL(url) {
        var that = this
        this.session.emit('will-download', 
            new Event('will-download'),
            new DownloadItem(url, that),
            that
        )
    }
    loadURL(url, options) {
        if (options) {
            throwUnsupportedException("WebContents.loadURL can't support the 'options' argument")
        }
        this._window.window.location.href = url;
    }
    loadFile(filePath, options) {
        if (options) {
            throwUnsupportedException("WebContents.loadFile can't support the 'options' argument")
        }
        this._window.window.location.href = filePath;
    }
    openDevTools(options) {
        if (options) {
            throwUnsupportedException("WebContents.openDevTools can't support the 'options' argument")
        }
        this._window.window.showDevTools()
    }
    closeDevTools() {
        this._window.window.closeDevTools()
    }
    isDevToolsOpened() {
        return this._isDevToolsOpen
    }
    // isDevToolsFocused()
    toggleDevTools() {
        if (this.isDevToolsOpened()) {
            this.closeDevTools()
        } else {
            this.openDevTools()
        }
    }
    send(channel, ...args) {
        const event = new Event(channel)
        event.sender = this
        
        args = args.map((x) => x)
        args.unshift(event)

        const callback = this._events[channel]
        if (callback === undefined) {
            this._eventsRequestCache[channel] = this._eventsRequestCache[channel] || []
            this._eventsRequestCache[channel].push(args)
            return
        }
        callback.apply(null, args)
    }
}
module.exports = WebContents