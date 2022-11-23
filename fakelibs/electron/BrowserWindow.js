/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/browser-window

  NW.js Docs
  https://docs.nwjs.io/en/latest/References/Window/
  https://developer.chrome.com/docs/extensions/reference/app_window/

  Create and control browser windows.
  Only available in the main process.

  NW.js's Window actually represents Electron's BrowserWindow and WebContents,
  so both BrowserWindow and WebContents need to make use of it.
*/

const EventEmitter = require('events');
const app = require('./app')
const WebContents = require('./WebContents')
const NativeImage = require('./nativeImage')
const BrowserWindowManager = require('./utils/BrowserWindowManager')
const throwUnsupportedException = require('./utils/unsupported-exception')

class BrowserWindow extends EventEmitter {
    constructor(opts) {
        super()
        if (opts === undefined) opts = {};
        else opts = JSON.parse(JSON.stringify(opts));

        const id = Math.floor(Math.random() * 1000000000);
        
        this._webContents = new WebContents(this);
        this._id = id;
        this._autoHideMenuBar = opts.autoHideMenuBar || false;
        this._simpleFullscreen = opts.simpleFullscreen || false;
        this._fullscreen = opts.fullscreen || false;
        this._focusable = opts.focusable === undefined ? true : opts.focusable;
        this._visibleOnAllWorkspaces = opts.visibleOnAllWorkspaces || false;
        this._shadow = opts.hasShadow === undefined ? true : opts.hasShadow;
        this._menuBarVisible = opts.menuBarVisible || (opts.autoHideMenuBar !== true);
        this._kiosk = opts.kiosk || false;
        this._documentEdited = opts.documentEdited || false;
        this._representedFilename = opts.representedFilename;
        this._title = opts.title || "NW.js";
        this._minimizable = opts.minimizable === undefined ? true : opts.minimizable;
        this._maximizable = opts.maximizable === undefined ? true : opts.maximizable;
        this._fullscreenable = opts.fullscreenable === undefined ? true : opts.fullscreenable;
        this._resizable = opts.resizable === undefined ? true : opts.resizable;
        this._closable = opts.closable === undefined ? true : opts.closable;
        this._movable = opts.movable === undefined ? true : opts.movable;
        this._excludedFromShownWindowsMenu = opts.excludedFromShownWindowsMenu || false;
        this._accessibleTitle = opts.accessibleTitle;

        this._width = opts.width || 800;
        this._height = opts.height || 600;
        this._x = opts.x;
        this._y = opts.y;
        this._useContentSize = opts.useContentSize || false;
        this._center = opts.center || false;
        this._minWidth = opts.minWidth || 0;
        this._minHeight = opts.minHeight || 0;
        this._maxWidth = opts.maxWidth;
        this._maxHeight = opts.maxHeight;
        this._alwaysOnTop = opts.alwaysOnTop || false;
        this._skipTaskbar = opts.skipTaskbar || false;
        this._icon = opts.icon;
        this._visible = opts.show === undefined ? true : opts.show;
        this._paintWhenInitiallyHidden = opts.paintWhenInitiallyHidden === undefined ? true : opts.paintWhenInitiallyHidden
        this._frame = opts.frame === undefined ? true : opts.frame;
        this._parent = opts.parent === undefined ? null : opts.parent;
        this._modal = opts.modal || false;
        this._acceptFirstMouse = opts.acceptFirstMouse || false;
        this._disableAutoHideCursor = opts.disableAutoHideCursor || false;
        this._enableLargerThanScreen = opts.enableLargerThanScreen || false;
        this._backgroundColor = opts.backgroundColor || "#FFF";
        this._opacity = opts.opacity || 1.0;
        this._darkTheme = opts.darkTheme || false;
        this._transparent = opts.transparent || false;
        // type
        /* 
            desktop = places the window at the desktop background window level (Linux and macOS only)
            dock = (Linux only)
            toolbar = (Windows only)
            splash = (Linux only)
            notification = (Linux only)
            textured = metal appearance (macOS only)
            panel = floating window (macOS only)
        */
        // visualEffectState
        // titleBarStyle
        // trafficLightPosition
        this._roundedCorners = opts.roundedCorners === undefined ? true : opts.roundedCorners;
        // fullscreenWindowTitle
        // thickFrame
        // vibrancy
        // zoomToPageWidth
        // tabbingIdentifier
        opts.webPreferences = opts.webPreferences || {};
        this._devTools = opts.webPreferences.devTools === undefined ? true : opts.webPreferences.devTools;
        // titleBarOverlay


        BrowserWindowManager.addWindow(this)

        this.on('closed', function() {
            BrowserWindowManager.removeWindowById(id)
            
            if (BrowserWindowManager.getAllWindows().length === 0) {
                app.emit("window-all-closed")
            }
        })
    }

    static getAllWindows() {
        return BrowserWindowManager.getAllWindows()
    }
    static getFocusedWindow() {
        return this.getAllWindows().filter(win => win.isFocused()).shift()
    }
    static fromWebContents(webContents) {
        return this.fromId(webContents._window.id)
    }
    // static fromBrowserView(browserView)
    static fromId(id) {
        return BrowserWindowManager.getWindowById(id)
    }

    _windowPromiseResolves = []
    _getWindow() {
        const that = this
        return new Promise((resolve, reject) => {
            if (that.window) {
                return resolve(that.window);
            }
            that._windowPromiseResolves.push(resolve)
        })
    }


    _load(url) {
        const that = this
        return new Promise((resolve, reject) => {
            const nwWindowOpts = {
                id: that.id+"",
                title: that._title,
                width: that._width,
                height: that._height,
                toolbar: false,
                icon: that._icon,
                position: that._center ? 'center' : 'null',
                min_width: that._minWidth,
                min_height: that._minHeight,
                max_width: that._maxWidth,
                max_height: that._maxHeight,
                resizable: that._resizable,
                always_on_top: that._alwaysOnTop,
                visible_on_all_workspaces: that._visibleOnAllWorkspaces,
                fullscreen: that._fullscreen,
                frame: that._frame,
                show: that._visible,
                kiosk: that._kiosk,
                transparent: that._transparent
            }
            if (__nwjs_feature_show_in_taskbar_available) {
                nwWindowOpts.show_in_taskbar = !that._skipTaskbar
            }
            nw.Window.open(url, nwWindowOpts, (win) => {
                that.window = win;
                win.eval(null, `window.__nwjs_window_id = ${that.id};`)
                that._windowPromiseResolves.forEach(windowPromiseResolve => windowPromiseResolve(win))

                that.setMenu(global.__nwjs_app_menu)
                that.setOpacity(that._opacity)
                that.setBackgroundColor(that._backgroundColor)

                if (that._center) {
                    that.center()
                }
                else {
                    // When using the position 'null' attribute, we still need to move the window manually
                    win.moveTo(that._x, that._y)
                }

                // 'page-title-updated'
                win.on('close', function() {
                    let event = new Event('close')
                    that.emit('close', event)
                    if (!event.defaultPrevented) {
                        that.destroy()
                    }
                })
                win.on('closed', function() {
                    that.emit('closed')
                })
                // 'session-end'
                // 'unresponsive'
                // 'responsive'
                win.on('blur', function() {
                    that._isFocused = false
                    that.emit('blur')
                })
                win.on('focus', function() {
                    that._isFocused = true
                    that.emit('focus')
                })
                // 'show'
                // 'hide'
                win.on('maximize', function() {
                    that.emit('maximize')
                })
                // 'unmaximize'
                win.on('minimize', function() {
                    that.emit('minimize')
                })
                win.on('restore', function() {
                    that.emit('restore')
                })
                // 'will-resize'
                // 'resize'
                win.on('resize', function() {
                    that.emit('resized')
                })
                // 'will-move'
                // 'move'
                win.on('move', function() {
                    that.emit('moved')
                })
                win.on('enter-fullscreen', function() {
                    that.emit('enter-full-screen')
                })
                win.on('leave-fullscreen', function() {
                    that.emit('leave-full-screen')
                })
                // 'enter-html-full-screen'
                // 'leave-html-full-screen'
                // 'always-on-top-changed'
                win.on('devtools-opened', function() {
                    if (!that._devTools) {
                        win.closeDevTools()
                        return
                    }
                    that.webContents._isDevToolsOpen = true
                })
                win.on('devtools-closed', function() {
                    that.webContents._isDevToolsOpen = false
                })
                that._isFocused = that._visible

                that.emit('ready-to-show')
                
                resolve();
            })
        })
    }
    _toggleMenubar() {
        if (!this._autoHideMenuBar) {
            return
        }
        this.window.menu = this._menuBarVisible ? null : this.menu._nwjsMainMenu()
        this._menuBarVisible = !this._menuBarVisible
    }



    get webContents() {
        return this._webContents
    }
    get id() {
        return this._id
    }
    get autoHideMenuBar() {
        return this.isMenuBarAutoHide()
    }
    set autoHideMenuBar(val) {
        this.setAutoHideMenuBar(val)
    }
    get simpleFullScreen() {
        return this.isSimpleFullScreen()
    }
    set simpleFullScreen(val) {
        this.setSimpleFullScreen(val)
    }
    get fullscreen() {
        return this.isFullScreen()
    }
    set fullscreen(val) {
        this.setFullScreen(val)
    }
    get focusable() {
        return this.isFocusable()
    }
    set focusable(val) {
        this.setFocusable(val)
    }
    get visibleOnAllWorkspaces() {
        return this.isVisibleOnAllWorkspaces()
    }
    set visibleOnAllWorkspaces(val) {
        this.setVisibleOnAllWorkspaces(val)
    }
    get shadow() {
        return this.hasShadow()
    }
    set shadow(val) {
        this.setHasShadow(val)
    }
    get menuBarVisible() {
        return this.isMenuBarVisible()
    }
    set menuBarVisible(val) {
        this.setMenuBarVisibility(val)
    }
    get kiosk() {
        return this.isKiosk()
    }
    set kiosk(val) {
        this.setKiosk(val)
    }
    get documentEdited() {
        return this.isDocumentEdited()
    }
    set documentEdited(val) {
        this.setDocumentEdited(val)
    }
    get representedFilename() {
        return this.getRepresentedFilename()
    }
    set representedFilename(val) {
        this.setRepresentedFilename(val)
    }
    get title() {
        return this.getTitle()
    }
    set title(val) {
        this.setTitle(val)
    }
    get minimizable() {
        return this.isMinimizable()
    }
    set minimizable(val) {
        this.setMinimizable(val)
    }
    get maximizable() {
        return this.isMaximizable()
    }
    set maximizable(val) {
        this.setMaximizable(val)
    }
    get fullscreenable() {
        return this.isFullScreenable()
    }
    set fullscreenable(val) {
        this.setFullScreenable(val)
    }
    get resizable() {
        return this.isResizable()
    }
    set resizable(val) {
        this.setResizable(val)
    }
    get closable() {
        return this.isClosable()
    }
    set closable(val) {
        return this.setClosable(val)
    }
    get movable() {
        return this.isMovable()
    }
    set movable(val) {
        this.setMovable(val)
    }
    get excludedFromShownWindowsMenu() {
        return false
    }
    set excludedFromShownWindowsMenu(val) {
        if (val) {
            throwUnsupportedException("BrowserWindow.excludedFromShownWindowsMenu can't accept the value 'true'")
        }
    }
    get accessibleTitle() {
        return undefined
    }
    set accessibleTitle(val) {
        if (val) {
            throwUnsupportedException("BrowserWindow.accessibleTitle can't accept a value different from undefined")
        }
    }


    destroy() {
        let that = this
        this._getWindow().then(win => {
            win.close(true)
            that._isDestroyed = true
        });
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
    isDestroyed() {
        return this._isDestroyed === true
    }
    show() {
        this._visible = true;
        this._getWindow().then(win => win.show());
    }
    showInactive() {
        // TODO: 
    }
    hide() {
        this._visible = false;
        this._getWindow().then(win => win.hide());
    }
    isVisible() {
        return this._visible;
    }
    // isModal
    maximize() {
        this._getWindow().then(win => win.maximize());
    }
    unmaximize() {
        this._getWindow().then(win => win.unmaximize());
    }
    isMaximized() {
        return this._getChromeWindow().isMaximized()
    }
    minimize() {
        this._getWindow().then(win => win.minimize());
    }
    restore() {
        this._getWindow().then(win => win.restore());
    }
    isMinimized() {
        return this._getChromeWindow().isMinimized()
    }
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
    setSimpleFullScreen(simpleFullscreen) {
        if (simpleFullscreen) {
            throwUnsupportedException("BrowserWindow.setSimpleFullScreen can't accept the value 'true'")
        }
    }
    isSimpleFullScreen() {
        return false
    }
    isNormal() {
        return !this.isMaximized() && !this.isMinimized() && !this.isFullScreen()
    }
    // setAspectRatio
    setBackgroundColor(backgroundColor) {
        this._backgroundColor = backgroundColor
        this._getWindow().then(win => {
            const document = win.window.document
            document.body.style["background-color"] = backgroundColor;
        });
    }
    // previewFile
    // closeFilePreview
    setBounds({x, y, width, height}, animate) {
        if (animate) {
            throwUnsupportedException("BrowserWindow.setBounds can't support the 'animate' argument")
        }
        let bounds = {
            left: x,
            top: y,
            width: width,
            height: height
        }
        this._getChromeWindow().setBounds(bounds)
    }
    getBounds() {
        let bounds = this._getChromeWindow().getBounds()
        return {
            x: bounds.left,
            y: bounds.top,
            width: bounds.width,
            height: bounds.height
        }
    }
    getBackgroundColor() {
        return this._backgroundColor
    }
    // setContentBounds
    // getContentBounds
    // getNormalBounds
    setEnabled(enabled) {
        if (!enabled) {
            throwUnsupportedException("BrowserWindow.setEnabled can't accept the value 'false'")
        }
    }
    isEnabled() {
        return true
    }
    setSize(width, height) {
        this._width = width
        this._height = height
        this._getWindow().then(win => win.resizeTo(width, height));
    }
    getSize() {
        const win = this.window
        return [win?.width || this._width, win?.height || this._height]
    }
    setContentSize(width, height, animate) {
        throwUnsupportedException("BrowserWindow.setContentSize isn't implemented")
    }
    getContentSize() {
        const win = this.window
        if (!win) {
            return [undefined, undefined]
        }
        return [win.window.document.clientWidth, win.window.document.clientHeight]
    }
    setMinimumSize(width, height) {
        this._minWidth = width
        this._minHeight = height
        this._getWindow().then(win => win.setMinimumSize(width, height));
    }
    getMinimumSize() {
        return [this._minWidth, this._minHeight]
    }
    setMaximumSize(width, height) {
        this._maxWidth = width
        this._maxHeight = height
        this._getWindow().then(win => win.setMaximumSize(width, height));
    }
    getMaximumSize() {
        return [this._maxWidth, this._maxHeight]
    }
    setResizable(resizable) {
        this._resizable = resizable;
        this._getWindow().then(win => win.setResizable(resizable));
    }
    isResizable() {
        return this._resizable;
    }
    setMovable(movable) {
        if (!movable) {
            throwUnsupportedException("BrowserWindow.setMovable can't accept the value 'false'")
        }
    }
    isMovable() {
        return true
    }
    setMinimizable(minimizable) {
        if (!minimizable) {
            throwUnsupportedException("BrowserWindow.setMinimizable can't accept the value 'false'")
        }
    }
    isMinimizable() {
        return true
    }
    setMaximizable(maximizable) {
        if (!maximizable) {
            throwUnsupportedException("BrowserWindow.setMaximizable can't accept the value 'false'")
        }
    }
    isMaximizable() {
        return true
    }
    setFullScreenable(fullScreenable) {
        if (!fullScreenable) {
            throwUnsupportedException("BrowserWindow.setFullScreenable can't accept the value 'false'")
        }
    }
    isFullScreenable() {
        return true
    }
    setClosable(closable) {
        if (!closable) {
            throwUnsupportedException("BrowserWindow.setClosable can't accept the value 'false'")
        }
    }
    isClosable() {
        return true
    }
    setAlwaysOnTop(flag) {
        this._getWindow().then(win => win.setAlwaysOnTop(flag));
    }
    isAlwaysOnTop() {
        return this.window.isAlwaysOnTop;
    }
    // moveAbove
    // moveTop
    center() {
        let that = this
        this._getWindow().then(win => {
            // The position 'center' attribute not always work; this is a workaround
            const screens = nw.Screen.screens
            if (screens.length === 1) {
                const screenSize = screens[0].bounds
                that._x = (screenSize.width - that._width)/2
                that._y = (screenSize.height - that._height)/2
                win.moveTo(that._x, that._y)
                return
            }

            win.setPosition('center')
        });
    }
    setPosition(x, y, animate) {
        if (animate) {
            throwUnsupportedException("BrowserWindow.setPosition can't support the 'animate' argument")
        }
        this._x = x
        this._y = y
        this._getWindow().then(win => win.moveTo(x, y));
    }
    getPosition() {
        const win = this.window
        return [win?.x || this._x, win?.y || this._y]
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
        if (!__nwjs_feature_show_in_taskbar_available) {
            throwUnsupportedException("BrowserWindow.setSkipTaskbar isn't supported in NW.js 0.18.8 or lower")
            return
        }
        this._getWindow().then(win => win.setShowInTaskbar(!skip));
    }
    setKiosk(kiosk) {
        this._kiosk = kiosk
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
        return this._kiosk
    }
    // isTabletMode
    // getMediaSourceId
    // getNativeWindowHandle
    // hookWindowMessage
    // isWindowMessageHooked
    // unhookWindowMessage
    // unhookAllWindowMessages
    setRepresentedFilename(representedFilename) {
        if (representedFilename) {
            throwUnsupportedException("BrowserWindow.setRepresentedFilename isn't implemented")
        }
    }
    getRepresentedFilename() {
        return undefined
    }
    setDocumentEdited(documentEdited) {
        if (!documentEdited) {
            throwUnsupportedException("BrowserWindow.setDocumentEdited can't accept the value 'false'")
        }
    }
    isDocumentEdited() {
        return false
    }
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
        if (options !== undefined) {
            throwUnsupportedException("BrowserWindow.loadURL can't support the 'options' argument")
        }
        if (url.startsWith("file:")) {
            url = require('path').relative(process.cwd(), require('url').fileURLToPath(url))
        }
        return await this._load(url)
    }
    async loadFile(filePath, options) {
        if (options !== undefined) {
            throwUnsupportedException("BrowserWindow.loadFile can't support the 'options' argument")
        }
        return await this._load(filePath)
    }
    reload() {
        this._getWindow().then(win => win.reload());
    }
    setMenu(menu) {
        this.menu = menu
        let that = this
        this._getWindow().then(win => {
            win.menu = that._menuBarVisible ? (that.menu === null ? null : that.menu._nwjsMainMenu()) : null
        });
    }
    removeMenu() {
        this.setMenu(null)
    }
    setProgressBar(progress, options) {

    }
    // setOverlayIcon
    setHasShadow(hasShadow) {
        this._shadow = hasShadow;
        this._getWindow().then(win => win.setShadow(hasShadow));
    }
    hasShadow() {
        return this._shadow;
    }
    setOpacity(opacity) {
        this._opacity = opacity
        this._getWindow().then(win => {
            const document = win.window.document
            document.body.style["opacity"] = `${opacity}`;
        });
    }
    getOpacity() {
        return this._opacity
    }
    // setShape
    // setThumbarButtons
    // setThumbnailClip
    // setThumbnailToolTip
    // setAppDetails
    // showDefinitionForSelection
    // setIcon
    // setWindowButtonVisibility
    setAutoHideMenuBar(hide) {
        this._autoHideMenuBar = hide
        this._menuBarVisible = hide
    }
    isMenuBarAutoHide() {
        return this._autoHideMenuBar
    }
    setMenuBarVisibility(visible) {
        this._menuBarVisible = visible
    }
    isMenuBarVisible() {
        return this._menuBarVisible
    }
    setVisibleOnAllWorkspaces(visible) {
        this._visibleOnAllWorkspaces = visible
        this._getWindow().then(win => win.setVisibleOnAllWorkspaces(visible));
    }
    isVisibleOnAllWorkspaces() {
        return this._visibleOnAllWorkspaces
    }
    // setIgnoreMouseEvents
    // setContentProtection
    setFocusable(focusable) {
        if (!focusable) {
            throwUnsupportedException("BrowserWindow.setFocusable can't accept the value 'false'")
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

    _getChromeWindow() {
        const id = this.id+""
        return chrome.app.window.getAll().filter(cw => cw.id === id).pop()
    }
    _forEachElementWithTagName(tagName, callback) {
        this._getWindow().then(win => {
            let winDocument = win.window.document
            winDocument.addEventListener("DOMNodeInserted", function(e) {
                try {
                    if (e.target.tagName.toLowerCase() === tagName) {
                        callback(e.target)
                    }
                } catch(ex) {}
            }, false);

            let webviews = [...winDocument.getElementsByTagName(tagName)]
            webviews.forEach(webview => callback(webview))
        })
    }
}
module.exports = BrowserWindow