/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/web-contents

  NW.js Docs
  https://docs.nwjs.io/en/latest/References/Window/
  https://developer.chrome.com/docs/extensions/reference/tabs/#type-Tab
  https://developer.chrome.com/blog/cut-and-copy-commands/

  Render and control web pages.
  Only available in the main process.

  NW.js's Window actually represents Electron's BrowserWindow and WebContents,
  so both BrowserWindow and WebContents need to make use of it.
*/

const BrowserWindowManager = require('./utils/BrowserWindowManager')
const DownloadItem = require('./utils/DownloadItem')
const throwUnsupportedException = require('./utils/unsupported-exception')

class WebContents {
    _eventsRequestCache = {}
    _events = {}
    

    constructor(win, opts) {
        const id = Math.floor(Math.random() * 1000000000)
        
        this._id = id
        this._window = win
        this._session = opts.session

        this._zoomFactor = opts.zoomFactor
        if (this._zoomFactor !== 1.0) {
            this.setZoomFactor(this._zoomFactor)
        }
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
    get session() {
        return this._session
    }
    get zoomFactor() {
        return this.getZoomFactor()
    }
    set zoomFactor(factor) {
        this.setZoomFactor(factor)
    }
    get zoomLevel() {
        return this.getZoomLevel()
    }
    set zoomLevel(level) {
        this.setZoomLevel(level)
    }
    getURL() {
        return this._window._getChromeWindow().tabs[0].url
    }
    getTitle() {
        return this._window._getChromeWindow().tabs[0].title
    }
    isDestroyed() {
        return this._window.isDestroyed()
    }
    focus() {
        return this._window.focus()
    }
    isFocused() {
        return this._window.isFocused()
    }
    isLoading() {
        return this._window._getChromeWindow().tabs[0].status === "loading"
    }
    reload() {
        return this._window.reload()
    }
    _zoomLevelFromZoomFactor(factor) {
        return (Math.log(1.2) / Math.log(factor)) + 1
    }
    _zoomFactorFromZoomLevel(level) {
        return Math.pow(1.2, level - 1)
    }
    setZoomFactor(factor) {
        let level = this._zoomLevelFromZoomFactor(factor)
        this.setZoomLevel(level)
    }
    getZoomFactor() {
        if (this._window.window === undefined) {
            return this._zoomFactor
        }
        return this._zoomFactorFromZoomLevel(this.getZoomLevel())
    }
    setZoomLevel(level) {
        this._zoomFactor = this._zoomFactorFromZoomLevel(level)
        this._window._getWindow().then(nwjsWin => {
            nwjsWin.zoomLevel = level
        })
    }
    getZoomLevel() {
        return this._window.window?.zoomLevel ?? this._zoomLevelFromZoomFactor(this._zoomFactor)
    }

    undo() {
        this._window._getDocument().then(document => document.execCommand('undo'))
    }
    redo() {
        this._window._getDocument().then(document => document.execCommand('redo'))
    }
    cut() {
        this._window._getDocument().then(document => document.execCommand('cut'))
    }
    copy() {
        this._window._getDocument().then(document => document.execCommand('copy'))
    }
    // copyImageAt
    paste() {
        this._window._getDocument().then(document => document.execCommand('paste'))
    }
    // pasteAndMatchStyle
    delete() {
        this._window._getDocument().then(document => document.execCommand('delete'))
    }
    selectAll() {
        this._window._getDocument().then(document => document.execCommand('selectAll'))
    }
    // unselect
    // replace
    // replaceMisspelling
    async insertText(text) {
        (await this._window._getDocument()).execCommand('insertText', false, text)
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
        this._session.emit('will-download', 
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