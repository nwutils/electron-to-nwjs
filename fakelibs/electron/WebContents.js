const session = require('./session')
const BrowserWindowManager = require('./utils/BrowserWindowManager')
const throwUnsupportedException = require('./utils/unsupported-exception')

class WebContents {
    _eventsRequestCache = {}
    _events = {}
    

    constructor(win) {
        this._window = win
        
        this.session = session.defaultSession
    }


    static getFocusedWebContents() {
        return BrowserWindowManager.getFocusedWindow().webContents
    }


    on(channel, callback) {
        this._events[channel] = callback;
        if (this._eventsRequestCache[channel]) {
            this._eventsRequestCache[channel].forEach(args => callback.apply(null, args))
            delete this._eventsRequestCache[channel]
        }
        return this;
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