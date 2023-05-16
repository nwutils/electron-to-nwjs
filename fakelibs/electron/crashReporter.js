/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/crash-reporter

  NW.js Docs
  https://docs.nwjs.io/en/latest/For%20Developers/Understanding%20Crash%20Dump/
  https://chromium.googlesource.com/chromiumos/platform2/+/master/crash-reporter/docs/design.md

  Submit crash reports to a remote server.

  NW.js doesn't allow you to configure crash reports while the application is
  already running.
*/

const app = require('./app')
const fs = require('fs')
const path = require('path')

class crashReporter {
  _submitURL;
  _productName = app.name;
  _uploadToServer = true;
  _ignoreSystemCrashHandler = false;
  _rateLimit = false;
  _extra = {}
  _globalExtra = {}

  get _companyName() {
    return this._globalExtra?._companyName
  }
  set _companyName(companyName) {
    this._globalExtra = this._globalExtra || {}
    this._globalExtra._companyName = companyName
  }

  start(options) {
    this._submitURL = options.submitURL || this._submitURL
    this._productName = options.productName || this._productName
    this._companyName = options.companyName || this._companyName
    this._uploadToServer = options.uploadToServer || this._uploadToServer
    this._ignoreSystemCrashHandler = options.ignoreSystemCrashHandler || this._ignoreSystemCrashHandler
    this._rateLimit = options.rateLimit || this._rateLimit
    this._extra = Object.assign({}, this._extra, options.extra);
    this._globalExtra = Object.assign({}, this._globalExtra, options.globalExtra);
  }

  getUploadToServer() {
    return this._uploadToServer
  }
  setUploadToServer(uploadToServer) {
    this._uploadToServer = uploadToServer || this._uploadToServer
  }
  addExtraParameter(key, value) {
    this._extra[key] = value
  }
  removeExtraParameter(key) {
    delete this._extra[key]
  }
  getParameters() {
    return this._extra
  }

  _minidumpFolder() {
    return app.getPath("crashDumps")
  }
  _buildCrashReportPayload(dmpFilePath) {
    let payload = {
      ver: __electron_version,
      platform: process.platform,
      process_type: __nwjs_is_main ? "main" : "renderer",
      // guid string - e.g. '5e1286fc-da97-479e-918b-6bfb0c3d1c72'. machine unique identifier
      _version: __nwjs_app_version,
      _productName: this._productName,
      prod: "Electron",
      _companyName: this._companyName,
      upload_file_minidump: fs.createReadStream(dmpFilePath)
    }
    Object.assign(payload, this._extra)
    return payload
  }
  _onReady() {
    let submitURL = this._submitURL
    if (!submitURL) {
      return
    }
    let minidumpFolder = this._minidumpFolder()
    let pendingDumpsFolder = path.join(minidumpFolder, "completed")
    let completedDumpsFolder = path.join(minidumpFolder, "completed_electron_to_nwjs")

    if (!fs.existsSync(completedDumpsFolder)) {
      fs.mkdirSync(completedDumpsFolder)
    }

    let uuids = fs.readdirSync(pendingDumpsFolder).filter(file => file.endsWith(".dmp"))
                  .map(file => file.substring(0, file.length - ".dmp".length))
    for (let uuid of uuids) {
      let dmpOriginalFilePath  = path.join(pendingDumpsFolder, uuid + ".dmp")
      let metaOriginalFilePath = path.join(pendingDumpsFolder, uuid + ".meta")
      let dmpFinalFilePath  = path.join(pendingDumpsFolder, uuid + ".dmp")
      let metaFinalFilePath = path.join(pendingDumpsFolder, uuid + ".meta")

      // TODO: Retrieve app name and version from meta file

      var xhr = new XMLHttpRequest();
      const form = new FormData();
      const options = this._buildCrashReportPayload(dmpOriginalFilePath)
      Object.keys(options).forEach(optKey => form.append(optKey, options[optKey]))
      xhr.onload = function() {
        fs.renameSync(dmpOriginalFilePath, dmpFinalFilePath)
        fs.renameSync(metaOriginalFilePath, metaFinalFilePath)
      }
      xhr.open("post", submitURL);
      xhr.send(form);
    }
  }

  getLastCrashReport() {
    return this.getUploadedReports().reduce((a, b) => a.date.getTime() > b.date.getTime() ? a : b)
  }
  getUploadedReports() {
    let completedDumpsFolder = path.join(minidumpFolder, "completed_electron_to_nwjs")
    let files = fs.readdirSync(completedDumpsFolder).filter(file => file.endsWith(".meta"))
    let reports = files.map(file => {
      let id = file.substring(0, file.length - ".meta".length)
      let filePath = path.join(completedDumpsFolder, file)
      let date = new Date() // Load date from filePath
      return {id, date}
    })
    return reports
  }
}

let crashReporterInstance = new crashReporter()

app.on('ready', function(){
  crashReporterInstance._onReady()
})

module.exports = crashReporterInstance