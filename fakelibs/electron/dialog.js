/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/dialog

  NW.js Docs
  https://github.com/nwjs/nw.js/wiki/File-dialogs
  https://github.com/nwjs/nw.js/issues/3430

  Display native system dialogs for opening and saving files, alerting, etc.
  Only available in the main process.

  NW.js uses the browser methods to start dialogs, with <input type='file' />.
  Considering that, Electron's dialog will need to create those inputs dinamically
  to show open and save dialogs. The browwser functions confirm(), alert() and prompt()
  are also available.
*/

const dialog = {
  showOpenDialogSync(window, opts) {

  },
  showOpenDialog(window, opts) {

  },
  showSaveDialogSync(window, opts) {

  },
  showSaveDialog(window, opts) {

  },
  showMessageBoxSync(window, opts) {

  },
  showMessageBox(window, opts) {

  },
  showErrorBox(title, opts) {

  },
  showCertificateTrustDialog(window, opts) {

  }
}
module.exports = dialog