/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/session

  NW.js Docs
  ?

  Manage browser sessions, cookies, cache, proxy settings, etc.
  Only available in the main process.

  ?
*/

const EventEmitter = require('events')
const WebRequest = require('./WebRequest')
const throwUnsupportedException = require('./utils/unsupported-exception')

class Session extends EventEmitter {
    static _sessions = {}


    static defaultSession = new Session({
        name: "",
        persistent: true,
        cache: true
    })
    static fromPartition(partition, opts) {
        if (partition === "") {
            return this.defaultSession
        }
        const shouldPersist = partition.startsWith("persist:")
        if (this._sessions[partition]) {
            return _sessions[partition]
        }
        let session = new Session({
            name: partition,
            persistent: shouldPersist,
            cache: opts?.cache === undefined ? true : opts?.cache
        })
        this._sessions[partition] = session
        return session
    }


    constructor(opts) {
        super()
        let that = this
        this._spellCheckerEnabled = false
        this._webRequest = new WebRequest()
        this._name = opts.name
        this._persistent = opts.persistent
        this._enabledCache = opts.cache

        chrome.settingsPrivate.getPref('browser.enable_spellchecking', function(pref) {
            that._spellCheckerEnabled = pref.value
        });
    }


    get webRequest() {
        return this._webRequest
    }


    isPersistent() {
        return this._persistent
    }
    setSpellCheckerEnabled(enable) {
        this._spellCheckerEnabled = enable
        chrome.settingsPrivate.setPref('browser.enable_spellchecking', enable);
    }
    isSpellCheckerEnabled() {
        return this._spellCheckerEnabled
    }
}
module.exports = Session