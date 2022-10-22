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
    static getCurrentWindowSync() {
        const windowId = window.__nwjs_window_id
        if (windowId === undefined) {
            return undefined
        }
        try {
            return this.getAllWindows().filter(bw => bw.id === windowId).shift()
        }
        catch(e) {
            console.error(e)
            return undefined
        }
    }
    static getCurrentWindow() {
        const attachOn = function() {
            return new Promise((resolve, reject) => {
                const fWin = BrowserWindowManager.getCurrentWindowSync()
                if (fWin) {
                    return resolve(fWin);
                }
                setTimeout(() => {
                    attachOn().then(resolve, reject)
                }, 100)
            })
        }
        return attachOn()
    }
}
module.exports = BrowserWindowManager