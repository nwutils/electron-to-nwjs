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
        options.method = options.method || "GET"
        options.session = options.session !== undefined ? options.session : (session.fromPartition(options.partition || ""))
        // credentials
        options.useSessionCookies = options.useSessionCookies || false
        options.protocol = options.protocol || "http:"
        options.redirect = options.redirect || "follow"
        if (options.url) {
            // protocol
            // host
            // hostname
            // port
            // path
        }
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