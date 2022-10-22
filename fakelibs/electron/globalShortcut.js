/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/global-shortcut

  NW.js Docs
  https://docs.nwjs.io/en/latest/References/Shortcut/
  https://docs.nwjs.io/en/latest/References/App/

  Detect keyboard events when the application does not have keyboard focus.
  Only available in the main process.

  NW.js's Shortcut requires NW.js's App to register its shortcuts, so the
  combination of the two can replicate all Electron's globalShortcut functionalities.
*/

global.__nwjs_registered_global_shortcuts = global.__nwjs_registered_global_shortcuts || []
var _registered_global_shortcuts = global.__nwjs_registered_global_shortcuts

const globalShortcut = {
    register(combination, callback) {
        var option = {
            key: combination,
            active: callback,
            failed: function(msg) {
                console.error(msg);
            }
        };
        
        var shortcut = new nw.Shortcut(option);
        nw.App.registerGlobalHotKey(shortcut);
        _registered_global_shortcuts[combination] = shortcut
    },
    registerAll(combinations, callback) {
        var that = this
        combinations.forEach(combination => {
            that.register(combination, callback)
        })
    },
    isRegistered(combination) {
        return _registered_global_shortcuts[combination] !== undefined
    },
    unregister(combination) {
        nw.App.unregisterGlobalHotKey(_registered_global_shortcuts[combination])
        delete _registered_global_shortcuts[combination]
    },
    unregisterAll() {
        var that = this
        Object.keys(this._registrationHistory).forEach(combination => {
            that.unregister(combination)
        })
    }
}

module.exports = globalShortcut