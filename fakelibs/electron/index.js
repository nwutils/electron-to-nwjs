const app = {
    _events: {},
    dispatchEvent(event) {
        let listener = this._events[event.type];
        if (listener) {
            listener(event);
        }
    },


    name: __nwjs_app_name,
    on(event, listener) {
        this._events[event] = listener;
        return this;
    },
    disableHardwareAcceleration() {

    },
    quit() {
        nw.App.quit()
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

}

const systemPreferences = {

}

const ipcSharedMemory = {
    on: {},
    handle: {}
}

const ipcRenderer = {
    send(channel, ...args) {
        args = args.map((x) => x)
        args.unshift(null) // TODO: event
        ipcSharedMemory.on[channel].apply(null, args)
    },
    async invoke(channel, ...args) {
        args = args.map((x) => x)
        args.unshift(null) // TODO: event
        return await ipcSharedMemory.handle[channel].apply(null, args)
    }
}

const ipcMain = {
    on(channel, callback) {
        ipcSharedMemory.on[channel] = callback
    },
    handle(channel, asyncCallback) {
        ipcSharedMemory.handle[channel] = asyncCallback
    }
}

const Menu = {
    
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
    dispatchEvent(event) {
        let listener = this._events[event.type];
        if (listener) {
            listener(event);
        }
    }


    constructor(opts) {
        if (opts === undefined) opts = {};
    }

    on(event, listener) {
        this._events[event] = listener;
        return this;
    }
}

const commandLine = {
    appendSwitch(key, value) {
        if (key === "disable-http-cache") {
            nw.App.clearCache()
        }
    }
}

const dialog = {

}

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


        this.webContents = new WebContents();
        this.id = Math.floor(Math.random() * 1000000000);
        // visibleOnAllWorkspaces
        // menuBarVisible
        // kiosk
        // documentEdited
        // representedFilename
        // excludedFromShownWindowsMenu
        // accessibleTitle
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

module.exports = {
    app,
    BrowserWindow,
    commandLine,
    dialog,
    globalShortcut,
    ipcMain,
    ipcRenderer,
    isPackaged: __nwjs_is_packaged,
    nativeTheme,
    Menu,
    shell,
    systemPreferences
}