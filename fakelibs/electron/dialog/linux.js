/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/dialog

  Zenity Docs
  https://linux.die.net/man/1/zenity

  Display native system dialogs for opening and saving files, alerting, etc.
  Only available in the main process.

  Through Zenity, it's possible to call the different types of dialogs.
  Some specific features are not available thought.
*/

const BaseDialog = require('./base')
const child_process = require('child_process')
const throwUnsupportedException = require('../utils/unsupported-exception')

class LinuxDialog extends BaseDialog {
  static showMessageBoxSync(window, opts) {
    if (opts === undefined) {
      opts = window
    }
    let {message, type, buttons, defaultId, title, detail, icon, textWidth, cancelId, noLink, normalizeAccessKeys} = opts
    if (defaultId) {
      throwUnsupportedException("dialog.showMessageBoxSync can't support the 'defaultId' property in the 'properties' argument", true)
    }
    if (icon) {
      throwUnsupportedException("dialog.showMessageBoxSync can't support the 'icon' property in the 'properties' argument")
    }
    if (textWidth) {
      throwUnsupportedException("dialog.showMessageBoxSync can't support the 'textWidth' property in the 'properties' argument")
    }
    if (cancelId) {
      throwUnsupportedException("dialog.showMessageBoxSync can't support the 'cancelId' property in the 'properties' argument", true)
    }
    if (noLink) {
      throwUnsupportedException("dialog.showMessageBoxSync can't support the 'noLink' property in the 'properties' argument")
    }
    if (normalizeAccessKeys) {
      throwUnsupportedException("dialog.showMessageBoxSync can't support the 'normalizeAccessKeys' property in the 'properties' argument")
    }
    
    if (!buttons && buttons.length === 0) {
      buttons = ["OK"]
    } else {
      buttons = buttons.slice(0)
    }

    const iconFlagByIcon = {
      "none": "--info",
      "info": "--info",
      "error": "--error",
      "question": "--info",
      "warning": "--warning"
    }
    const iconFlag = iconFlagByIcon[type || "none"]
    let messageStr = [(message || ""), (detail || "")].filter(l => l.length > 0).join("\n")
    let args = ["zenity", iconFlag, "--title", (title || ""), "--text", messageStr, "--ok-label", buttons.shift()]
    buttons.forEach(button => {
      args.push("--extra-button")
      args.push(button)
    })
    if (messageStr.length < 80) {
      args.push("--no-wrap")
    }
    let cmd = args.shift()
    var response = child_process.spawnSync(cmd, args, {encoding:'utf-8'})
    if (response.status === 0) {
      return 0
    }
    let selectedOption = response.stdout.trim()
    return 1 + buttons.indexOf(selectedOption)
  }
}
module.exports = LinuxDialog