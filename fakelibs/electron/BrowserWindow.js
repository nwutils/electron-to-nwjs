/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/browser-window

  NW.js Docs
  https://docs.nwjs.io/en/latest/References/Window/

  Create and control browser windows. Only available in the main process.
*/

const app = require('./app')
const WebContents = require('./WebContents')
const NativeImage = require('./nativeImage')
const BrowserWindowManager = require('./utils/BrowserWindowManager')
const throwUnsupportedException = require('./utils/unsupported-exception')

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
        this._showMenubar = opts.menuBarVisible || opts.autoHideMenuBar !== true
        // documentEdited
        // representedFilename
        // excludedFromShownWindowsMenu
        // accessibleTitle

        BrowserWindowManager.addWindow(this)

        this.on('closed', function() {
            BrowserWindowManager.removeWindowById(id)
            
            if (BrowserWindowManager.getAllWindows().length === 0) {
                app.dispatchEvent(new Event("window-all-closed"))
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

    static _getCurrentWindow() {
        const windowId = window.__nwjs_window_id
        if (windowId === undefined) {
            return undefined
        }
        try {
            return BrowserWindowManager.getAllWindows().filter(bw => bw.id === windowId).shift()
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
                that.setMenu(global.__nwjs_app_menu)
                win.eval(null, `window.__nwjs_window_id = ${that.id};`)

                if (that.centerOnStart) {
                    that.center()
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
        let that = this
        this._getWindow().then(win => {
            // The position 'center' attribute not always work; this is a workaround
            const screens = nw.Screen.screens
            if (screens.length === 1) {
                const screenSize = screens[0].bounds
                that.x = (screenSize.width - that.width)/2
                that.y = (screenSize.height - that.height)/2
                win.moveTo(that.x, that.y)
                return
            }

            win.setPosition('center')
        });
    }
    setPosition(x, y, animate) {
        if (animate) {
            throwUnsupportedException("BrowserWindow.setPosition can't support the 'animate' argument")
        }
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
        this._getWindow().then(win => win.setShowInTaskbar(!skip));
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
        if (options !== undefined) {
            throwUnsupportedException("BrowserWindow.loadURL can't support the 'options' argument")
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
module.exports = BrowserWindow