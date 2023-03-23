/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/menu
  https://www.electronjs.org/docs/latest/api/menu-item

  NW.js Docs
  https://docs.nwjs.io/en/latest/References/Menu/
  https://docs.nwjs.io/en/latest/References/MenuItem/

  Menu:
  Create native application menus and context menus.
  Only available in the main process.

  MenuItem:
  Add items to native application menus and context menus.
  Only available in the main process.

  Electron's Menu and MenuItem are equivalent to NW.js's Menu and MenuItem.
  The biggest complicator is the fact that NW.js create different instances
  of Menu depending if you want to use it for context menu or for the main
  menu, while Electron does not. In order to circunvent that, we create two
  instances of NW.js Menus when creating an Electron Menu, so we can use the
  correct one according to the circunstance.

  Another option would be to only create the NW.js Menu object when it's
  needed, but that will require some refactoring.
*/

const EventEmitter = require('events');
const BrowserWindowManager = require('./utils/BrowserWindowManager')
const MenuItemRoles = require('./utils/menu-item-roles')
const throwUnsupportedException = require('./utils/unsupported-exception')

const isMac = process.platform === 'darwin';

global.__nwjs_menu_mouse_position = global.__nwjs_menu_mouse_position || {}
const menu_mouse_position = global.__nwjs_menu_mouse_position

class MenuItemConstructorOptions {

}

class MenuItem {
    constructor(options) {
        const id = Math.floor(Math.random() * 1000000000);
        this.id = options.id || String(id)
        
        this._label = options.label
        this._click = options.click
        this._tooltip = options.toolTip
        this._enabled = options.enabled
        this._visible = options.visible
        this._checked = options.checked
        
        this.type = options.type
        this.accelerator = options.accelerator

        if (options.submenu) {
            if (Array.isArray(options.submenu)) {
                this._submenu = Menu.buildFromTemplate(options.submenu)
            } else {
                this._submenu = options.submenu
            }
        }

        this._updateOptionsBasedOnRole(options.role)

        var that = this
        const menuItemOpts = {
            label: this._label,
            type: this._type === "submenu" ? "normal" : this._type,
            click: function() {
                let keyboardEvent = {
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: false,
                    altKey: false,
                    triggeredByAccelerator: false
                }
                if (that._click) {
                    that._click(that, BrowserWindowManager.getFocusedWindow(), keyboardEvent)
                }
            }
        }

        if (this._tooltip !== undefined) {
            menuItemOpts.tooltip = this._tooltip
        }
        if (this._enabled !== undefined) {
            menuItemOpts.enabled = this._enabled
        }
        if (this._checked !== undefined) {
            menuItemOpts.checked = this._checked
        }
        //menuItemOpts.icon {String} Optional icon for normal item or checkbox
        if (this._key) {
            menuItemOpts.key = this._key
            menuItemOpts.modifiers = this._modifiers
        }
        if (this._submenu) {
            menuItemOpts.submenu = this._submenu._nwjsContextMenu()
        }
        this.menuItem = new nw.MenuItem(menuItemOpts);
    }

    _updateOptionsBasedOnRole(role) {
        this._role = role
        if (!role) {
            return
        }

        const specs = MenuItemRoles[role.toLowerCase()]
        if (!specs) {
            throw new Error(`Unknown role: ${role}`)
        }
        if (specs.label) {
            this._label = specs.label
        }
        if (specs.appMethod) {
            this._click = specs.appMethod
        }
        if (specs.accelerator) {
            this.accelerator = specs.accelerator
        }
        if (specs.webContentsMethod) {
            this._click = function() {
                const win = BrowserWindowManager.getFocusedWindow()
                specs.webContentsMethod(win.webContents)
            }
        }
        if (specs.windowMethod) {
            this._click = function() {
                const win = BrowserWindowManager.getFocusedWindow()
                specs.windowMethod(win)
            }
        }
        // specs.registerAccelerator
        // specs.nonNativeMacOSRole
        if (specs.submenu) {
            this._submenu = Menu.buildFromTemplate(specs.submenu)
        }
    }

    get label() {
        return this.menuItem.label
    }
    set label(val) {
        this._label = val
        this.menuItem.label = val
    }
    get click() {
        return this._click
    }
    set click(val) {
        this._click = val
    }
    get submenu() {
        return this._submenu
    }
    set submenu(val) {
        this._submenu = val
        this.menuItem.submenu = val._nwjsContextMenu()
    }
    get type() {
        return this._type
    }
    set type(val) {
        let type = val
        if (type === "radio") {
            throwUnsupportedException("MenuItem.constructor 'options' argument can't support the 'radio' value on the 'type' property")
            type = "checkbox"
        }
        if (!type) {
            type = "normal"
        }
        this._type = type
        if (this.menuItem) {
            this.menuItem.type = this._type === "submenu" ? "normal" : this._type
        }
    }
    get role() {
        return this._role
    }
    set role(val) {
        this._updateOptionsBasedOnRole(val)
        this.label = this._label
        this.submenu = this._submenu
    }
    get accelerator() {
        if (!this._accelerator) {
            return undefined
        }
        return this._accelerator
    }
    set accelerator(val) {
        if (!val) {
            this._key = undefined
            this._modifiers = undefined
            this._accelerator = undefined
            return
        }
        if (val.toLowerCase().includes("altgr")) {
            throwUnsupportedException("MenuItem.accelerator can't support the AltGr key")
        }
        let keys = val.split("+")
        const _key = keys.pop()
        this._key = {
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
        const _modifiers = keys.join("+").toLowerCase()
                .replace("cmdorctrl", isMac ? "cmd" : "ctrl")
                .replace("commandorcontrol", isMac ? "cmd" : "ctrl")
                .replace("control", "ctrl")
                .replace("option", "ctrl")
                .replace("meta", "super")
                .replace("altgr", "alt")
        this._modifiers = (_modifiers.length === 0) ? undefined : _modifiers
        this._accelerator = val
        if (this.menuItem) {
            this.menuItem.key = this._key
            this.menuItem.modifiers = this._modifiers
        }
    }
    get toolTip() {
        return this._tooltip
    }
    set toolTip(val) {
        this._tooltip = val
        this.menuItem.tooltip = val
    }
    get enabled() {
        return this._enabled
    }
    set enabled(val) {
        this._enabled = val
        this.menuItem.enabled = val
    }
    get visible() {
        return this._visible !== false
    }
    set visible(val) {
        this._visible = val
    }
    get checked() {
        return this._checked
    }
    set checked(val) {
        this._checked = val
        this.menuItem.checked = val
    }
}

class Menu extends EventEmitter {
    constructor() {
        super()
        this.items = []
    }

    
    static setApplicationMenu(menu) {
        global.__nwjs_app_menu = menu
        BrowserWindowManager.getAllWindows().forEach(win => win.setMenu(menu))
    }
    static getApplicationMenu() {
        return global.__nwjs_app_menu || null
    }
    // static sendActionToFirstResponder(action) (macOS only)
    static buildFromTemplate(template) {
        const menu = new Menu()
        template.forEach(item => {
            if (item instanceof MenuItem) {
                menu.append(item)
            }
            else {
                menu.append(new MenuItem(item))
            }
        })
        return menu
    }


    popup(options) {
        if (options.window) {
            const focusedWin = BrowserWindowManager.getFocusedWindow()
            if (focusedWin.id !== options.window.id) {
                options.window.focus()
            }
        }
        if (options.positioningItem) {
            throwUnsupportedException("Menu.popup 'options' argument can't support the 'positioningItem' property")
        }
        if (options.callback) {
            throwUnsupportedException("Menu.popup 'options' argument can't support the 'callback' property")
        }
        if (options.x === undefined || options.y === undefined) {
            options.x = menu_mouse_position.x
            options.y = menu_mouse_position.y
        }
        else {
            options.x += menu_mouse_position.viewportX
            options.y += menu_mouse_position.viewportY
        }

        // TODO: NW.js 0.64.0 doesn't respect the coordinates of the Menu (at least in macOS);
        // Add warning based in the version (need to verify when this was fixed, and when that started)
        // https://dl.nwjs.io/
        
        this._nwjsContextMenu().popup(options.x, options.y)
        this.emit('menu-will-show')
    }
    // closePopup([browserWindow])
    append(item) {
        this.items.push(item)
    }
    getMenuItemById(id) {
        return this.items.filter(i => i.id === id).shift()
    }
    insert(pos, item) {
        this.items.splice(pos, 0, item);
    }

    _nwjsContextMenu() {
        if (this.contextMenu) {
            return this.contextMenu
        }
        let contextMenu = new nw.Menu();
        this.items.filter(i => i.visible).forEach(item => contextMenu.append(item.menuItem))
        this.contextMenu = contextMenu
        return contextMenu
    }
    _nwjsMainMenu() {
        if (this.mainMenu) {
            return this.mainMenu
        }
        let mainMenu = new nw.Menu({type:"menubar"});
        if (isMac) {
            mainMenu.createMacBuiltin(__nwjs_app_name, {hideEdit:true, hideWindow:true});
            this.items.filter(i => i.visible).forEach(item => mainMenu.append(item.menuItem))
            mainMenu.removeAt(0)
        }
        else {
            this.items.filter(i => i.visible).forEach(item => mainMenu.append(item.menuItem))
        }
        this.mainMenu = mainMenu
        return mainMenu
    }
}

module.exports = {MenuItemConstructorOptions, MenuItem, Menu}
