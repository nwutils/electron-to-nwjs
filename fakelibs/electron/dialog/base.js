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

const path = require('path');
const BrowserWindowManager = require('../utils/BrowserWindowManager')
const throwUnsupportedException = require('../utils/unsupported-exception')

const runAndRemoveInputFile = function(input) {
  return new Promise((resolve, reject) => {
    input.addEventListener('oncancel', function() {
      reject()
    });
    input.addEventListener('change', function(evt) {
      let files = evt.target.files
      let filePaths = []
      for (var i = 0; i < files.length; ++i) {
        filePaths.push(files[i].path);
      }
      try {
        input.remove()
      }
      finally {
        resolve(filePaths)
      }
    }, {once:true});
    input.click();
  })
}

class BaseDialog {
  static showOpenDialogSync(window, opts) {

  }
  static async showOpenDialog(window, opts) {
    if (opts === undefined) {
      opts = window
      window = BrowserWindowManager.getFocusedWindow()
    }
    let {title, defaultPath, buttonLabel, filters, properties, message, securityScopedBookmarks} = opts
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

    const document = await window._getDocument()
    
    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";
    if (defaultPath) {
      input.setAttribute("nwworkingdir", defaultPath)
    }
    if (openDirectory) {
      input.setAttribute("webkitdirectory","");
    }
    if (multiSelections) {
      input.setAttribute("multiple","");
    }
    document.body.appendChild(input);

    try {
      let filePaths = await runAndRemoveInputFile(input)
      return {canceled:false, filePaths:filePaths}
    }
    catch(e) {
      return {canceled:true, filePaths:[]}
    }
  }
  static showSaveDialogSync(window, opts) {
    
  }
  static async showSaveDialog(window, opts) {
    if (opts === undefined) {
      opts = window
      window = BrowserWindowManager.getFocusedWindow()
    }
    let {title, defaultPath, buttonLabel, filters, message, nameFieldLabel, showsTagField, properties, securityScopedBookmarks} = opts
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

    const document = await window._getDocument()

    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";
    input.setAttribute("nwsaveas", "")
    if (defaultPath) {
      const defaultPathIsFolder = path.extname(defaultPath).length === 0
      if (defaultPathIsFolder) {
        input.setAttribute("nwworkingdir", defaultPath)
      }
      else {
        input.setAttribute("nwsaveas", path.basename(defaultPath))
        input.setAttribute("nwworkingdir", path.dirname(defaultPath))
      }
    }
    document.body.appendChild(input);

    try {
      let filePaths = await runAndRemoveInputFile(input)
      return {canceled:false, filePath:filePaths[0]}
    }
    catch(e) {
      return {canceled:true, filePath:undefined}
    }
  }
  static showMessageBoxSync(window, opts) {
    if (opts === undefined) {
      opts = window
      window = BrowserWindowManager.getFocusedWindow()
    }
    let {message, type, buttons, defaultId, title, detail, icon, textWidth, cancelId, noLink, normalizeAccessKeys} = opts
    const windowDOM = window.window.window
    buttons = buttons || []

    if (buttons.length === 0) {
      if (type) {
        throwUnsupportedException("dialog.showMessageBoxSync can't support the 'type' property in the 'options' argument")
      }
      if (title) {
        throwUnsupportedException("dialog.showMessageBoxSync can't support the 'title' property in the 'options' argument")
      }
      if (icon) {
        throwUnsupportedException("dialog.showMessageBoxSync can't support the 'icon' property in the 'options' argument")
      }
      if (textWidth) {
        throwUnsupportedException("dialog.showMessageBoxSync can't support the 'textWidth' property in the 'options' argument")
      }

      windowDOM.alert(message + (detail === undefined ? "" : `\n\n${detail}`))
      return 0
    }

    throwUnsupportedException("dialog.showMessageBoxSync can't support the 'buttons' property in the 'options' argument")
    return -1
  }
  static async showMessageBox(window, opts) {
    let index = this.showMessageBoxSync(window, opts)
    return {
      response: index
    }
  }
  static showErrorBox(title, content) {
    this.showMessageBoxSync({message:content, type:"error", title})
  }
  static async showCertificateTrustDialog(window, opts) {

  }
}

module.exports = BaseDialog