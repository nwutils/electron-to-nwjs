/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/web-request

  NW.js Docs
  https://developer.chrome.com/docs/extensions/reference/webRequest/

  Intercept and modify the contents of a request at various stages of its lifetime.
  Only available in the main process.

  ?
*/

class WebRequest {
  _electronHeadersFromChromeHeaders(responseHeaders) {
    let electronResponseHeaders = {}
    responseHeaders.forEach(header => {
      electronResponseHeaders[header.name] = electronResponseHeaders[header.name] || []
      if (header.value) {
        electronResponseHeaders[header.name].push(header.value)
      }
      // TODO: Support header.binaryValue
    })
    return electronResponseHeaders
  }
  _chromeHeadersFromElectronHeaders(electronResponseHeaders) {
    if (!electronResponseHeaders) {
      return undefined
    }
    let chromeResponseHeaders = []
    Object.keys(electronResponseHeaders).forEach(name => {
      let values = electronResponseHeaders[name]
      values.forEach(value => {
        chromeResponseHeaders.push({name, value})
      })
      // TODO: Support header.binaryValue
    })
    return chromeResponseHeaders
  }
  _chromeResourceTypeFromElectronResourceType(type) {
    return {
      "main_frame":     "mainFrame",
      "sub_frame":      "subFrame",
      "stylesheet":     "stylesheet",
      "script":         "script",
      "image":          "image",
      "font":           "font",
      "object":         "object",
      "xmlhttprequest": "xhr",
      "ping":           "ping",
      "csp_report":     "cspReport",
      "media":          "media",
      "websocket":      "webSocket",
      "other":          "other"
    }[type]
  }


  onHeadersReceived(filter, callback) {
    if (callback === undefined) {
      callback = filter
      filter = {}
    }
    let that = this
    const chromeCallback = function(chromeDetails) {
      const {documentId, documentLifecycle, frameId, frameType, initiator, method, parentDocumentId, parentFrameId, 
          requestId, responseHeaders, statusCode, statusLine, tabId, timeStamp, type, url} = chromeDetails
      let electronResponseHeaders = that._electronHeadersFromChromeHeaders(responseHeaders)
      let electronDetails = {
        id: parseInt(requestId),
        url: url,
        method: method,
        // webContentsId Integer (optional)
        // webContents WebContents (optional)
        // frame WebFrameMain (optional)
        resourceType: that._chromeResourceTypeFromElectronResourceType(type),
        // referrer string
        timestamp: timeStamp,
        statusLine: statusLine,
        statusCode: statusCode,
        responseHeaders: electronResponseHeaders
      }

      let chromeCancel = false
      callback(electronDetails, function({cancel, responseHeaders, statusLine}){
        chromeCancel = cancel || chromeCancel
        electronResponseHeaders = responseHeaders
      })
      
      let chromeResponseHeaders = that._chromeHeadersFromElectronHeaders(electronResponseHeaders)
      if (chromeCancel) {
        return {cancel:true}
      }
      return {responseHeaders: chromeResponseHeaders}
    }
    const extraInfoSpec = ["blocking", "responseHeaders", "extraHeaders"]
    chrome.webRequest.onHeadersReceived.addListener(chromeCallback, filter, extraInfoSpec)
  }
}
module.exports = WebRequest