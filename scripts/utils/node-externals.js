const externals = {}

const nodeCoreModulesStr = ["buffer", "child_process", "crypto", "fs", "http", "http2", "https",
                            "net", "os", "path", "stream", "url", "util", "zlib"]

// Workarounds to make libs that import "node:*" work properly
nodeCoreModulesStr.forEach(nodeCoreModule => externals[`node:${nodeCoreModule}`] = `require('${nodeCoreModule}')`)

// Workarounds to make libs that import "*/*" work properly
nodeCoreModulesStr.forEach(module => {
    let moduleKeys = Object.keys(require(module))
    moduleKeys.forEach(key => {
        externals[`${module}/${key}`] = `require('${module}').${key}`
    })
})

module.exports = externals