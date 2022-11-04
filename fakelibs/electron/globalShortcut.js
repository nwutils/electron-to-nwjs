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

const isMac = process.platform === 'darwin';

const globalShortcut = {
    register(combination, callback) {
        let accelerator = this._nwjsAcceleratorFromElectronAccelerator(combination)
        var option = {
            key: accelerator,
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
    },

    _nwjsAcceleratorFromElectronAccelerator(accelerator) {
        if (accelerator.toLowerCase().includes("altgr")) {
            throwUnsupportedException("MenuItem.accelerator can't support the AltGr key")
        }
        let keys = accelerator.split("+")
        let _key = keys.pop()
        _key = {
            // ~, !, @, #, $
            // Plus
            "Space": " ",
            "Tab": "Tab",
            "Capslock": "CapsLock",
            "Numlock": "NumLock",
            "Scrolllock": "ScrollLock",
            "Backspace": "Backspace",
            "Delete": "Delete",
            "Insert": "Insert",
            "Return": "Enter",
            "Enter": "Enter",
            "Up": "Up",
            "Down": "Down",
            "Left": "Left",
            "Right": "Right",
            "Home": "Home",
            "End": "End",
            "PageUp": "PageUp",
            "PageDown": "PageDown",
            "Escape": "Escape",
            "Esc": "Escape",
            "VolumeUp": "AudioVolumeUp",
            "VolumeDown": "AudioVolumeDown",
            "VolumeMute": "AudioVolumeMute",
            "MediaNextTrack": "MediaNextTrack",
            "MediaPreviousTrack": "MediaPreviousTrack",
            "MediaStop": "MediaStop",
            "MediaPlayPause": "MediaPlayPause",
            "PrintScreen": "PrintScreen",
            // NumPad Keys
            // num0 - num9
            // numdec - decimal key
            // numadd - numpad + key
            // numsub - numpad - key
            // nummult - numpad * key
            // numdiv - numpad ÷ key
        }[_key] || _key.toLowerCase()
        
        let _modifiers = keys.join("+")
                .replace("CmdOrCtrl", isMac ? "Command" : "Ctrl")
                .replace("CommandOrControl", isMac ? "Command" : "Ctrl")
                .replace("Control", "Ctrl")
                .replace("Option", "Ctrl")
                .replace("Meta", "Command")
                .replace("AltGr", "Alt")
        _modifiers = (_modifiers.length === 0) ? undefined : _modifiers
        
        return _modifiers === undefined ? _key : (_modifiers + "+" + _key)
    }
}

module.exports = globalShortcut