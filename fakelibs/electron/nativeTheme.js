/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/native-theme

  Read and respond to changes in Chromium's native color theme.
  Only available in the main process.

  NW.js has no class equivalent to that one, so we gonna need to recreate that
  functionality manually using Node.
*/

class nativeTheme {
    constructor() {
        this._events = {}
        this._themeSource = 'system'
    }

    _send(event) {
        this._events[event] = this._events[event] || []
        this._events[event].forEach(callback => callback(event))
    }

    get shouldUseDarkColors() {
        if (this._themeSource === "dark") return true
        if (this._themeSource === "system") {
            // Check if the system is currently using Dark mode
            return false
        }
        return false // light
    }
    get themeSource() {
        return this._themeSource
    }
    set themeSource(source) {
        this._themeSource = source
        this._send("updated")
    }
    get shouldUseHighContrastColors() {
        return false
    }
    get shouldUseInvertedColorScheme() {
        return false
    }
    get inForcedColorsMode() {
        return false
    }

    on(event, callback) {
        this._events[event] = this._events[event] || []
        this._events[event].push(callback)
    }
}

global.__nwjs_nativeTheme = global.__nwjs_nativeTheme || new nativeTheme()
var _nativeTheme = global.__nwjs_nativeTheme

module.exports = _nativeTheme