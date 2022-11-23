/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/shell

  NW.js Docs
  https://docs.nwjs.io/en/latest/References/Shell/

  Manage files and URLs using their default applications.

  Electron's shell and NW.js's Shell have the same utility, but Electron's got
  more methods which are not available in NW.js, and will need to be replicated
  using Node.
*/

const getWindowsShortcutProperties = require('get-windows-shortcut-properties');

class ShortcutDetails {
    constructor({target, cwd, args, description, icon, iconIndex}) {
        this.target = target
        this.cwd = cwd
        this.args = args
        this.description = description
        this.icon = icon
        this.iconIndex = iconIndex
        this.appUserModelId = undefined
        this.toastActivatorClsid = undefined
    }
}

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
    },
    // writeShortcutLink(shortcutPath[, operation], options) (Windows only)
    readShortcutLink(shortcutPath) {
        if (process.platform !== 'win32') {
            throw new Error("readShortcutLink can only be used on Windows")
        }
        const output = getWindowsShortcutProperties.sync(shortcutPath);
        if (!output) {
            throw new Error("Unknown error while trying to read shortcut link")
        }
        let iconParts = output.IconLocation.split(",")
        let iconIndex = parseInt(iconParts.pop())
        let icon = iconParts.join(",")
        return new ShortcutDetails({
            target: output.TargetPath,
            cwd: output.WorkingDirectory,
            args: output.Arguments,
            description: output.Description,
            icon,
            iconIndex
        })
    }
}
module.exports = shell