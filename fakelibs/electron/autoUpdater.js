/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/auto-updater

  JS Docs
  https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHTTPRequest
  https://www.w3schools.com/xml/xml_http.asp
  ?

  Enable apps to automatically update themselves.
  Only available in the main process.

  ?
*/

const EventEmitter = require('events');

class AutoUpdater extends EventEmitter {
    constructor() {
        super()
    }
    setFeedURL({url, headers, serverType}) {
        this._feedUrl = url
        this._headers = headers || {}
        this._squirrelServerType = serverType || "default"
    }
    getFeedURL() {
        return this._feedUrl
    }
    checkForUpdates() {
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
                const arraybuffer = xmlhttp.response
                const buffer = Buffer.from(arraybuffer)
                const string = buffer.toString()
                const updateData = JSON.parse(string)
                that._parseUpdateMetadata(updateData)
            }
        };
        xmlhttp.open("GET", this._feedUrl, true);
        xmlhttp.send();
    }
    quitAndInstall() {
        
    }

    _parseUpdateMetadata(updateData) {
        if (this._squirrelServerType === "default") {
            const {url, name, notes, pub_date} = updateData
            this._startUpdate(url, name, notes, pub_date)
        }
        else {
            const currentReleaseVersion = updateData.currentRelease
            const currentRelease = updateData.releases.filter(r => r.version === currentReleaseVersion).shift()
            const {url, name, notes, pub_date} = currentRelease.updateTo
            this._startUpdate(url, name, notes, pub_date, currentReleaseVersion)
        }
    }
    _startUpdate(url, name, notes, pub_date, version) {

    }
}
module.exports = new AutoUpdater()