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
    quit() {

    }
}

const globalShortcut = {
    register(combination, callback) {

    }
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

    destroy() {
        this.window.close(true);
    }
    close() {
        this.window.close();
    }
    focus() {
        this.window.focus();
    }
    blur() {
        this.window.blur();
    }
    // isFocused
    // isDestroyed
    show() {
        this.window.show();
        this.window.showValue = true;
    }
    // showInactive
    hide() {
        this.window.hide();
        this.window.showValue = false;
    }
    isVisible() {
        return this.window.showValue;
    }
    // isModal
    maximize() {
        this.window.maximize();
    }
    unmaximize() {
        this.window.unmaximize();
    }
    // isMaximized
    minimize() {
        this.window.minimize();
    }
    restore() {
        this.window.restore();
    }
    // isMinimized
    setFullScreen(flag) {
        if (flag) {
            this.window.enterFullscreen();
        } else {
            this.window.leaveFullscreen();
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
        this.window.resizeTo(width, height);
    }
    // getSize
    // setContentSize
    // getContentSize
    setMinimumSize(width, height) {
        this.window.setMinimumSize(width, height);
    }
    // getMinimumSize
    setMaximumSize(width, height) {
        this.window.setMaximumSize(width, height);
    }
    // getMaximumSize
    setResizable(resizable) {
        this.resizable = resizable;
        this.window.setResizable(resizable);
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
        this.window.setAlwaysOnTop(flag);
    }
    isAlwaysOnTop() {
        return this.window.isAlwaysOnTop;
    }
    // moveAbove
    // moveTop
    center() {
        this.window.setPosition('center');
    }
    // setPosition
    // getPosition
    setTitle(title) {
        this.window.title = title;
    }
    getTitle() {
        return this.window.title;
    }
    // setSheetOffset
    flashFrame(flag) {
        this.window.requestAttention(true);
    }
    setSkipTaskbar(skip) {
        this.window.setShowInTaskbar(skip);
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

        const window = this.window;
        return new Promise((resolve, reject) => {
            window.capturePage((base64Image) => {
                reject();
            },
            {format:'png', datatype:'raw'});
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
        this.window.reload();
    }
    // setMenu
    // removeMenu
    // setProgressBar
    // setOverlayIcon
    setHasShadow(hasShadow) {
        this.hasShadowValue = hasShadow;
        this.window.setShadow(hasShadow);
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
        // 'page-title-updated'
        
        if (event === 'close') {
            return this.window.on('close', callback);
        }
        if (event === 'closed') {
            return this.window.on('closed', callback);
        }

        // 'session-end'
        // 'unresponsive'
        // 'responsive'
        
        if (event === 'blur') {
            return this.window.on('blur', callback);
        }
        if (event === 'focus') {
            return this.window.on('focus', callback);
        }

        // 'show'
        // 'hide'
        // 'ready-to-show'
        
        if (event === 'maximize') {
            return this.window.on('maximize', callback);
        }

        // 'unmaximize'
        
        if (event === 'minimize') {
            return this.window.on('minimize', callback);
        }
        if (event === 'restore') {
            return this.window.on('restore', callback);
        }
        
        // 'will-resize'
        // 'resize'

        if (event === 'resized') {
            return this.window.on('resize', callback);
        }
        
        // 'will-move'
        // 'move'
        
        if (event === 'moved') {
            return this.window.on('move', callback);
        }
        if (event === 'enter-full-screen') {
            return this.window.on('enter-fullscreen', callback);
        }
        if (event === 'leave-full-screen') {
            return this.window.on('leave-fullscreen', callback);
        }

        // 'enter-html-full-screen'
        // 'leave-html-full-screen'
        // 'always-on-top-changed'

        throw new Error("Unknown event type");
    }
}

module.exports = {
    app,
    BrowserWindow, 
    globalShortcut, 
    isPackaged: __nwjs_is_packaged
}