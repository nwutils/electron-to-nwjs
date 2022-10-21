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

    _matchMedia(media) {
        if (window && window.matchMedia) {
            return window.matchMedia(media).matches
        }
        return false
    }
    get shouldUseDarkColors() {
        if (this._themeSource === "dark") return true
        if (this._themeSource === "system") {
            return this._matchMedia('(prefers-color-scheme: dark)')
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
        return this._matchMedia('(-ms-high-contrast: active)')
    }
    get shouldUseInvertedColorScheme() {
        return this._matchMedia('(inverted-colors: inverted)')
    }
    get inForcedColorsMode() {
        return this._matchMedia('(forced-colors: active)')
    }

    on(event, callback) {
        this._events[event] = this._events[event] || []
        this._events[event].push(callback)
    }
}

global.__nwjs_nativeTheme = global.__nwjs_nativeTheme || new nativeTheme()
var _nativeTheme = global.__nwjs_nativeTheme

if (__nwjs_is_main) {
    var _nativeThemeLastResult = {
        shouldUseDarkColors: _nativeTheme.shouldUseDarkColors,
        shouldUseHighContrastColors: _nativeTheme.shouldUseHighContrastColors,
        shouldUseInvertedColorScheme: _nativeTheme.shouldUseInvertedColorScheme,
        inForcedColorsMode: _nativeTheme.inForcedColorsMode
    }
    setInterval(function() {
        const shouldUseDarkColors = _nativeTheme.shouldUseDarkColors
        const shouldUseHighContrastColors = _nativeTheme.shouldUseHighContrastColors
        const shouldUseInvertedColorScheme = _nativeTheme.shouldUseInvertedColorScheme
        const inForcedColorsMode = _nativeTheme.inForcedColorsMode

        const changed = shouldUseDarkColors !== _nativeThemeLastResult.shouldUseDarkColors ||
                        shouldUseHighContrastColors !== _nativeThemeLastResult.shouldUseHighContrastColors ||
                        shouldUseInvertedColorScheme !== _nativeThemeLastResult.shouldUseInvertedColorScheme ||
                        inForcedColorsMode !== _nativeThemeLastResult.inForcedColorsMode
        if (changed) {
            _nativeThemeLastResult.shouldUseDarkColors = shouldUseDarkColors
            _nativeThemeLastResult.shouldUseHighContrastColors = shouldUseHighContrastColors
            _nativeThemeLastResult.shouldUseInvertedColorScheme = shouldUseInvertedColorScheme
            _nativeThemeLastResult.inForcedColorsMode = inForcedColorsMode
            _nativeTheme._send("updated")
        }
    }, 2000)
}

module.exports = _nativeTheme