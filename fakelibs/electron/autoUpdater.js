/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/auto-updater
  https://github.com/Squirrel/Squirrel.Mac#update-file-json-format
  https://github.com/Squirrel/Squirrel.Windows/blob/develop/docs/getting-started/5-updating.md

  JS Docs
  https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHTTPRequest
  https://www.w3schools.com/xml/xml_http.asp
  ?

  Enable apps to automatically update themselves.
  Only available in the main process.

  ?
*/

const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')
const app = require('./app')
const DownloadItem = require('./utils/DownloadItem')

const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';

class AutoUpdater extends EventEmitter {
    constructor() {
        super()
    }
    setFeedURL({url, headers, serverType}) {
        this._feedUrl = url
        this._headers = headers || {}
        this._squirrelServerType = serverType || "default"

        this._latestVersion = {}
        this._downloadPath = undefined
    }
    getFeedURL() {
        return this._feedUrl
    }
    checkForUpdates() {
        if (isLinux) {
            throw new Error("autoUpdater is not supported on Linux")
        }
        if (!this._feedUrl) {
            throw new Error("You need to call setFeedURL before calling checkForUpdates")
        }

        this.emit("checking-for-update")

        if (!__nwjs_is_packaged) {
            this.emit("update-not-available")
        }

        let that = this
        let xmlhttp = new XMLHttpRequest();
        const headers = this.__headers
        Object.keys(headers).forEach(headerName => {
            xmlhttp.setRequestHeader(headerName, headers[headerName])
        })
        xmlhttp.responseType = "arraybuffer";
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                try {
                    const arraybuffer = xmlhttp.response
                    const buffer = Buffer.from(arraybuffer)
                    const string = buffer.toString()
                    that._parseUpdateMetadata(string)
                }
                catch(e) {
                    that.emit("error")
                }
            }
        };
        xmlhttp.open("GET", this._feedUrl, true);
        xmlhttp.send();
    }
    quitAndInstall() {
        if (isLinux) {
            throw new Error("autoUpdater is not supported on Linux")
        }
        this.emit('before-quit-for-update')
    }

    _parseUpdateMetadata(string) {
        const updateData = JSON.parse(string)
        if (this._squirrelServerType === "default") {
            const {url, name, notes, pub_date} = updateData
            this._latestVersion = {url, name, notes, pub_date}
        }
        else {
            const currentReleaseVersion = updateData.currentRelease
            const currentRelease = updateData.releases.filter(r => r.version === currentReleaseVersion).shift()
            if (currentRelease !== undefined) {
                const {url, name, notes, pub_date} = currentRelease.updateTo
                this._latestVersion = {url, name, notes, pub_date, version:currentReleaseVersion}
            }
        }

        if (this._latestVersion.url === undefined) {
            this.emit("update-not-available")
            return
        }

        this.emit("update-available")
        this._downloadUpdate()
    }
    _downloadUpdate() {
        const version = this._latestVersion.version || "latest"
        const name = this._latestVersion.name
        const url = this._latestVersion.url
        const notes = this._latestVersion.notes
        const dateStr = this._latestVersion.pub_date
        const format = isMac ? "zip" : "nupkg"
        
        const downloadFolder = path.join(app.getPath("userData"), "packages")
        if (fs.existsSync(downloadFolder)) {
            fs.rmdirSync(downloadFolder, {recursive: true});
        }
        fs.mkdirSync(downloadFolder, {recursive:true})
        const downloadPath = path.join(downloadFolder, __nwjs_project_name + "-" + version + "." + format)
        this._downloadPath = downloadPath

        if (fs.existsSync(downloadPath)) {
            fs.rmSync(downloadPath)
        }

        let that = this
        const downloadItem = new DownloadItem(url)
        downloadItem.setSavePath(downloadPath)
        downloadItem.on("done", function() {
            that.emit("update-downloaded", {
                event: new Event("update-downloaded"),
                releaseNotes: notes, 
                releaseName: name,
                releaseDate: dateStr === undefined ? undefined : new Date(dateStr),
                updateURL: url
            })
        })
    }
}
module.exports = new AutoUpdater()