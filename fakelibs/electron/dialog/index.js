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

module.exports = (function(){
  const isMac = process.platform === 'darwin';
  const isWindows = process.platform === 'win32';
  const isLinux = process.platform === 'linux';

  if (isMac) {
    return require('./mac')
  }
  return require('./base')
}())