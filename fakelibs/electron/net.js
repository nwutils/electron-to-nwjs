/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/net
  https://www.electronjs.org/docs/latest/api/client-request

  node-fetch Docs
  https://www.npmjs.com/package/node-fetch

  Issue HTTP/HTTPS requests using Chromium's native networking library.
  Only available in the main process.

  ?
*/

const session = require('./session')
const fetch = require('node-fetch')

class ClientRequest {
    constructor(options) {
        if (typeof options === "string") {
            options = {url:options}
        }
        this.method = options.method || "GET"
        this.session = options.session !== undefined ? options.session : (session.fromPartition(options.partition || ""))
        // credentials (include / omit)
        this.useSessionCookies = options.useSessionCookies || false
        this.redirect = options.redirect || "follow"
        
        if (options.url) {
            this.url = options.url
        }
        else {
            let protocol = options.protocol || "http:"
            let port = options.port || (protocol === "http:" ? 80 : (protocol === "https:" ? 443 : undefined))
            if (options.host === undefined) {
                if (options.hostname === undefined) {
                    throw new Error("Invalid request: no hostname specified")
                }
                if (port === undefined) {
                    throw new Error(`Invalid request: no port specified for protocol ${protocol}`)
                }
            }
            let host = options.host || `${options.hostname}:${port}`
            let path = options.path || "/"
            this.url = `${protocol}//${host}${path}`
        }

        const headers = {
            // session
            // credentials
            // useSessionCookies
        }

        // that.dispatchEvent({type:'login', args:[...]})

        let that = this
        fetch(this.url, {
            method: that.method,
            headers: headers,
            redirect: that.redirect,
        }).then(response => {
            that.response = response

            that.dispatchEvent({type:'finish', args:[]})

            if (response.redirected) {
                const statusCode = response.status
                const method = that.method
                const redirectUrl = response.url
                const responseHeaders = response.headers.raw()
                that.dispatchEvent({type:'redirect', args:[statusCode, method, redirectUrl, responseHeaders]})
            }

            let setCookie = response.headers.raw()['set-cookie']
            // that.dispatchEvent({type:'response', args:[response]})

            that.dispatchEvent({type:'close', args:[]})
        }).catch(error => {
            if (error instanceof AbortError) {
                that.dispatchEvent({type:'abort', args:[]})
            }
            else {
                that.dispatchEvent({type:'error', args:[error]})
            }
        })
    }


    _events = {}
    dispatchEvent(event) {
        let listeners = this._events[event.type] || [];
        listeners.forEach(listener => {
            listener.apply(undefined, event.args);
        })
    }
    on(eventName, listener) {
        this._events[eventName] = this._events[eventName] || []
        this._events[eventName].push(listener);
        return this;
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