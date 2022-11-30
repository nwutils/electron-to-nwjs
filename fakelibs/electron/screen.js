/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/screen

  NW.js Docs
  https://docs.nwjs.io/en/latest/References/Screen/

  Retrieve information about screen size, displays, cursor position, etc.
  Only available in the main process.

  ?
*/

const EventEmitter = require('events')

class Display {
    constructor(nwjsScreen) {
        this._updateValues(nwjsScreen)
    }

    _updateValues(nwjsScreen) {
        this.id = nwjsScreen.id
        this.rotation = nwjsScreen.rotation
        this.scaleFactor = nwjsScreen.scaleFactor
        this.touchSupport = nwjsScreen.touchSupport > 0 ? 'available' : 'unavailable'

        this.monochrome = false // TODO
        this.accelerometerSupport = "unknown" // TODO
        this.colorSpace = "{}" // TODO
        this.colorDepth = 24 // TODO
        this.depthPerComponent = 8 // TODO
        this.displayFrequency = 60 // TODO
        
        this.bounds = nwjsScreen.bounds
        this.size = {
            height: nwjsScreen.bounds.height,
            width: nwjsScreen.bounds.width
        }
        this.workArea = nwjsScreen.work_area
        this.workAreaSize = {
            height: nwjsScreen.work_area.height,
            width: nwjsScreen.work_area.width
        }
        this.internal = nwjsScreen.isBuiltIn
    }
}

class Screen extends EventEmitter {
    _screens = []

    constructor() {
        let that = this
        nw.Screen.on('displayAdded', (screen) => {
            let newDisplay = new Display(screen)
            that._screens.push(newDisplay)
            that.emit('display-added', new Event('display-added'), newDisplay)
        });
        nw.Screen.on('displayRemoved', (screen) => {
            let oldDisplay = that._screens.filter(s => s.id === screen.id).pop()
            that._screens = that._screens.filter(s => s.id !== screen.id)
            that.emit('display-removed', new Event('display-removed'), oldDisplay)
        });
        nw.Screen.on('displayBoundsChanged', (screen) => {
            let oldDisplay = that._screens.filter(s => s.id === screen.id).pop()
            oldDisplay._updateValues(screen)
            that.emit('display-metrics-changed', new Event('display-metrics-changed'), oldDisplay)
        });
    }
    
    getCursorScreenPoint() {

    }
    getPrimaryDisplay() {
        return this._screens[0]
    }
    getAllDisplays() {
        return this._screens.map(s => s)
    }
    getDisplayNearestPoint(point) {
        
    }
    getDisplayMatching(rect) {
        
    }
    screenToDipPoint(point) {
        
    }
    dipToScreenPoint(point) {
        
    }
    screenToDipRect(window, rect) {
        
    }
    dipToScreenRect(window, rect) {
        
    }
}
module.exports = new Screen()