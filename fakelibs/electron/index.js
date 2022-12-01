const app = require('./app')
const autoUpdater = require('./autoUpdater')
const BrowserWindow = require('./BrowserWindow')
const clipboard = require('./clipboard')
const ContextMenuParams = require('./ContextMenuParams')
const desktopCapturer = require('./desktopCapturer')
const dialog = require('./dialog')
const globalShortcut = require('./globalShortcut')
const nativeTheme = require('./nativeTheme')
const nativeImage = require('./nativeImage')
const NewWindowWebContentsEvent = require('./NewWindowWebContentsEvent')
const Notification = require('./Notification')
const net = require('./net')
const session = require('./session')
const shell = require('./shell')
const screen = require('./screen')
const systemPreferences = require('./systemPreferences')
const Tray = require('./tray')
const webContents = require('./WebContents')

const BrowserWindowManager = require('./utils/BrowserWindowManager')

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
        autoUpdater,
        // BrowserView
        BrowserWindow,
        clipboard,
        ContextMenuParams,
        // contentTracing
        // crashReporter
        desktopCapturer,
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
        net,
        // netLog
        NewWindowWebContentsEvent,
        Notification,
        // powerMonitor
        // powerSaveBlocker
        process,
        // protocol
        // pushNotifications
        // safeStorage
        screen,
        session,
        // ShareMenu
        shell,
        systemPreferences,
        // TouchBar
        Tray,
        webContents
        // webFrameMain
    }
}
else {
    module.exports = {
        clipboard,
        // contextBridge
        // crashReporter
        desktopCapturer,
        Event,
        ipcRenderer,
        nativeImage,
        // webFrame
        remote: {
            app,
            autoUpdater,
            //BrowserView,
            BrowserWindow,
            clipboard,
            //contentTracing,
            //crashReporter,
            desktopCapturer,
            dialog,
            globalShortcut,
            //inAppPurchase,
            ipcMain,
            Menu,
            MenuItem,
            //MessageChannelMain,
            nativeImage,
            nativeTheme,
            net,
            //netLog,
            Notification,
            //powerMonitor,
            //powerSaveBlocker,
            //protocol,
            screen,
            session,
            //ShareMenu,
            shell,
            systemPreferences,
            //TouchBar,
            Tray,
            webContents,
            //webFrameMain
            getCurrentWebContents() {
                return BrowserWindowManager.getCurrentWindowSync()?.webContents
            },
            getCurrentWindow() {
                return BrowserWindowManager.getCurrentWindowSync()
            },
            getGlobal(name) {
                return global[name]
            },
            process: process,
            require: require
        }
    }
}