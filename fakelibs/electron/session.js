/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/session

  NW.js Docs
  ?

  Manage browser sessions, cookies, cache, proxy settings, etc.
  Only available in the main process.

  ?
*/

const WebRequest = require('./WebRequest')
const throwUnsupportedException = require('./utils/unsupported-exception')

class Session {
    static defaultSession = new Session({
        persistent:true
    })


    constructor(opts) {
        this.spellCheckerEnabled = false
        this._webRequest = new WebRequest()
        this._persistent = opts?.persistent === true
    }


    get webRequest() {
        return this._webRequest
    }


    isPersistent() {
        return this._persistent
    }
    setSpellCheckerEnabled(enable) {
        if (enable) {
            throwUnsupportedException("Session.setSpellCheckerEnabled can't accept the value 'true'")
        }
    }
    isSpellCheckerEnabled() {
        return this.spellCheckerEnabled
    }
}
module.exports = Session