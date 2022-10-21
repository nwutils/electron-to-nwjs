// Reference:
// https://www.electronjs.org/de/docs/latest/api/global-shortcut
// https://docs.nwjs.io/en/latest/References/Shortcut/

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