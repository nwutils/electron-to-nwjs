const os = require('os');
const path = require('path');

class NativeImage {
    static createEmpty() {
        return new NativeImage()
    }
    // static createThumbnailFromPath(path, maxSize) (Windows and macOS only)
    static createFromPath(filePath) {
        var img = new NativeImage()
        return img
    }
    // static createFromBitmap(buffer, options)
    // static createFromBuffer(buffer[, options])
    // static createFromDataURL(dataURL)
    // static createFromNamedImage(imageName[, hslShift]) (macOS only)

    // toPNG([options])
    // toJPEG(quality)
    // toBitmap([options])
    toDataURL() {
        return ""
    }
    // getBitmap([options])
    // getNativeHandle() (macOS only)
    // isEmpty()
    // getSize([scaleFactor])
    // setTemplateImage(option)
    // isTemplateImage()
    // crop(rect)
    // resize(options)
    // getAspectRatio([scaleFactor])
    // getScaleFactors()
    // addRepresentation(options)
    // isMacTemplateImage (macOS only)
}

const app = {
    // accessibilitySupportEnabled (Windows and macOS only)
    // applicationMenu
    // badgeCount (Linux and macOS only)
    commandLine: {
        _lines: [],
        appendSwitch(key, value) {
            this._lines.push(value === undefined ? `--${key}` : `--${key}=${value}`)
        }
    },
    // dock (macOS only)
    isPackaged: __nwjs_is_packaged,
    name: __nwjs_app_name,
    // userAgentFallback
    // runningUnderARM64Translation (Windows and macOS only)
    


    _events: {},
    dispatchEvent(event) {
        let listener = this._events[event.type];
        if (listener) {
            listener(event);
        }
    },
    on(event, listener) {
        this._events[event] = listener;
        return this;
    },


    quit() {
        nw.App.quit()
    },
    // exit([exitCode])
    relaunch() {

    },
    // isReady()
    // whenReady()
    // focus([options])
    // hide() (macOS only)
    // isHidden() (macOS only)
    // show() (macOS only)
    // setAppLogsPath([path])
    // getAppPath()
    getPath(name) {
        switch(name) {
            case "home":        return os.homedir();
            case "appData":     return path.dirname(this.getPath("userData"));
            case "userData":    return path.dirname(nw.App.dataPath);
            case "sessionData": break;
            case "temp":        break;
            case "exe":         return process.execPath;
            case "module":      break;
            case "desktop":     return path.join(this.getPath("home"), "Desktop");
            case "documents":   return path.join(this.getPath("home"), "Documents");
            case "downloads":   return path.join(this.getPath("home"), "Downloads");
            case "music":       return path.join(this.getPath("home"), "Music");
            case "pictures":    return path.join(this.getPath("home"), "Pictures");
            case "videos":      return path.join(this.getPath("home"), "Videos");
            case "recent":      break;
            case "logs":        break;
            case "crashDumps":  break;
        }
        throw new Error("Unknown path name: %s".replace("%s", name));
    },
    async getFileIcon(filePath) {
        return NativeImage.createFromPath(filePath)
    },
    // setPath(name, path)
    getVersion() {
        return __nwjs_app_version;
    },
    getName() {
        return this.name
    },
    setName(name) {
        this.name = name
    },
    // getLocale()
    // getLocaleCountryCode()
    // addRecentDocument(path) (Windows and macOS only)
    // clearRecentDocuments() (Windows and macOS only)
    setAsDefaultProtocolClient(protocol, path, args) {

    },
    // removeAsDefaultProtocolClient(protocol[, path, args]) (Windows and macOS only)
    // isDefaultProtocolClient(protocol[, path, args])
    // getApplicationNameForProtocol(url)
    // getApplicationInfoForProtocol(url) (Windows and macOS only)
    // setUserTasks(tasks) (Windows only)
    // getJumpListSettings() (Windows only)
    // setJumpList(categories) (Windows only)
    // requestSingleInstanceLock([additionalData])
    // hasSingleInstanceLock()
    // releaseSingleInstanceLock()
    // setUserActivity(type, userInfo[, webpageURL]) (macOS only)
    // getCurrentActivityType() (macOS only)
    // invalidateCurrentActivity() (macOS only)
    // resignCurrentActivity() (macOS only)
    // updateCurrentActivity(type, userInfo) (macOS only)
    // setAppUserModelId(id) (Windows only)
    // setActivationPolicy(policy) (macOS only)
    // importCertificate(options, callback) (Linux only)
    // configureHostResolver(options)
    disableHardwareAcceleration() {

    },
    // disableDomainBlockingFor3DAPIs()
    // getAppMetrics()
    // getGPUFeatureStatus()
    // getGPUInfo(infoType)
    // setBadgeCount([count]) (Linux and macOS only)
    // getBadgeCount() (Linux and macOS only)
    // isUnityRunning() (Linux only)
    // getLoginItemSettings([options]) (Windows and macOS only)
    // setLoginItemSettings(settings) (Windows and macOS only)
    // isAccessibilitySupportEnabled() (Windows and macOS only)
    // setAccessibilitySupportEnabled(enabled) (Windows and macOS only)
    // showAboutPanel()
    // setAboutPanelOptions(options)
    // isEmojiPanelSupported()
    // showEmojiPanel() (Windows and macOS only)
    // startAccessingSecurityScopedResource(bookmarkData) (macOS only)
    // enableSandbox()
    isInApplicationsFolder() {

    },
    moveToApplicationsFolder() {

    }
    // isSecureKeyboardEntryEnabled() (macOS only)
    // setSecureKeyboardEntryEnabled(enabled) (macOS only)
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
    _eventsRequestCache = {}
    _events = {}
    
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
        if (this._eventsRequestCache[channel]) {
            this._eventsRequestCache[channel].forEach(args => callback.apply(null, args))
            delete this._eventsRequestCache[channel]
        }
        return this;
    }
    send(channel, ...args) {
        const event = new Event(channel)
        event.sender = this
        
        args = args.map((x) => x)
        args.unshift(event)

        const callback = this._events[channel]
        if (callback === undefined) {
            this._eventsRequestCache[channel] = this._eventsRequestCache[channel] || []
            this._eventsRequestCache[channel].push(args)
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

global._windowById = global._windowById || {}
var _windowById = global._windowById

class BrowserWindow {
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


        const id = Math.floor(Math.random() * 1000000000);
        this.id = id;
        this.webContents = new WebContents({id});
        // visibleOnAllWorkspaces
        // menuBarVisible
        // kiosk
        // documentEdited
        // representedFilename
        // excludedFromShownWindowsMenu
        // accessibleTitle

        _windowById[id] = this

        this.on('closed', function() {
            delete _windowById[id]

            if (Object.keys(_windowById).length === 0) {
                app.dispatchEvent(new Event("window-all-closed"))
            }
        })
    }

    static getAllWindows() {
        return Object.values(_windowById)
    }
    static fromId(id) {
        return _windowById[id]
    }
    static fromWebContents(webContents) {
        return _windowById[webContents.id]
    }
    static getCurrentWindow() {
        const windowId = window.__nwjs_window_id
        if (windowId === undefined) {
            return undefined
        }
        try {
            return BrowserWindow.getAllWindows().filter(bw => bw.id === windowId).shift()
        }
        catch(e) {
            console.error(e)
            return undefined
        }
    }
    static _getCurrentWindowAsync() {
        const that = this
        const attachOn = function() {
            return new Promise((resolve, reject) => {
                const fWin = BrowserWindow.getCurrentWindow()
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

    async _getWindow() {
        const that = this
        const attachOn = function() {
            return new Promise((resolve, reject) => {
                if (that.window) {
                    return resolve(that.window);
                }
                setTimeout(() => {
                    attachOn().then(resolve, reject)
                }, 100)
            })
        }
        return await attachOn()
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
                window.eval(null, `window.__nwjs_window_id = ${that.id};`)
                
                // The position attribute not always work; this is a workaround
                if (that.centerOnStart) {
                    const screens = nw.Screen.screens
                    if (screens.length === 1) {
                        const screenSize = screens[0].bounds
                        window.moveTo((screenSize.width - that.width)/2, (screenSize.height - that.height)/2)
                    }
                }

                resolve();
            })
        })
    }

    destroy() {
        this._getWindow().then(win => win.close(true));
    }
    close() {
        this._getWindow().then(win => win.close());
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

        const eventObj = new Event(event)
        this._getWindow().then(win => win.on(nwjsEvent, function(a1, a2, a3, a4, a5) {
            return callback(eventObj, a1, a2, a3, a4, a5)
        }));
    }
}

global.ipcSharedMemory = global.ipcSharedMemory || {
    send: {},
    invoke: {}
}
var ipcSharedMemory = global.ipcSharedMemory

const ipcRenderer = {
    on(channel, callback) {
        BrowserWindow._getCurrentWindowAsync().then(win => win.webContents.on(channel, callback))
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
        if (win) {
            event.sender = win.webContents
        }
        
        args = args.map((x) => x)
        args.unshift(event)

        const callback = ipcSharedMemory.send[channel]
        if (callback === undefined || callback.length === 0) {
            return
        }
        const val = callback[0].apply(null, args)
        return val || event.returnValue
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

const electron = {
    app,
    BrowserWindow,
    dialog,
    Event,
    globalShortcut,
    IpcMainEvent,
    nativeTheme,
    Menu,
    MenuItemConstructorOptions,
    NativeImage,
    NewWindowWebContentsEvent,
    shell,
    systemPreferences
}
if (__nwjs_is_main) {
    electron.ipcMain = ipcMain
} else {
    electron.ipcRenderer = ipcRenderer
}
module.exports = electron