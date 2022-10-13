const os = require('os');
const path = require('path');

class NativeImage {
    static createFromPath(filePath) {
        var img = new NativeImage()
        return img
    }

    toDataURL() {
        return ""
    }
}

const app = {
    _events: {},
    dispatchEvent(event) {
        let listener = this._events[event.type];
        if (listener) {
            listener(event);
        }
    },


    name: __nwjs_app_name,
    commandLine: {
        _lines: [],
        appendSwitch(key, value) {
            this._lines.push(value === undefined ? `--${key}` : `--${key}=${value}`)
        }
    },
    async getFileIcon(filePath) {
        return NativeImage.createFromPath(filePath)
    },
    getPath(name) {
        switch(name) {
            case "home": return os.homedir();
            case "appData": return path.dirname(this.getPath("userData"));
            case "userData": return nw.App.dataPath;
            case "sessionData": break;
            case "temp": break;
            case "exe": return process.execPath;
            case "module": break;
            case "desktop": return path.join(this.getPath("home"), "Desktop");
            case "documents": return path.join(this.getPath("home"), "Documents");
            case "downloads": return path.join(this.getPath("home"), "Downloads");
            case "music": break;
            case "pictures": break;
            case "videos": break;
            case "recent": break;
            case "logs": break;
            case "crashDumps": break;
        }
        throw new Error("Unknown path name: %s".replace("%s", name));
    },
    getVersion() {
        return __nwjs_app_version;
    },
    on(event, listener) {
        this._events[event] = listener;
        return this;
    },
    disableHardwareAcceleration() {

    },
    isInApplicationsFolder() {

    },
    moveToApplicationsFolder() {

    },
    quit() {
        nw.App.quit()
    },
    relaunch() {

    },
    setAsDefaultProtocolClient(protocol, path, args) {

    }
}

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
    }
}

const shell = {
    showItemInFolder(item) {

    }
}

const systemPreferences = {

}

class Event {
    constructor(type) {
        this.type = type
    }
}

class MenuItemConstructorOptions {

}

class Menu {
    static buildFromTemplate() {
        return new Menu()
    }
    static setApplicationMenu() {
        
    }
    popup(options) {
        
    }
}

const nativeTheme = {
    shouldUseDarkColors: false,
    themeSource: 'system',
    shouldUseHighContrastColors: false,
    shouldUseInvertedColorScheme: false,
    inForcedColorsMode: false
}

class WebContents {
    _events = {}
    _ipcEvents = {}
    dispatchEvent(event) {
        let listener = this._events[event.type];
        if (listener) {
            listener(event);
        }
    }

    constructor(opts) {
        if (opts === undefined) opts = {};
        this.id = opts.id

        this.session = {}
        this.session.webRequest = {}
        this.session.webRequest.onHeadersReceived = (opts, callback) => {}
    }

    closeDevTools() {

    }
    on(channel, callback) {
        this._events[channel] = callback;
        return this;
    }
    send(channel, ...args) {
        const event = new Event(channel)
        event.sender = this
        
        args = args.map((x) => x)
        args.unshift(event)

        const callback = this._ipcEvents[channel]
        if (callback === undefined) {
            return
        }
        callback.apply(null, args)
    }
}

const dialog = {
    showMessageBoxSync(window, opts) {

    },
    showOpenDialog(window, opts) {

    },
    showSaveDialog(window, opts) {

    }
}

class NewWindowWebContentsEvent {
    
}

class BrowserWindow {
    static _windowById = {}

    constructor(opts) {
        if (opts === undefined) opts = {};
        else opts = JSON.parse(JSON.stringify(opts));

        this.width = opts.width || 800;
        this.height = opts.height || 600;
        this.x = opts.x;
        this.y = opts.y;
        // useContentSize
        this.centerOnStart = opts.center || false;
        this.minWidth = opts.minWidth || 0;
        this.minHeight = opts.minHeight || 0;
        this.maxWidth = opts.maxWidth;
        this.maxHeight = opts.maxHeight;
        this.resizable = opts.resizable === undefined ? true : opts.resizable;
        this.movable = opts.movable === undefined ? true : opts.movable;
        this.minimizable = opts.minimizable === undefined ? true : opts.minimizable;
        this.maximizable = opts.maximizable === undefined ? true : opts.maximizable;
        this.closable = opts.closable === undefined ? true : opts.closable;
        this.focusable = opts.focusable === undefined ? true : opts.focusable;
        this.alwaysOnTop = opts.alwaysOnTop || false;
        this.fullscreen = opts.fullscreen || false;
        this.fullscreenable = opts.fullscreenable === undefined ? true : opts.fullscreenable;
        this.simpleFullscreen = opts.simpleFullscreen || false;
        this.skipTaskbar = opts.skipTaskbar || false;
        // kiosk
        this.title = opts.title || "NW.js";
        this.icon = opts.icon;
        this.showValue = opts.show === undefined ? true : opts.show;
        // paintWhenInitiallyHidden
        this.frame = opts.frame === undefined ? true : opts.frame;
        this.parent = opts.parent === undefined ? null : opts.parent;
        this.modal = opts.modal || false;
        // acceptFirstMouse
        // disableAutoHideCursor
        this.autoHideMenuBar = opts.autoHideMenuBar || false;
        // enableLargerThanScreen
        this.backgroundColor = opts.backgroundColor || "#FFF"; // Hex, RGB, RGBA, HSL, HSLA or named CSS color format
        this.hasShadowValue = opts.hasShadow === undefined ? true : opts.hasShadow;
        this.opacity = opts.opacity || 1.0;
        this.darkTheme = opts.darkTheme || false;
        this.transparent = opts.transparent || false;
        // type
        // visualEffectState
        // titleBarStyle
        // trafficLightPosition
        this.roundedCorners = opts.roundedCorners === undefined ? true : opts.roundedCorners;
        // fullscreenWindowTitle
        // thickFrame
        // vibrancy
        // zoomToPageWidth
        // tabbingIdentifier
        opts.webPreferences = opts.webPreferences || {};
        this.devTools = opts.webPreferences.devTools || false;
        // titleBarOverlay


        this.id = Math.floor(Math.random() * 1000000000);
        this.webContents = new WebContents({id:this.id});
        // visibleOnAllWorkspaces
        // menuBarVisible
        // kiosk
        // documentEdited
        // representedFilename
        // excludedFromShownWindowsMenu
        // accessibleTitle

        BrowserWindow._windowById[this.id] = this
    }

    static getAllWindows() {
        return Object.values(BrowserWindow._windowById)
    }
    static fromId(id) {
        return BrowserWindow._windowById[id]
    }
    static fromWebContents(webContents) {
        return BrowserWindow._windowById[webContents.id]
    }
    static getCurrentWindow() {
        try {
            const win = nw.Window.get()
            return BrowserWindow.getAllWindows().filter(bw => bw.title === win.title).shift()
        }
        catch(e) {
            console.error(e)
            return undefined
        }
    }
    static async _getCurrentWindowAsync() {
        const that = this
        const attachOn = function() {
            return new Promise((resolve, reject) => {
                if (that.window) {
                    const fWin = BrowserWindow.getCurrentWindow()
                    if (fWin) {
                        return resolve(fWin);
                    }
                }
                setTimeout(100, () => {
                    attachOn().then(resolve, reject)
                })
            })
        }
        return await attachOn()
    }

    async _getWindow() {
        const that = this
        const attachOn = function() {
            return new Promise((resolve, reject) => {
                if (that.window) {
                    return resolve(that.window);
                }
                setTimeout(100, () => {
                    attachOn().then(resolve, reject)
                })
            })
        }
        return await attachOn()
    }
    destroy() {
        this._getWindow().then(win => win.close(true));
    }
    close() {
        this._getWindow().then(win => {
            win.close();

            if (Object.keys(BrowserWindow._windowById).length === 0) {
                app.dispatchEvent(new Event("window-all-closed"))
            }
        });
    }
    focus() {
        this._getWindow().then(win => win.focus());
    }
    blur() {
        this._getWindow().then(win => win.blur());
    }
    // isFocused
    // isDestroyed
    show() {
        const that = this
        this._getWindow().then(win => {
            win.show();
            that.showValue = true;
        });
    }
    // showInactive
    hide() {
        const that = this
        this._getWindow().then(win => {
            win.hide();
            that.showValue = false;
        });
    }
    isVisible() {
        return this.showValue;
    }
    // isModal
    maximize() {
        this._getWindow().then(win => win.maximize());
    }
    unmaximize() {
        this._getWindow().then(win => win.unmaximize());
    }
    // isMaximized
    minimize() {
        this._getWindow().then(win => win.minimize());
    }
    restore() {
        this._getWindow().then(win => win.restore());
    }
    // isMinimized
    setFullScreen(flag) {
        if (flag) {
            this._getWindow().then(win => win.enterFullscreen());
        } else {
            this._getWindow().then(win => win.leaveFullscreen());
        }
    }
    isFullScreen() {
        return this.window.isFullScreen;
    }
    // setSimpleFullScreen
    // isSimpleFullScreen
    // isNormal
    // setAspectRatio
    // setBackgroundColor: Hex, RGB, RGBA, HSL, HSLA or named CSS color format
    // previewFile
    // closeFilePreview
    // setBounds
    // getBackgroundColor
    // setContentBounds
    // getContentBounds
    // getNormalBounds
    // setEnabled
    // isEnabled
    setSize(width, height) {
        this._getWindow().then(win => win.resizeTo(width, height));
    }
    // getSize
    // setContentSize
    // getContentSize
    setMinimumSize(width, height) {
        this._getWindow().then(win => win.setMinimumSize(width, height));
    }
    // getMinimumSize
    setMaximumSize(width, height) {
        this._getWindow().then(win => win.setMaximumSize(width, height));
    }
    // getMaximumSize
    setResizable(resizable) {
        const that = this
        this._getWindow().then(win => {
            win.setResizable(resizable);
            that.resizable = resizable;
        });
    }
    isResizable() {
        return this.resizable;
    }
    // setMovable
    // isMovable
    // setMinimizable
    // isMinimizable
    // setMaximizable
    // isMaximizable
    // setFullScreenable
    // isFullScreenable
    // setClosable
    // isClosable
    setAlwaysOnTop(flag) {
        this._getWindow().then(win => win.setAlwaysOnTop(flag));
    }
    isAlwaysOnTop() {
        return this.window.isAlwaysOnTop;
    }
    // moveAbove
    // moveTop
    center() {
        this._getWindow().then(win => win.setPosition('center'));
    }
    // setPosition
    // getPosition
    setTitle(title) {
        this._getWindow().then(win => win.title = title);
    }
    getTitle() {
        return this.window.title;
    }
    // setSheetOffset
    flashFrame(flag) {
        this._getWindow().then(win => win.requestAttention(true));
    }
    setSkipTaskbar(skip) {
        this._getWindow().then(win => win.setShowInTaskbar(skip));
    }
    // setKiosk
    // isKiosk
    // isTabletMode
    // getMediaSourceId
    // getNativeWindowHandle
    // hookWindowMessage
    // isWindowMessageHooked
    // unhookWindowMessage
    // unhookAllWindowMessages
    // setRepresentedFilename
    // getRepresentedFilename
    // setDocumentEdited
    // isDocumentEdited
    // focusOnWebView
    // blurWebView
    capturePage(rect) {
        if (rect !== undefined) throw new Error("Unsupported operation")

        const that = this;
        return new Promise((resolve, reject) => {
            that._getWindow().then(win => {
                win.capturePage((base64Image) => {
                    reject();
                },
                {format:'png', datatype:'raw'});
            });
        });
    }
    _load(url) {
        const that = this
        return new Promise((resolve, reject) => {
            nw.Window.open(url, {
                id: that.id+"",
                title: that.title,
                width: that.width,
                height: that.height,
                // toolbar
                icon: that.icon,
                position: that.centerOnStart ? 'center' : 'null',
                min_width: that.minWidth,
                min_height: that.minHeight,
                max_width: that.maxWidth,
                max_height: that.maxHeight,
                resizable: that.resizable,
                always_on_top: that.alwaysOnTop,
                // visible_on_all_workspaces
                fullscreen: that.fullscreen,
                // show_in_taskbar
                frame: that.frame,
                show: that.showValue,
                // kiosk
                transparent: that.transparent
            }, 
            (window) => {
                that.window = window;
                resolve();
            })
        })
    }
    async loadURL(url, options) {
        return await this._load(url)
    }
    async loadFile(filePath, options) {
        return await this._load(filePath)
    }
    reload() {
        this._getWindow().then(win => win.reload());
    }
    // setMenu
    // removeMenu
    // setProgressBar
    // setOverlayIcon
    setHasShadow(hasShadow) {
        const that = this
        this._getWindow().then(win => {
            that.hasShadowValue = hasShadow;
            win.setShadow(hasShadow);
        });
    }
    hasShadow() {
        return this.hasShadowValue;
    }
    // setOpacity
    // getOpacity
    // setShape
    // setThumbarButtons
    // setThumbnailClip
    // setThumbnailToolTip
    // setAppDetails
    // showDefinitionForSelection
    // setIcon
    // setWindowButtonVisibility
    // setAutoHideMenuBar
    // isMenuBarAutoHide
    // setMenuBarVisibility
    // isMenuBarVisible
    // setVisibleOnAllWorkspaces
    // isVisibleOnAllWorkspaces
    // setIgnoreMouseEvents
    // setContentProtection
    // setFocusable
    // isFocusable
    // setParentWindow(parent)
    // getParentWindow()
    // getChildWindows()
    // setAutoHideCursor(autoHide)
    // selectPreviousTab()
    // selectNextTab()
    // mergeAllWindows()
    // moveTabToNewWindow()
    // toggleTabBar()
    // addTabbedWindow(browserWindow)
    // setVibrancy(type)
    // setTrafficLightPosition(position)
    // getTrafficLightPosition()
    // setTouchBar(touchBar)
    // setBrowserView(browserView)
    // getBrowserView()
    // addBrowserView(browserView)
    // removeBrowserView(browserView)
    // setTopBrowserView(browserView)
    // getBrowserViews()
    // setTitleBarOverlay(options)

    on(event, callback) {
        let nwjsEvent = event
        // 'page-title-updated'
        
        switch(event) {
            case 'close':             nwjsEvent = 'close';          break;
            case 'closed':            nwjsEvent = 'closed';         break;
            // 'session-end'
            // 'unresponsive'
            // 'responsive'
            case 'blur':              nwjsEvent = 'blur';           break;
            case 'focus':             nwjsEvent = 'focus';          break;
            // 'show'
            // 'hide'
            // 'ready-to-show'
            case 'maximize':          nwjsEvent = 'maximize';         break;
            // 'unmaximize'
            case 'minimize':          nwjsEvent = 'minimize';         break;
            case 'restore':           nwjsEvent = 'restore';          break;
            // 'will-resize'
            // 'resize'
            case 'resized':           nwjsEvent = 'resize';           break;
            // 'will-move'
            // 'move'
            case 'moved':             nwjsEvent = 'move';             break;
            case 'enter-full-screen': nwjsEvent = 'enter-fullscreen'; break;
            case 'leave-full-screen': nwjsEvent = 'leave-fullscreen'; break;
            // 'enter-html-full-screen'
            // 'leave-html-full-screen'
            // 'always-on-top-changed'
        }

        this._getWindow().then(win => win.on(nwjsEvent, callback));
    }
}

global.ipcSharedMemory = global.ipcSharedMemory || {
    send: {},
    invoke: {}
}
var ipcSharedMemory = global.ipcSharedMemory

const ipcRenderer = {
    on(channel, callback) {
        BrowserWindow._getCurrentWindowAsync().then(win => win.webContents._ipcEvents[channel] = callback)
        return this
    },
    send(channel, ...args) {
        const event = new Event(channel)
        const win = BrowserWindow.getCurrentWindow()
        if (win) {
            event.sender = win.webContents
        }
        
        args = args.map((x) => x)
        args.unshift(event)
        
        const callbacks = ipcSharedMemory.send[channel]
        if (callbacks === undefined) {
            return
        }
        callbacks.forEach(callback => callback.apply(null, args))
    },
    sendSync(channel, ...args) {
        const event = new Event(channel)
        const win = BrowserWindow.getCurrentWindow()
        if (!win) {
            return
        }
        event.sender = win.webContents
        
        args = args.map((x) => x)
        args.unshift(event)

        const callback = ipcSharedMemory.invoke[channel]
        if (callback === undefined) {
            return
        }
        return callback.apply(null, args)
    },
    async invoke(channel, ...args) {
        const event = new Event(channel)
        const win = BrowserWindow.getCurrentWindow()
        if (win) {
            event.sender = win.webContents
        }
        
        args = args.map((x) => x)
        args.unshift(event)

        const callback = ipcSharedMemory.invoke[channel]
        if (callback === undefined) {
            throw new Error(`No function is prepared to answer the invoke of "${channel}" channel`)
        }
        return await callback.apply(null, args)
    }
}

const ipcMain = {
    on(channel, callback) {
        if (ipcSharedMemory.send[channel] === undefined) {
            ipcSharedMemory.send[channel] = []
        }
        ipcSharedMemory.send[channel].push(callback)
    },
    handle(channel, asyncCallback) {
        ipcSharedMemory.invoke[channel] = asyncCallback
    }
}

class IpcMainEvent {

}

module.exports = {
    app,
    BrowserWindow,
    dialog,
    Event,
    globalShortcut,
    ipcMain,
    IpcMainEvent,
    ipcRenderer,
    isPackaged: __nwjs_is_packaged,
    nativeTheme,
    Menu,
    MenuItemConstructorOptions,
    NativeImage,
    NewWindowWebContentsEvent,
    shell,
    systemPreferences
}