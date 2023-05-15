/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/crash-reporter

  NW.js Docs
  https://docs.nwjs.io/en/latest/For%20Developers/Understanding%20Crash%20Dump/

  Submit crash reports to a remote server.

  NW.js doesn't allow you to configure crash reports while the application is
  already running.
*/

const app = require('./app')

class crashReporter {
  static submitURL;
  static productName = app.name;
  static uploadToServer = true;
  static ignoreSystemCrashHandler = false;
  static rateLimit = false;
  static extra = {}
  static globalExtra = {}

  static get companyName() {
    return this.globalExtra?._companyName
  }
  static set companyName(companyName) {
    this.globalExtra = this.globalExtra || {}
    this.globalExtra._companyName = companyName
  }

  static start(options) {
    this.submitURL = options.submitURL || this.submitURL
    this.productName = options.productName || this.productName
    this.companyName = options.companyName || this.companyName
    this.uploadToServer = options.uploadToServer || this.uploadToServer
    this.ignoreSystemCrashHandler = options.ignoreSystemCrashHandler || this.ignoreSystemCrashHandler
    this.rateLimit = options.rateLimit || this.rateLimit
    this.extra = Object.assign({}, this.extra, options.extra);
    this.globalExtra = Object.assign({}, this.globalExtra, options.globalExtra);
  }

  static getUploadToServer() {
    return this.uploadToServer
  }
  static setUploadToServer(uploadToServer) {
    this.uploadToServer = uploadToServer || this.uploadToServer
  }
  static addExtraParameter(key, value) {
    this.extra[key] = value
  }
  static removeExtraParameter(key) {
    delete this.extra[key]
  }
  static getParameters() {
    return this.extra
  }

  static _minidumpFolder() {
    return app.getPath("crashDumps")
  }
  static _buildCrashReportPayload(process_type, file) {
    let payload = {
      ver: __electron_version,
      platform: process.platform,
      process_type: process_type,
      // guid string - e.g. '5e1286fc-da97-479e-918b-6bfb0c3d1c72'. machine unique identifier
      _version: __nwjs_app_version,
      _productName: this.productName,
      prod: "Electron",
      _companyName: this.companyName,
      upload_file_minidump: file
    }
    Object.assign(payload, this.extra)
    return payload
  }

  static getLastCrashReport() {
    return null
  }
  static getUploadedReports() {
    return []
  }
}
module.exports = crashReporter