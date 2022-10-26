/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/dialog

  Applescript Docs
  https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/AppendixA-AppleScriptObjCQuickTranslationGuide.html
  https://developer.apple.com/library/archive/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-10.html
  https://github.com/JXA-Cookbook/JXA-Cookbook

  Display native system dialogs for opening and saving files, alerting, etc.
  Only available in the main process.

  Through AppleScript, it's possible to call the different types of dialogs.
  Some specific features are not available thought.
*/

const fs = require('fs')
const path = require('path')
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
    const noResolveAliases = properties.includes('noResolveAliases')
    const treatPackageAsDirectory = properties.includes('treatPackageAsDirectory')
    
    if (title) {
      throwUnsupportedException("dialog.showOpenDialogSync can't support the 'title' property in the 'properties' argument")
    }
    if (buttonLabel) {
      throwUnsupportedException("dialog.showOpenDialogSync can't support the 'buttonLabel' property in the 'properties' argument")
    }
    if (securityScopedBookmarks) {
      throwUnsupportedException("dialog.showOpenDialogSync can't support the 'securityScopedBookmarks' property in the 'properties' argument")
    }
    if (createDirectory) {
      throwUnsupportedException("dialog.showOpenDialogSync can't support the 'createDirectory' value in the 'properties' argument")
    }
    if (noResolveAliases) {
      throwUnsupportedException("dialog.showOpenDialogSync can't support the 'noResolveAliases' value in the 'properties' argument")
    }
    
    const fileOfFolderArg = openDirectory ? "folder" : "file"
    const promptArgs = message === undefined ? "" : `with prompt ${JSON.stringify(message)}`
    const filtersArgs = filters === undefined ? "" : `of type {${filters.flatMap(b => b.extensions).map(b => JSON.stringify(b)).join(", ")}}`
    const defaultPathArgs = defaultPath === undefined ? "" : `default location ${JSON.stringify(defaultPath)}`
    const invisiblesArgs = !showHiddenFiles ? "" : `invisibles true`
    const multiSelectionsArgs = !multiSelections ? "" : `multiple selections allowed true`
    const treatPackageAsDirectoryArgs = !treatPackageAsDirectory ? "" : `showing package contents true`
    
    let spawn = applescript.spawnSync(`
      set AppleScript's text item delimiters to "\\n"
      set theFiles to choose ${fileOfFolderArg} ${promptArgs} ${filtersArgs} ${defaultPathArgs} ${invisiblesArgs} ${multiSelectionsArgs} ${treatPackageAsDirectoryArgs}
      set thePOSIXFiles to {}
      repeat with aFile in theFiles
        set end of thePOSIXFiles to POSIX path of aFile
      end repeat
      return thePOSIXFiles as string
    `)
    if (spawn.status === 1) {
      return undefined
    }
    let response = spawn.stdout
    return response.trim()
        .split("\n").filter(l => l.length > 0)
        .map(l => l.endsWith("/") ? l.slice(0, -1) : l)
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

    const extensions = filters === undefined ? [] : filters.flatMap(b => b.extensions)
    
    if (title) {
      throwUnsupportedException("dialog.showSaveDialogSync can't support the 'title' property in the 'properties' argument")
    }
    if (buttonLabel) {
      throwUnsupportedException("dialog.showSaveDialogSync can't support the 'buttonLabel' property in the 'properties' argument")
    }
    if (nameFieldLabel) {
      throwUnsupportedException("dialog.showSaveDialogSync can't support the 'nameFieldLabel' property in the 'properties' argument")
    }
    if (showsTagField) {
      throwUnsupportedException("dialog.showSaveDialogSync can't support the 'showsTagField' property in the 'properties' argument")
    }
    if (securityScopedBookmarks) {
      throwUnsupportedException("dialog.showSaveDialogSync can't support the 'securityScopedBookmarks' property in the 'properties' argument")
    }
    if (showHiddenFiles) {
      throwUnsupportedException("dialog.showSaveDialogSync can't support the 'showHiddenFiles' value in the 'properties' argument")
    }
    if (createDirectory) {
      throwUnsupportedException("dialog.showSaveDialogSync can't support the 'createDirectory' value in the 'properties' argument")
    }
    if (treatPackageAsDirectory) {
      throwUnsupportedException("dialog.showSaveDialogSync can't support the 'treatPackageAsDirectory' value in the 'properties' argument")
    }

    let defaultPathIsDirectory = false
    try {
      if (defaultPath) {
        defaultPathIsDirectory = fs.statSync(defaultPath).isDirectory()
      }
    }
    catch (err) {}

    let defaultFolder = defaultPath
    let defaultName = undefined
    if (defaultPath !== undefined && !defaultPathIsDirectory) {
      defaultFolder = path.dirname(defaultFolder)
      defaultName = path.basename(defaultFolder)
    }

    const promptArgs = message === undefined ? "" : `with prompt ${JSON.stringify(message)}`
    const filtersArgs = defaultName === undefined ? "" : `default name ${JSON.stringify(defaultName)}`
    const defaultPathArgs = defaultFolder === undefined ? "" : `default location ${JSON.stringify(defaultFolder)}`
    
    let spawn = applescript.spawnSync(`
      set AppleScript's text item delimiters to "\\n"
      set theFile to choose file name ${promptArgs} ${filtersArgs} ${defaultPathArgs}
      set thePOSIXFile to POSIX path of theFile
    `)
    if (spawn.status === 1) {
      return undefined
    }
    let response = spawn.stdout
    let filename = response.trim()
    if (extensions.length === 1) {
      let extension = extension[0]
      if (path.extname(filename) !== `.${extension}`) {
        filename = `${filename}.${extension}`
      }
    }
    return filename
  }

  static async showSaveDialog(window, opts) {
    let response = this.showSaveDialogSync(window, opts)
    return {
      canceled: response === undefined,
      filePath: response
    }
  }

  static showMessageBoxSync(window, {message, type, buttons, defaultId, title, detail, icon, textWidth, cancelId, noLink, normalizeAccessKeys}) {
    if (title) {
      throwUnsupportedException("dialog.showMessageBoxSync can't support the 'title' property in the 'properties' argument", true)
    }
    if (icon) {
      throwUnsupportedException("dialog.showMessageBoxSync can't support the 'icon' property in the 'properties' argument")
    }
    if (textWidth) {
      throwUnsupportedException("dialog.showMessageBoxSync can't support the 'textWidth' property in the 'properties' argument")
    }
    if (noLink) {
      throwUnsupportedException("dialog.showMessageBoxSync can't support the 'noLink' property in the 'properties' argument")
    }
    if (normalizeAccessKeys) {
      throwUnsupportedException("dialog.showMessageBoxSync can't support the 'normalizeAccessKeys' property in the 'properties' argument")
    }

    const titleArgs = message === undefined ? "" : `with title ${JSON.stringify(message)}`
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
    let spawn = applescript.spawnSync(`
      set theDialogText to ${JSON.stringify(detail)}
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
    let index = this.showMessageBoxSync(window, opts)
    return {
      response: index
    }
  }

  static showErrorBox(title, content) {
    this.showMessageBoxSync(undefined, {message:content, type:"error", title})
  }

  static async showCertificateTrustDialog(window, opts) {
    if (opts === undefined) {
      opts = window
      window = undefined
    }
    let certificate = opts.certificate
    let message = opts.message
  }
}
module.exports = MacDialog