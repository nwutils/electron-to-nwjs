/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/download-item

  JS Docs
  https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHTTPRequest
  https://www.w3schools.com/xml/xml_http.asp

  Control file downloads from remote sources.
  Only available in the main process.

  ?
*/

const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')
const dialog = require('../dialog')
const throwUnsupportedException = require('./unsupported-exception')

class DownloadItem extends EventEmitter {
    constructor(url, webContents) {
        super()
        this._url = url
        this._webContents = webContents
        this._savePath = undefined
        this._state = "progressing"
        this._startTime = Math.floor(Date.now() / 1000)

        let that = this
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.responseType = "arraybuffer";
        xmlhttp.onprogress = function(pe) {
            if (pe.lengthComputable) {
                that._totalSize = pe.total
                that._loadedSize = pe.loaded
            }
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                that._complete(xmlhttp.response)
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
        this._xmlhttp = xmlhttp
        this.emit("updated", new Event('updated'), this._state)

        this._updateInterval = setInterval(() => that._update(), 1000)
    }


    _update() {
        this.emit("updated", new Event('updated'), this._state)
    }
    async _complete(arraybuffer) {
        clearInterval(this._updateInterval);
        this._state = "completed"
        if (this._savePath === undefined) {
            let result = await dialog.showSaveDialog(this._webContents?._window, this._saveDialogOptions || {})
            if (result.canceled) {
                this._state = "cancelled"
                return
            }
            this._savePath = result.filePath
        }

        let dir = path.dirname(this._savePath)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive:true})
        }

        const buffer = Buffer.from(arraybuffer);
        fs.writeFileSync(this._savePath, buffer);
        this.emit("done", new Event('done'), this._state)
    }


    setSavePath(savePath) {
        this._savePath = savePath
    }
    getSavePath() {
        return this._savePath
    }
    setSaveDialogOptions(options) {
        this._saveDialogOptions = options
    }
    getSaveDialogOptions() {
        return this._saveDialogOptions
    }
    pause() {
        throwUnsupportedException("DownloadItem.pause isn't implemented")
    }
    isPaused() {
        return false
    }
    resume() {
        throwUnsupportedException("DownloadItem.resume isn't implemented")
    }
    canResume() {
        return false
    }
    cancel() {
        clearInterval(this._updateInterval);
        this._xmlhttp.abort();
        this._state = "cancelled"
        this.emit("done", new Event('done'), this._state)
    }
    getURL() {
        return this._url
    }
    getMimeType() {
        this._xmlhttp.getResponseHeader("Content-Type");
    }
    hasUserGesture() {
        return false // TODO
    }
    getFilename() {
        let contentDisposition = this.getContentDisposition()
        if (!contentDisposition) {
            return this.getURL().split("/").pop()
        }
        
        let filenameSep = "filename="
        let contentDispositionParts = contentDisposition.split(filenameSep)
        contentDispositionParts.shift()
        let filename = contentDispositionParts.join(filenameSep)

        if (filename.startsWith('"')) {
            return filename.split('"')[1]
        }
        return filename
    }
    getTotalBytes() {
        return this._totalSize || 0
    }
    getReceivedBytes() {
        return this._loadedSize || 0
    }
    getContentDisposition() {
        return this._xmlhttp.getResponseHeader('Content-Disposition')
    }
    getState() {
        return this._state
    }
    getURLChain() {
        let responseURL = this._xmlhttp.responseURL
        if (this._url === responseURL) {
            return [this._url]
        } else {
            return [this._url, responseURL]
        }
    }
    getLastModifiedTime() {
        return this._xmlhttp.getResponseHeader('Last-Modified')
    }
    getETag() {
        return this._xmlhttp.getResponseHeader('ETag')
    }
    getStartTime() {
        return this._startTime
    }

    get savePath() {
        return this.getSavePath()
    }
    set savePath(savePath) {
        this.setSavePath(savePath)
    }
}

module.exports = DownloadItem