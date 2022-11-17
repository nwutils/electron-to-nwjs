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

class LinuxDialog extends BaseDialog {
  
}
module.exports = LinuxDialog