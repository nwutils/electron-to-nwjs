class AutoUpdater {
    _events = {}
    async emit(eventName, ...args) {
        let listeners = this._events[eventName] || [];
        listeners.forEach(listener => {
            listener.apply(undefined, args);
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
        this.emit("update-not-available")
    }
    quitAndInstall() {
        
    }
}
module.exports = new AutoUpdater()