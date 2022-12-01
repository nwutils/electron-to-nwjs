/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/tray

  NW.js Docs
  https://docs.nwjs.io/en/latest/References/Tray/

  Add icons and context menus to the system's notification area.
  Only available in the main process.

  ?
*/

const EventEmitter = require('events')

class Tray extends EventEmitter {

    constructor(image, guid) {
        this._image = image
        this._tray = new nw.Tray({ icon: image._temporaryPngFilePath() });
    }

    destroy() {
        this._tray.remove()
        this._tray = null
    }
    setImage(image) {
        this._image = image
        this._tray.icon = image._temporaryPngFilePath()
    }
    setPressedImage(image) {
        this._pressedImage = image
        this._tray.alticon = image._temporaryPngFilePath()
    }
    setToolTip(toolTip) {
        this._tooltip = toolTip
        this._tray.tooltip = toolTip
    }
    setTitle(title, options) {
        if (options && options.fontType) {
            throwUnsupportedException("Tray.setTitle can't support the 'options' argument")
        }
        this._title = title
        this._tray.title = title
    }
    getTitle() {
        return this._title
    }
    setIgnoreDoubleClickEvents(ignore) {
        
    }
    getIgnoreDoubleClickEvents() {
        
    }
    displayBalloon(options) {
        
    }
    removeBalloon() {
        
    }
    focus() {
        
    }
    popUpContextMenu(menu, position) {
        
    }
    closeContextMenu() {
        
    }
    setContextMenu(menu) {
        this._tray.menu = menu._nwjsContextMenu()
    }
    getBounds() {
        
    }
    isDestroyed() {
        return this._tray === null
    }
}

module.exports = Tray