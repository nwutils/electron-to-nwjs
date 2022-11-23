/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/app

  NW.js Docs
  https://docs.nwjs.io/en/latest/References/App/

  Control your application's event lifecycle.
  Only available in the main process.

  Many of the features implemented in Electron's app do not exist in NW.js's App,
  and may need to be created from scratch, or use different NW.js classes.
*/

const os = require('os');
const path = require('path');
const EventEmitter = require('events');
const child_process = require('child_process')
const NativeImage = require('./nativeImage')
const BrowserWindowManager = require('./utils/BrowserWindowManager')
const throwUnsupportedException = require('./utils/unsupported-exception')

const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';

class app extends EventEmitter {
    constructor() {
        super()

        const homeFolder = os.homedir()
        let userDataFolder = path.join(homeFolder, ".config", __nwjs_project_name);
        if (isMac) {
            userDataFolder = path.join(homeFolder, "Library", "Application Support", __nwjs_project_name);
        }
        if (isWindows) {
            userDataFolder = path.join(process.env.APPDATA, __nwjs_project_name)
        }
        this._pathsCache = {
            "home":        homeFolder,
            "appData":     path.dirname(userDataFolder),
            "userData":    userDataFolder,
            // "sessionData"
            "temp":        os.tmpdir(),
            "exe":         process.execPath,
            // "module"
            "desktop":     path.join(homeFolder, "Desktop"),
            "documents":   path.join(homeFolder, "Documents"),
            "downloads":   path.join(homeFolder, "Downloads"),
            "music":       path.join(homeFolder, "Music"),
            "pictures":    path.join(homeFolder, "Pictures"),
            "videos":      path.join(homeFolder, "Videos"),
            // "recent"
            // "logs"
            // "crashDumps"
        }
    }

    // accessibilitySupportEnabled (Windows and macOS only)
    // applicationMenu
    // badgeCount (Linux and macOS only)
    commandLine = {
        _lines: [],
        appendSwitch(key, value) {
            this._lines.push(value === undefined ? `--${key}` : `--${key}=${value}`)
        }
    }
    // dock (macOS only)
    isPackaged = __nwjs_is_packaged
    name = __nwjs_app_name
    // userAgentFallback
    // runningUnderARM64Translation (Windows and macOS only)


    quit() {
        nw.App.quit()
    }
    exit(exitCode) {
        process.exit(exitCode);
    }
    relaunch() {
        // TODO
        // https://github.com/nwjs/nw.js/issues/149

        const appPath = this.getAppPath()
        if (isLinux) {
            child_process.spawn("bash", ["-c", `sleep 1 && xdg-open "${appPath}"`])
        }
        if (isMac) {
            child_process.spawn("bash", ["-c", `sleep 1 && open "${appPath}"`])
        }
        this.quit()
    }
    _ready() {
        this._isReady = true
        this._whenReadyPromiseResolves.forEach(whenReadyPromiseResolves => whenReadyPromiseResolves())
        this.emit("ready");
    }
    isReady() {
        return this._isReady === true
    }
    _whenReadyPromiseResolves = []
    whenReady() {
        const that = this
        return new Promise((resolve, reject) => {
            if (that._isReady === true) {
                return resolve();
            }
            that._whenReadyPromiseResolves.push(resolve)
        })
    }
    focus(options) {
        if (options && options.steal) {
            throwUnsupportedException("app.focus can't support the 'options' argument")
        }
        let win = BrowserWindowManager.getAllWindows().filter(w => w.isVisible()).shift()
        if (win) {
            win.focus()
        }
    }
    hide() {
        BrowserWindowManager.getAllWindows().filter(w => w.isVisible()).forEach(w => w.hide())
    }
    isHidden() {
        return BrowserWindowManager.getAllWindows().filter(w => w.isVisible()).length === 0
    }
    show() {
        BrowserWindowManager.getAllWindows().filter(w => !w.isVisible()).forEach(w => w.showInactive())
    }
    // setAppLogsPath([path])
    getAppPath() {
        return nw.App.startPath;
    }
    getPath(name) {
        let val = this._pathsCache[name]
        if (val) {
            return val
        }
        throw new Error("Unknown path name: %s".replace("%s", name));
    }
    async getFileIcon(filePath) {
        return NativeImage.createFromPath(filePath)
    }
    setPath(name, path) {
        this._pathsCache[name] = path
    }
    getVersion() {
        return __nwjs_app_version;
    }
    getName() {
        return this.name
    }
    setName(name) {
        this.name = name
    }
    getLocale() {
        let env = process.env;
        // LC_ALL=
        // LC_MESSAGES="en_US.UTF-8"
        // LANG=en_US.UTF-8
        // LANGUAGE=en_US
        let lang = env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE
        return lang.replace("_", "-").split(".").shift();
    }
    getLocaleCountryCode() {
        let locale = this.getLocale()
        if (locale.includes("-")) {
            return locale.split("-").pop()
        }
        return ""
    }
    getSystemLocale() {
        return window.navigator.language
    }
    getPreferredSystemLanguages() {
        return window.navigator.languages
    }
    // addRecentDocument(path) (Windows and macOS only)
    // clearRecentDocuments() (Windows and macOS only)
    setAsDefaultProtocolClient(protocol, path, args) {

    }
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

    }
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
        if (!isMac || !this.isPackaged) {
            return true
        }
        return this.getAppPath().contains("/Applications/")
    }
    moveToApplicationsFolder() {
        if (!isMac || !this.isPackaged) {
            return true
        }
        // TODO
    }
    // isSecureKeyboardEntryEnabled() (macOS only)
    // setSecureKeyboardEntryEnabled(enabled) (macOS only)
}
module.exports = new app()