// Reference:
// https://www.electronjs.org/de/docs/latest/api/shell
// https://docs.nwjs.io/en/latest/References/Shell/

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