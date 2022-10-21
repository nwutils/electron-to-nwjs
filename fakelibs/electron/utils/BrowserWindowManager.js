global.__nwjs_windowById = global.__nwjs_windowById || {}
var _windowById = global.__nwjs_windowById

class BrowserWindowManager {
    static getAllWindows() {
        return Object.values(_windowById)
    }
    static addWindow(win) {
        _windowById[win.id] = win
    }
    static removeWindowById(id) {
        delete _windowById[id]
    }

    static getWindowById(id) {
        return _windowById[id]
    }
    static getFocusedWindow() {
        return this.getAllWindows().filter(win => win.isFocused()).shift()
    }
}
module.exports = BrowserWindowManager