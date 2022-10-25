/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/notification

  HTML5 Docs
  https://developer.mozilla.org/en-US/docs/Web/API/Notification
  https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
  
  NW.js Docs
  https://docs.nwjs.io/en/latest/References/Chrome%20Extension%20APIs/
  https://developer.chrome.com/docs/extensions/reference/notifications/

  Create OS desktop notifications.
  Only available in the main process.

  NW.js doesn't have a notification class, using HTML5's Notification class.
  Electron also has access to HTML5's Notification, but only in the renderer
  process.
*/

const throwUnsupportedException = require('./utils/unsupported-exception')

class ElectronNotification {
    constructor(options) {
        options = options || {}
        this.title = options.title
        this.subtitle = options.subtitle
        this.body = options.body
        this.silent = options.silent
        this.icon = options.icon
        this.hasReply = options.hasReply
        this.timeoutType = options.timeoutType
        this.replyPlaceholder = options.replyPlaceholder
        this.sound = options.sound
        this.urgency = options.urgency
        this.actions = options.actions
        this.closeButtonText = options.closeButtonText
        this.toastXml = options.toastXml
    }


    on(event, callback) {
        let notification = this._notification
        if (event === "show") {
            notification.addEventListener('show', callback);
        }
        if (event === "click") {
            notification.addEventListener('click', callback);
        }
        if (event === "close") {
            notification.addEventListener('close', callback);
        }
        if (event === "reply") {
            throwUnsupportedException("Notification.on can't accept the value 'reply' on the 'event' argument")
        }
        if (event === "action") {
            throwUnsupportedException("Notification.on can't accept the value 'action' on the 'event' argument")
        }
        if (event === "failed") {
            notification.addEventListener('error', callback);
        }
    }


    show() {
        this._notification = new Notification(this.title, {
            body: this.body,
            icon: this.icon,
            silent: this.silent,
            requireInteraction: this.timeoutType === "never"
        })
    }
    close() {
        if (this._notification) {
            this._notification.close()
            delete this._notification
        }
    }


    get title() {
        return this._title
    }
    set title(val) {
        this._title = val
    }
    get subtitle() {
        return this._subtitle
    }
    set subtitle(val) {
        if (val) {
            throwUnsupportedException("Notification.subtitle can't accept a value different from undefined")
        }
    }
    get body() {
        return this._body
    }
    set body(val) {
        this._body = val
    }
    get replyPlaceholder() {
        return this._replyPlaceholder
    }
    set replyPlaceholder(val) {
        if (val) {
            throwUnsupportedException("Notification.replyPlaceholder can't accept a value different from undefined")
        }
    }
    get sound() {
        return this._sound
    }
    set sound(val) {
        if (val) {
            throwUnsupportedException("Notification.sound can't accept a value different from undefined")
        }
    }
    get closeButtonText() {
        return this._closeButtonText
    }
    set closeButtonText(val) {
        if (val) {
            throwUnsupportedException("Notification.closeButtonText can't accept a value different from undefined")
        }
    }
    get silent() {
        return this._silent
    }
    set silent(val) {
        this._silent = val
    }
    get hasReply() {
        return this._hasReply
    }
    set hasReply(val) {
        if (val) {
            throwUnsupportedException("Notification.hasReply can't accept a value different from undefined")
        }
    }
    get urgency() {
        return this._urgency
    }
    set urgency(val) {
        if (val) {
            throwUnsupportedException("Notification.urgency can't accept a value different from undefined")
        }
    }
    get timeoutType() {
        return this._timeoutType
    }
    set timeoutType(val) {
        this._timeoutType = val
    }
    get actions() {
        return this._actions
    }
    set actions(val) {
        if (val) {
            throwUnsupportedException("Notification.actions can't accept a value different from undefined")
        }
    }
    get toastXml() {
        return this._toastXml
    }
    set toastXml(val) {
        if (val) {
            throwUnsupportedException("Notification.toastXml can't accept a value different from undefined")
        }
    }
}

module.exports = ElectronNotification