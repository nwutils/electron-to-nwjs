const os = require('os');
const path = require('path');

const NativeImage = require('./native-image')
const globalShortcut = require('./global-shortcut')
const shell = require('./shell')

const throwUnsupportedException = require('./unsupported-exception')

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
        // https://github.com/nwjs/nw.js/issues/149
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

const session = {
    defaultSession: {
        spellCheckerEnabled: false,
        webRequest: {
            onHeadersReceived: (opts, callback) => {}
        }
    }
}

const systemPreferences = {

}

class MenuItemConstructorOptions {

}

class MenuItem {
    constructor(options) {
        this.label = options.label
        this.click = options.click
        this.tooltip = options.toolTip
        this.enabled = options.enabled
        this.checked = options.checked
        
        let type = options.type
        if (type === "radio") {
            throwUnsupportedException("MenuItem.constructor 'options' argument can't support the 'radio' value on the 'type' property")
            type = "normal"
        }
        if (!type || type === "submenu") {
            type = "normal"
        }
        this.type = type

        if (options.submenu) {
            if (Array.isArray(options.submenu)) {
                this.submenu = Menu.buildFromTemplate(options.submenu)
            } else {
                this.submenu = options.submenu
            }
        }

        this._updateOptionsBasedOnRole(options.role)

        var that = this
        const menuItemOpts = {
            label: this.label,
            type: this.type,
            click: function() {
                let keyboardEvent = {
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: false,
                    altKey: false,
                    triggeredByAccelerator: false
                }
                if (that.click) {
                    that.click(that, BrowserWindow.getFocusedWindow(), keyboardEvent)
                }
            }
        }

        if (this.tooltip !== undefined) {
            menuItemOpts.tooltip = this.tooltip
        }
        if (this.enabled !== undefined) {
            menuItemOpts.enabled = this.enabled
        }
        if (this.checked !== undefined) {
            menuItemOpts.checked = this.checked
        }
        //menuItemOpts.icon {String} Optional icon for normal item or checkbox
        //menuItemOpts.key {String} Optional the key of the shortcut
        //menuItemOpts.modifiers {String} Optional the modifiers of the shortcut
        if (this.submenu) {
            menuItemOpts.submenu = this.submenu.contextMenu
        }
        this.menuItem = new nw.MenuItem(menuItemOpts);
    }

    _updateOptionsBasedOnRole(role) {
        if (!role) {
            return
        }

        const specs = MenuItemRoles[role.toLowerCase()]
        if (!specs) {
            throw new Error(`Unknown role: ${role}`)
        }
        if (specs.label) {
            this.label = specs.label
        }
        if (specs.appMethod) {
            this.click = specs.appMethod
        }
        if (specs.webContentsMethod) {
            this.click = function() {
                const win = BrowserWindow.getFocusedWindow()
                specs.webContentsMethod(win.webContents)
            }
        }
        if (specs.windowMethod) {
            this.click = function() {
                const win = BrowserWindow.getFocusedWindow()
                specs.windowMethod(win)
            }
        }
        // specs.registerAccelerator
        // specs.accelerator
        // specs.nonNativeMacOSRole
        if (specs.submenu) {
            this.submenu = Menu.buildFromTemplate(specs.submenu)
        }
    }
}

global.__nwjs_menu_mouse_position = global.__nwjs_menu_mouse_position || {}
const menu_mouse_position = global.__nwjs_menu_mouse_position

class Menu {
    constructor() {
        this.contextMenu = new nw.Menu();
        this.mainMenu = new nw.Menu({type:"menubar"});
        this.items = []
    }

    
    static setApplicationMenu(menu) {
        BrowserWindow.getAllWindows().forEach(win => win.setMenu(menu))
        global.__nwjs_app_menu = menu
    }
    static getApplicationMenu() {
        return global.__nwjs_app_menu
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


    _events = {}
    dispatchEvent(event) {
        let listener = this._events[event.type];
        if (listener) {
            listener(event);
        }
    }
    on(event, listener) {
        if (event === 'menu-will-close') {
            throwUnsupportedException("Menu.on 'event' argument can't support the 'menu-will-close' value")
        }
        this._events[event] = listener;
        return this;
    }


    popup(options) {
        if (options.window) {
            const focusedWin = BrowserWindow.getFocusedWindow()
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
        this.contextMenu.popup(options.x, options.y)
        this.dispatchEvent(new Event('menu-will-show'))
    }
    // closePopup([browserWindow])
    append(item) {
        this.mainMenu.append(item.menuItem)
        this.contextMenu.append(item.menuItem)
        if (item.id) {
            this.items.push(item)
        }
    }
    getMenuItemById(id) {
        return this.items.filter(i => i.id === id).shift()
    }
    insert(pos, item) {
        this.mainMenu.insert(item.menuItem, pos)
        this.contextMenu.insert(item.menuItem, pos)
        if (item.id) {
            this.items.splice(pos, 0, item);
        }
    }
}

if (!__nwjs_is_main) {
    document.addEventListener('mousemove', (event) => {
        menu_mouse_position.x = event.screenX
        menu_mouse_position.y = event.screenY
        menu_mouse_position.viewportX = event.screenX - event.x
        menu_mouse_position.viewportY = event.screenY - event.y
    });
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
    

    constructor(win) {
        this._window = win
        
        this.session = session.defaultSession
    }


    static getFocusedWebContents() {
        return BrowserWindow.getFocusedWindow().webContents
    }


    on(channel, callback) {
        this._events[channel] = callback;
        if (this._eventsRequestCache[channel]) {
            this._eventsRequestCache[channel].forEach(args => callback.apply(null, args))
            delete this._eventsRequestCache[channel]
        }
        return this;
    }


    loadURL(url, options) {
        if (options) {
            throwUnsupportedException("WebContents.loadURL can't support the 'options' argument")
        }
        this._window.window.location.href = url;
    }
    loadFile(filePath, options) {
        if (options) {
            throwUnsupportedException("WebContents.loadFile can't support the 'options' argument")
        }
        this._window.window.location.href = filePath;
    }
    openDevTools(options) {
        if (options) {
            throwUnsupportedException("WebContents.openDevTools can't support the 'options' argument")
        }
        this._window.window.showDevTools()
    }
    closeDevTools() {
        this._window.window.closeDevTools()
    }
    isDevToolsOpened() {
        return this._isDevToolsOpen
    }
    // isDevToolsFocused()
    toggleDevTools() {
        if (this.isDevToolsOpened()) {
            this.closeDevTools()
        } else {
            this.openDevTools()
        }
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

class ContextMenuParams {
    
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

// Reference:
// https://www.electronjs.org/de/docs/latest/api/browser-window
// https://docs.nwjs.io/en/latest/References/Window/

global.__nwjs_windowById = global.__nwjs_windowById || {}
var _windowById = global.__nwjs_windowById

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
        this.kiosk = opts.kiosk || false;
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
        this.webContents = new WebContents(this);
        // visibleOnAllWorkspaces
        // menuBarVisible
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
    static getFocusedWindow() {
        return this.getAllWindows().filter(win => win.isFocused()).shift()
    }
    static fromWebContents(webContents) {
        return _windowById[webContents._window.id]
    }
    // static fromBrowserView(browserView)
    static fromId(id) {
        return _windowById[id]
    }

    static _getCurrentWindow() {
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
        const attachOn = function() {
            return new Promise((resolve, reject) => {
                const fWin = BrowserWindow._getCurrentWindow()
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
                kiosk: that.kiosk,
                transparent: that.transparent
            }, 
            (win) => {
                that.window = win;
                that._showMenubar = that.autoHideMenuBar !== true
                that.setMenu(global.__nwjs_app_menu)
                win.eval(null, `window.__nwjs_window_id = ${that.id};`)

                if (that.centerOnStart) {
                    // The position 'center' attribute not always work; this is a workaround
                    const screens = nw.Screen.screens
                    if (screens.length === 1) {
                        const screenSize = screens[0].bounds
                        that.x = (screenSize.width - that.width)/2
                        that.y = (screenSize.height - that.height)/2
                        win.moveTo(that.x, that.y)
                    }
                }
                else {
                    // When using the position 'null' attribute, we still need to move the window manually
                    win.moveTo(that.x, that.y)
                }

                win.on('focus', function() {
                    that._isFocused = true
                })
                win.on('blur', function() {
                    that._isFocused = false
                })
                win.on('devtools-opened', function() {
                    that.webContents._isDevToolsOpen = true
                })
                win.on('devtools-closed', function() {
                    that.webContents._isDevToolsOpen = false
                })
                that._isFocused = that.showValue
                
                resolve();
            })
        })
    }
    _toggleMenubar() {
        if (!this.autoHideMenuBar) {
            return
        }
        this.window.menu = this._showMenubar ? null : this.menu.mainMenu
        this._showMenubar = !this._showMenubar
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
    isFocused() {
        return this._isFocused
    }
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
    setEnabled(enabled) {
        if (!enabled) {
            throwUnsupportedException("Can't make windows not enabled")
        }
    }
    isEnabled() {
        return true
    }
    setSize(width, height) {
        this._getWindow().then(win => win.resizeTo(width, height));
    }
    getSize() {
        const win = this.window
        return [win?.width || this.width, win?.height || this.height]
    }
    setContentSize(width, height, animate) {
        throwUnsupportedException("Can't change content size programatically")
    }
    getContentSize() {
        const win = this.window
        if (!win) {
            throwUnsupportedException("Window is not ready yet")
            return [undefined, undefined]
        }
        return [win.window.document.clientWidth, win.window.document.clientHeight]
    }
    setMinimumSize(width, height) {
        this.minWidth = width
        this.minHeight = height
        this._getWindow().then(win => win.setMinimumSize(width, height));
    }
    getMinimumSize() {
        return [this.minWidth, this.minHeight]
    }
    setMaximumSize(width, height) {
        this.maxWidth = width
        this.maxHeight = height
        this._getWindow().then(win => win.setMaximumSize(width, height));
    }
    getMaximumSize() {
        return [this.maxWidth, this.maxHeight]
    }
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
    setMovable(movable) {
        if (!movable) {
            throwUnsupportedException("Can't make windows not movable")
        }
    }
    isMovable() {
        return true
    }
    setMinimizable(minimizable) {
        if (!minimizable) {
            throwUnsupportedException("Can't make windows not minimizable")
        }
    }
    isMinimizable() {
        return true
    }
    setMaximizable(maximizable) {
        if (!maximizable) {
            throwUnsupportedException("Can't make windows not maximizable")
        }
    }
    isMaximizable() {
        return true
    }
    setFullScreenable(fullScreenable) {
        if (!fullScreenable) {
            throwUnsupportedException("Can't make windows not fullScreenable")
        }
    }
    isFullScreenable() {
        return true
    }
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
    setPosition(x, y, animate) {
        this.x = x
        this.y = y
        this._getWindow().then(win => win.moveTo(x, y));
    }
    getPosition() {
        const win = this.window
        return [win?.x || this.x, win?.y || this.y]
    }
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
    setKiosk(kiosk) {
        this.kiosk = kiosk
        this._getWindow().then(win => {
            if (kiosk) {
                win.enterKioskMode()
            }
            else {
                win.leaveKioskMode()
            }
        });
    }
    isKiosk() {
        return this.kiosk
    }
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
        if (rect !== undefined) {
            throwUnsupportedException("BrowserWindow.capturePage can't support the 'rect' argument")
        }

        const that = this;
        return new Promise((resolve, reject) => {
            that._getWindow().then(win => {
                win.capturePage((bufferImage) => {
                    resolve(NativeImage.createFromBuffer(bufferImage))
                },
                {format:'png', datatype:'buffer'});
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
    setMenu(menu) {
        const showMenubar = this._showMenubar
        this.menu = menu
        this._getWindow().then(win => {
            win.menu = showMenubar ? (menu === null ? null : menu.mainMenu) : null
        });
    }
    removeMenu() {
        this.setMenu(null)
    }
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
    setAutoHideMenuBar(hide) {
        this.autoHideMenuBar = hide
        this._showMenubar = hide
    }
    isMenuBarAutoHide() {
        return this.autoHideMenuBar
    }
    setMenuBarVisibility(visible) {
        this._showMenubar = visible
    }
    isMenuBarVisible() {
        return this._showMenubar
    }
    // setVisibleOnAllWorkspaces
    // isVisibleOnAllWorkspaces
    // setIgnoreMouseEvents
    // setContentProtection
    setFocusable(focusable) {
        if (!focusable) {
            throwUnsupportedException("Can't make windows not focusable")
        }
    }
    isFocusable() {
        return true
    }
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

global.__nwjs_ipcSharedMemory = global.__nwjs_ipcSharedMemory || {
    send: {},
    invoke: {}
}
var ipcSharedMemory = global.__nwjs_ipcSharedMemory

const ipcRenderer = {
    on(channel, callback) {
        BrowserWindow._getCurrentWindowAsync().then(win => win.webContents.on(channel, callback))
        return this
    },
    send(channel, ...args) {
        const event = new Event(channel)
        const win = BrowserWindow._getCurrentWindow()
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
        const win = BrowserWindow._getCurrentWindow()
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
        const win = BrowserWindow._getCurrentWindow()
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
    ContextMenuParams,
    dialog,
    Event,
    globalShortcut,
    IpcMainEvent,
    nativeTheme,
    Menu,
    MenuItemConstructorOptions,
    NativeImage,
    NewWindowWebContentsEvent,
    session,
    shell,
    systemPreferences
}
if (__nwjs_is_main) {
    electron.ipcMain = ipcMain
} else {
    electron.ipcRenderer = ipcRenderer
}
var MenuItemRoles = require('./menu-item-roles')(electron)
module.exports = electron