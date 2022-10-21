/*
  Electron Docs
  https://www.electronjs.org/de/docs/latest/api/shell

  NW.js Docs
  https://docs.nwjs.io/en/latest/References/Shell/

  Manage files and URLs using their default applications.

  Electron's shell and NW.js's Shell have the same utility, but Electron's got
  more methods which are not available in NW.js, and will need to be replicated
  using Node.
*/

const shell = {
    showItemInFolder(item) {
        nw.Shell.showItemInFolder(item)
    },
    openPath(path) {
        nw.Shell.openFile(path)
    },
    openExternal(url, options) {
        if (options) {
            throwUnsupportedException("shell.openExternal can't support the 'options' argument")
        }
        nw.Shell.openExternal(url)
    },
    // trashItem(path)
    beep() {
        process.stdout.write('\x07')
    }
    // writeShortcutLink(shortcutPath[, operation], options) (Windows only)
    // readShortcutLink(shortcutPath) (Windows only)
}
module.exports = shell