const EventEmitter = require('events');

class AutoUpdater extends EventEmitter {
    constructor() {
        super()
    }
    setFeedURL({url, headers, serverType}) {

    }
    getFeedURL() {

    }
    checkForUpdates() {
        this.emit("update-not-available")
    }
    quitAndInstall() {
        
    }
}
module.exports = new AutoUpdater()