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
const child_process = require('child_process')
const NativeImage = require('./nativeImage')

const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';

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


    _onceEvents: {},
    _events: {},
    dispatchEvent(event) {
        let listener = this._events[event.type];
        if (listener) {
            listener(event);
        }
        let onceListener = this._onceEvents[event.type];
        if (onceListener) {
            onceListener(event);
            delete this._onceEvents[event.type];
        }
    },
    on(event, listener) {
        this._events[event] = listener;
        return this;
    },
    once(event, listener) {
        this._onceEvents[event] = listener;
        return this;
    },


    quit() {
        nw.App.quit()
    },
    // exit([exitCode])
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
    },
    _ready() {
        this._isReady = true
        this.dispatchEvent(new Event("ready"));
    },
    isReady() {
        return this._isReady === true
    },
    whenReady() {
        let that = this
        return new Promise((resolve, reject) => {
            let test = function() {
                if (that._isReady === true) {
                    resolve()
                }
                else {
                    setTimeout(test, 100)
                }
            }
            test()
        })
    },
    // focus([options])
    // hide() (macOS only)
    // isHidden() (macOS only)
    // show() (macOS only)
    // setAppLogsPath([path])
    getAppPath() {
        return nw.App.startPath;
    },
    getPath(name) {
        switch(name) {
            case "home":        return os.homedir();
            case "appData":     return path.dirname(this.getPath("userData"));
            case "userData":    return path.dirname(nw.App.dataPath);
            case "sessionData": break;
            case "temp":        return os.tmpdir();
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
        if (!isMac || !this.isPackaged) {
            return true
        }
        return this.getAppPath().contains("/Applications/")
    },
    moveToApplicationsFolder() {
        if (!isMac || !this.isPackaged) {
            return true
        }
        // TODO
    }
    // isSecureKeyboardEntryEnabled() (macOS only)
    // setSecureKeyboardEntryEnabled(enabled) (macOS only)
}
module.exports = app