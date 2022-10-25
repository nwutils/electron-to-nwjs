/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/dialog

  NW.js Docs
  https://github.com/nwjs/nw.js/wiki/File-dialogs
  https://github.com/nwjs/nw.js/issues/3430
  https://docs.nwjs.io/en/latest/References/Changes%20to%20DOM/

  Display native system dialogs for opening and saving files, alerting, etc.
  Only available in the main process.

  NW.js uses the browser methods to start dialogs, with <input type='file' />,
  but it has some properties and events exclusive to NW.js, which make input file
  a decent replacement for Electron's showOpenDialog and showSaveDialog, even
  if it doesn't support all Electron's options.

  The browser functions confirm() and alert() are also available.
*/

const applescript = require('../utils/applescript')
const throwUnsupportedException = require('../utils/unsupported-exception')
const BaseDialog = require('./base')

class MacDialog extends BaseDialog {
  static showOpenDialogSync(window, {title, defaultPath, buttonLabel, filters, properties, message, securityScopedBookmarks}) {
    properties = properties || []
    const openFile = properties.includes('openFile')
    const openDirectory = properties.includes('openDirectory')
    const multiSelections = properties.includes('multiSelections')
    const showHiddenFiles = properties.includes('showHiddenFiles')
    const createDirectory = properties.includes('createDirectory')
    const promptToCreate = properties.includes('promptToCreate')
    const noResolveAliases = properties.includes('noResolveAliases')
    const treatPackageAsDirectory = properties.includes('treatPackageAsDirectory')
    const dontAddToRecent = properties.includes('dontAddToRecent')

    if (showHiddenFiles) {
      throwUnsupportedException("dialog.showOpenDialog can't support the 'showHiddenFiles' value in the 'properties' argument")
    }
    if (createDirectory) {
      throwUnsupportedException("dialog.showOpenDialog can't support the 'createDirectory' value in the 'properties' argument")
    }
    if (promptToCreate) {
      throwUnsupportedException("dialog.showOpenDialog can't support the 'promptToCreate' value in the 'properties' argument")
    }
    if (noResolveAliases) {
      throwUnsupportedException("dialog.showOpenDialog can't support the 'noResolveAliases' value in the 'properties' argument")
    }
    if (treatPackageAsDirectory) {
      throwUnsupportedException("dialog.showOpenDialog can't support the 'treatPackageAsDirectory' value in the 'properties' argument")
    }
    if (dontAddToRecent) {
      throwUnsupportedException("dialog.showOpenDialog can't support the 'dontAddToRecent' value in the 'properties' argument")
    }


  }
  static async showOpenDialog(window, opts) {
    let response = this.showOpenDialogSync(window, opts)
    return {
      canceled: response === undefined,
      filePaths: response
    }
  }
  static showSaveDialogSync(window, {title, defaultPath, buttonLabel, filters, message, nameFieldLabel, showsTagField, properties, securityScopedBookmarks}) {
    properties = properties || []
    const showHiddenFiles = properties.includes('showHiddenFiles')
    const createDirectory = properties.includes('createDirectory')
    const treatPackageAsDirectory = properties.includes('treatPackageAsDirectory')
    const showOverwriteConfirmation = properties.includes('showOverwriteConfirmation')
    const dontAddToRecent = properties.includes('dontAddToRecent')

    if (showHiddenFiles) {
      throwUnsupportedException("dialog.showOpenDialog can't support the 'showHiddenFiles' value in the 'properties' argument")
    }
    if (createDirectory) {
      throwUnsupportedException("dialog.showOpenDialog can't support the 'createDirectory' value in the 'properties' argument")
    }
    if (treatPackageAsDirectory) {
      throwUnsupportedException("dialog.showOpenDialog can't support the 'treatPackageAsDirectory' value in the 'properties' argument")
    }
    if (showOverwriteConfirmation) {
      throwUnsupportedException("dialog.showOpenDialog can't support the 'showOverwriteConfirmation' value in the 'properties' argument")
    }
    if (dontAddToRecent) {
      throwUnsupportedException("dialog.showOpenDialog can't support the 'dontAddToRecent' value in the 'properties' argument")
    }

    
  }
  static async showSaveDialog(window, opts) {
    let response = this.showSaveDialogSync(window, opts)
    return {
      canceled: response === undefined,
      filePath: response
    }
  }
  static showMessageBoxSync(window, {message, type, buttons, defaultId, title, detail, icon, textWidth, cancelId, noLink, normalizeAccessKeys}) {
    const titleArgs = title === undefined ? "" : `with title ${JSON.stringify(title)}`
    const buttonsArgs = buttons === undefined ? "" : `buttons {${buttons.map(b => JSON.stringify(b)).join(", ")}}`
    const defaultBtnArgs = (buttons === undefined || defaultId === undefined) ? "" : `default button ${JSON.stringify(buttons[defaultId])}`
    const cancelBtnArgs = (buttons === undefined || cancelId === undefined) ? "" : `cancel button ${JSON.stringify(buttons[cancelId])}`

    const displayDialogIconByIcon = {
        "none": undefined,
        "info": "note",
        "error": "stop",
        "question": undefined,
        "warning": "caution"
    }
    const displayDialogIcon = displayDialogIconByIcon[type || "none"]
    const iconArgs = displayDialogIcon === undefined ? "" : `with icon ${displayDialogIcon}`
    let spawn = applescript.eval(`
      set theDialogText to ${JSON.stringify(message)}
      set theDialog to display dialog theDialogText ${buttonsArgs} ${defaultBtnArgs} ${cancelBtnArgs} ${titleArgs} ${iconArgs}
      button returned of theDialog
    `)
    if (spawn.status === 1) {
      return cancelId
    }
  
    let response = spawn.stdout
    if (response === null) {
      return null
    }
    return buttons.indexOf(response.trim())
  }
  static async showMessageBox(window, opts) {

  }
  static showErrorBox(title, opts) {

  }
  static async showCertificateTrustDialog(window, opts) {

  }
}
module.exports = MacDialog