/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/net
  https://www.electronjs.org/docs/latest/api/client-request

  node-fetch Docs
  https://javascript.info/fetch-api

  Issue HTTP/HTTPS requests using Chromium's native networking library.
  Only available in the main process.

  NW.js doesn't have classes made specifically to make requests, so we need
  to use something available for Node or HTML. fetch seems to be a fit
  replacement, at least to start with.
*/

const EventEmitter = require('events')
const session = require('./session')
const fetch = require('cross-fetch')

class IncomingMessage {
    constructor(response, error) {
        this._response = response
        this._error = error

        this.statusCode = response.status
        this.statusMessage = response.statusText
        this.headers = response.headers.raw()
        
        // this.httpVersion
        // this.httpVersionMajor
        // this.httpVersionMinor

        let rawHeaders = []
        let headers = this.headers
        let headerKeys = Object.keys(headers)
        headerKeys.forEach(headerKey => {
            let values = headers[headerKey]
            values.forEach(value => {
                rawHeaders.push(headerKey)
                rawHeaders.push(value)
            })
        })
        this.rawHeaders = rawHeaders
    }

    on(eventName, callback) {
        switch(eventName) {
            case "data":
                let stdout = this._response.body
                var bufs = [];
                stdout.on('data', function(d){ bufs.push(d); });
                stdout.on('end', function(){
                    var buf = Buffer.concat(bufs);
                    callback(eventName, buf);
                })
                return
            case "end":
                callback(eventName);
                return
            case "aborted": 
                if (this._error instanceof AbortError) {
                    callback(eventName);
                }
                return
            case "error": 
                if (!(this._error instanceof AbortError)) {
                    callback(eventName, this._error);
                }
                return
            default: return
        }
    }
}

class ClientRequest extends EventEmitter {
    constructor(options) {
        super()
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
            // useSessionCookies
        }

        // that.emit('login', ...)

        let that = this
        fetch(this.url, {
            method: that.method,
            headers: headers,
            credentials: credentials,
            redirect: that.redirect,
        }).then(response => {
            that.response = response

            that.emit('finish')

            if (response.redirected) {
                const statusCode = response.status
                const method = that.method
                const redirectUrl = response.url
                const responseHeaders = response.headers.raw()
                that.emit('redirect', statusCode, method, redirectUrl, responseHeaders)
            }

            let setCookie = response.headers.raw()['set-cookie']
            that.emit('response', new IncomingMessage(response, undefined))

            that.emit('close')
        }).catch(error => {
            that.emit('finish')

            that.emit('response', new IncomingMessage(undefined, error))

            if (error instanceof AbortError) {
                that.emit('abort')
            }
            else {
                that.emit('error', error)
            }
        })
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