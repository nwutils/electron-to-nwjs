class AutoUpdater {
    _events = {}
    dispatchEvent(event) {
        let listeners = this._events[event.type] || [];
        listeners.forEach(async listener => {
            listener(event);
        })
    }
    on(event, listener) {
        this._events[event] = this._events[event] || []
        this._events[event].push(listener);
        // 'error'
        // 'checking-for-update'
        // 'update-available'
        // 'update-not-available'
        // 'update-downloaded'
        // 'before-quit-for-update'
        return this;
    }


    setFeedURL({url, headers, serverType}) {

    }
    getFeedURL() {

    }
    checkForUpdates() {
        this.dispatchEvent(new Event("update-not-available"))
    }
    quitAndInstall() {
        
    }
}
module.exports = new AutoUpdater()