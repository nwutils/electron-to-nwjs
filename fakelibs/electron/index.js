const IpcInc = require('./ipcMain-ipcRenderer')
const ipcRenderer = IpcInc.ipcRenderer
const ipcMain = IpcInc.ipcMain
const IpcMainEvent = IpcInc.IpcMainEvent

const MenuInc = require('./Menu-MenuItem')
const MenuItemConstructorOptions = MenuInc.MenuItemConstructorOptions
const MenuItem = MenuInc.MenuItem
const Menu = MenuInc.Menu

const electron = {
    app: require('./app'),
    BrowserWindow: require('./BrowserWindow'),
    ContextMenuParams: require('./ContextMenuParams'),
    dialog: require('./dialog'),
    Event,
    globalShortcut: require('./globalShortcut'),
    IpcMainEvent,
    MenuItemConstructorOptions,
    MenuItem,
    Menu,
    nativeTheme: require('./nativeTheme'),
    nativeImage: require('./nativeImage'),
    NewWindowWebContentsEvent: require('./NewWindowWebContentsEvent'),
    session: require('./session'),
    shell: require('./shell'),
    systemPreferences: require('./systemPreferences'),
    WebContents: require('./WebContents')
}

if (__nwjs_is_main) {
    electron.ipcMain = ipcMain
} else {
    electron.ipcRenderer = ipcRenderer
}

module.exports = electron