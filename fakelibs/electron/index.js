const app = require('./app')
const BrowserWindow = require('./BrowserWindow')
const ContextMenuParams = require('./ContextMenuParams')
const dialog = require('./dialog')
const globalShortcut = require('./globalShortcut')
const nativeTheme = require('./nativeTheme')
const nativeImage = require('./nativeImage')
const NewWindowWebContentsEvent = require('./NewWindowWebContentsEvent')
const session = require('./session')
const shell = require('./shell')
const systemPreferences = require('./systemPreferences')
const WebContents = require('./WebContents')

const IpcInc = require('./ipcMain-ipcRenderer')
const ipcRenderer = IpcInc.ipcRenderer
const ipcMain = IpcInc.ipcMain
const IpcMainEvent = IpcInc.IpcMainEvent

const MenuInc = require('./Menu-MenuItem')
const MenuItemConstructorOptions = MenuInc.MenuItemConstructorOptions
const MenuItem = MenuInc.MenuItem
const Menu = MenuInc.Menu

global.__nwjs_menu_mouse_position = global.__nwjs_menu_mouse_position || {}
const menu_mouse_position = global.__nwjs_menu_mouse_position

if (!__nwjs_is_main) {
    document.addEventListener('mousemove', (event) => {
        menu_mouse_position.x = event.screenX
        menu_mouse_position.y = event.screenY
        menu_mouse_position.viewportX = event.screenX - event.x
        menu_mouse_position.viewportY = event.screenY - event.y
    });
}

if (__nwjs_is_main) {
    module.exports = {
        app,
        // autoUpdater
        // BrowserView
        BrowserWindow,
        // clipboard
        ContextMenuParams,
        // contentTracing
        // crashReporter
        // desktopCapturer
        dialog,
        Event,
        globalShortcut,
        // inAppPurchase
        ipcMain,
        IpcMainEvent,
        Menu,
        MenuItem,
        MenuItemConstructorOptions,
        // MessageChannelMain
        // MessagePortMain
        nativeImage,
        nativeTheme,
        // net
        // netLog
        NewWindowWebContentsEvent,
        // Notification
        // powerMonitor
        // powerSaveBlocker
        // process,
        // protocol
        // pushNotifications
        // safeStorage
        // screen
        session,
        // ShareMenu
        shell,
        systemPreferences,
        // TouchBar
        // Tray
        WebContents
        // webFrameMain
    }
}
else {
    module.exports = {
        // clipboard
        // contextBridge
        // crashReporter
        // desktopCapturer
        Event,
        ipcRenderer,
        nativeImage
        // webFrame
    }
}