/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/net

  NW.js Docs
  ?

  Issue HTTP/HTTPS requests using Chromium's native networking library.
  Only available in the main process.

  ?
*/

const session = require('./session')

class ClientRequest {
    constructor(options) {
        if (typeof options === "string") {
            options = {url:options}
        }
        this.method = options.method || "GET"
        this.session = options.session !== undefined ? options.session : (session.fromPartition(options.partition || ""))
        // credentials
        this.useSessionCookies = options.useSessionCookies || false
        this.redirect = options.redirect || "follow"
        
        if (options.url) {
            this.url = options.url
        }
        else {
            let protocol = options.protocol || "http:"
            let host = options.host || `${options.hostname}:${options.port}`
            this.url = `${protocol}//${host}${options.path}`
        }
    }

    on(eventName, callback) {
        
    }
}

class Net {
    static request(options) {
        return new ClientRequest(options)
    }
    static get online() {
        return this.isOnline()
    }
    static isOnline() {
        // TODO: Placeholder value
        return true
    }
}
module.exports = Net