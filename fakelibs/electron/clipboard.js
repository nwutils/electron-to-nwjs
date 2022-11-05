/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/clipboard

  NW.js Docs
  https://docs.nwjs.io/en/latest/References/Clipboard/

  Perform copy and paste operations on the system clipboard.

  ?
*/

const NativeImage = require('./nativeImage')
const throwUnsupportedException = require('./utils/unsupported-exception')

class Clipboard {
    static _nwjsClipboard() {
        return nw.Clipboard.get();
    }

    static readText(type) {
        if (type === "selection") {
            throwUnsupportedException("Clipboard.readText can't accept the value 'selection' on the 'type' argument")
        }
        return this._nwjsClipboard().get("text")
    }
    static writeText(text, type) {
        if (type === "selection") {
            throwUnsupportedException("Clipboard.writeText can't accept the value 'selection' on the 'type' argument")
        }
        this._nwjsClipboard().set(text, "text")
    }
    static readHTML(type) {
        if (type === "selection") {
            throwUnsupportedException("Clipboard.readHTML can't accept the value 'selection' on the 'type' argument")
        }
        return this._nwjsClipboard().get("html")
    }
    static writeHTML(markup, type) {
        if (type === "selection") {
            throwUnsupportedException("Clipboard.writeHTML can't accept the value 'selection' on the 'type' argument")
        }
        this._nwjsClipboard().set(markup, "html")
    }
    static readImage(type) {
        if (type === "selection") {
            throwUnsupportedException("Clipboard.readImage can't accept the value 'selection' on the 'type' argument")
        }
        return NativeImage.createFromDataURL(this._nwjsClipboard().get("png", true))
    }
    static writeImage(image, type) {
        if (type === "selection") {
            throwUnsupportedException("Clipboard.writeImage can't accept the value 'selection' on the 'type' argument")
        }
        this._nwjsClipboard().set(image.toDataURL(), "png", true)
    }
    static readRTF(type) {
        if (type === "selection") {
            throwUnsupportedException("Clipboard.readRTF can't accept the value 'selection' on the 'type' argument")
        }
        return this._nwjsClipboard().get("rtf")
    }
    static writeRTF(text, type) {
        if (type === "selection") {
            throwUnsupportedException("Clipboard.writeRTF can't accept the value 'selection' on the 'type' argument")
        }
        this._nwjsClipboard().set(text, "rtf")
    }
    static readBookmark() {
        // TODO
    }
    static writeBookmark(title, url, type) {
        if (type === "selection") {
            throwUnsupportedException("Clipboard.writeBookmark can't accept the value 'selection' on the 'type' argument")
        }
        // TODO
    }
    static readFindText() {
        // TODO
    }
    static writeFindText(text) {
        // TODO
    }
    static clear(type) {
        if (type === "selection") {
            throwUnsupportedException("Clipboard.clear can't accept the value 'selection' on the 'type' argument")
        }
        this._nwjsClipboard().clear()
    }
    static availableFormats(type) {
        if (type === "selection") {
            throwUnsupportedException("Clipboard.availableFormats can't accept the value 'selection' on the 'type' argument")
        }
        let electronTypesByNwjsTypes = {
            "text": "text/plain",
            "html": "text/html",
            "rtf":  "application/rtf",
            "png":  "image/x-png",
            "jpeg": "image/jpeg"
        }
        let nwjsTypes = this._nwjsClipboard().readAvailableTypes()
        return nwjsTypes.map(t => electronTypesByNwjsTypes[t])
    }
    static has(format, type) {
        if (type === "selection") {
            throwUnsupportedException("Clipboard.has can't accept the value 'selection' on the 'type' argument")
        }
    }
    static read(format) {
        // TODO
    }
    static readBuffer(format) {
        // TODO
    }
    static writeBuffer(format, buffer, type) {
        if (type === "selection") {
            throwUnsupportedException("Clipboard.writeBuffer can't accept the value 'selection' on the 'type' argument")
        }
        // TODO
    }
    static write(data, type) {
        if (type === "selection") {
            throwUnsupportedException("Clipboard.write can't accept the value 'selection' on the 'type' argument")
        }
        // TODO
    }
}
module.exports = Clipboard