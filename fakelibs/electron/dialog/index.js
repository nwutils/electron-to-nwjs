/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/dialog

  Display native system dialogs for opening and saving files, alerting, etc.
  Only available in the main process.

  The methods for calling dialogs will differ from system to system.
*/

module.exports = (function(){
  const isMac = process.platform === 'darwin';
  const isWindows = process.platform === 'win32';
  const isLinux = process.platform === 'linux';

  if (isMac) {
    return require('./mac')
  }
  return require('./base')
}())