/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/dialog

  NW.js Docs
  https://github.com/nwjs/nw.js/wiki/File-dialogs
  https://github.com/nwjs/nw.js/issues/3430
  https://ghostoy-nw.readthedocs.io/en/readthedocs/References/File%20Dialogs/

  Display native system dialogs for opening and saving files, alerting, etc.
  Only available in the main process.

  NW.js uses the browser methods to start dialogs, with <input type='file' />.
  Considering that, Electron's dialog will need to create those inputs dinamically
  to show open and save dialogs. The browser functions confirm() and alert() are
  also available.
*/

const path = require('path');
const throwUnsupportedException = require('./utils/unsupported-exception')

const runAndRemoveInputFile = function(input) {
  return new Promise((resolve, reject) => {
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
  })
}

const dialog = {
  showOpenDialogSync(window, opts) {

  },
  async showOpenDialog(window, {title, defaultPath, buttonLabel, filters, properties, message, securityScopedBookmarks}) {
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

    const nwjsWin = await window._getWindow()
    const document = nwjsWin.window.document

    const input = document.createElement("input");
    input.type = "file";
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
  },
  showSaveDialogSync(window, opts) {
    
  },
  async showSaveDialog(window, {title, defaultPath, buttonLabel, filters, message, nameFieldLabel, showsTagField, properties, securityScopedBookmarks}) {
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

    const nwjsWin = await window._getWindow()
    const document = nwjsWin.window.document

    const input = document.createElement("input");
    input.type = "file";
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
  },
  showMessageBoxSync(window, {message, type, buttons, defaultId, title, detail, icon, textWidth, cancelId, noLink, normalizeAccessKeys}) {
    const windowDOM = window.window.window
    buttons = buttons || []

    if (buttons.length <= 1) {
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
      if (buttons.length == 1) {
        throwUnsupportedException("dialog.showMessageBoxSync can't support values in the 'buttons' property in the 'options' argument")
      }

      windowDOM.alert(message + (detail === undefined ? "" : `\n\n${detail}`))
      return 0
    }

    throwUnsupportedException("dialog.showMessageBoxSync implementation is not complete yet")
    return -1
  },
  async showMessageBox(window, opts) {

  },
  showErrorBox(title, opts) {

  },
  async showCertificateTrustDialog(window, opts) {

  }
}
module.exports = dialog