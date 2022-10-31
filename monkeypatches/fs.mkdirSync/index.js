// fs.mkdirSync(path[, options])
//  path <string> | <Buffer> | <URL>
//  options <Object> | <integer>
//      recursive <boolean> Default: false
//      mode <integer> Not supported on Windows. Default: 0o777.

var path = require('path')
var fs = require('fs')
var origMkdirSync = fs.mkdirSync

var isDirectory = function(dir) {
    try {
        return fs.statSync(dir).isDirectory()
    } catch (err) {
        return false
    }
}

var mkdirSync = function(aPath, options) {
    if (options === undefined) {
        options = {}
    }
    if (typeof options === "number") {
        options = {mode:options}
    }
    var mode = options.mode || 0o777
    var recursive = options.recursive || false
    if (!recursive) {
        return origMkdirSync(aPath, mode)
    }

    var dirname = path.dirname(aPath)
    if (!fs.existsSync(dirname) || !isDirectory(dirname)) {
        mkdirSync(dirname, options)
    }
    if (!fs.existsSync(aPath) || !isDirectory(aPath)) {
        origMkdirSync(aPath, mode)
    }
}

fs.mkdirSync = mkdirSync