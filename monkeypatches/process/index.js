const child_process = require('child_process')
const os = require('os')

process.defaultApp = !__nwjs_is_packaged ? true : undefined
process.isMainFrame = false // TODO
process.mas = false // TODO
process.noAsar = true
process.resourcesPath = process.cwd() // TODO: Untested
process.sandboxed = false // TODO
process.contextIsolated = false // TODO
process.traceProcessWarnings = false // TODO
// process.type
process.versions.chrome = process.versions.chromium
process.versions.electron = __electron_version
process.windowsStore = false // TODO
process.contextId = undefined // TODO

process.crash = function() {
    nw.App.crashBrowser()
}
process.hang = function() {
    // TODO
}
process.getCreationTime = function() {
    // TODO
    return null
}
process.getHeapStatistics = function() {
    // TODO
}
process.getBlinkMemoryInfo = function() {
    // TODO
}
process.getProcessMemoryInfo = function() {
    // TODO
}
process.getSystemMemoryInfo = function() {
    // TODO
}
process.getSystemVersion = function() {
    const isMac = process.platform === 'darwin';
    if (isMac) {
        return child_process.execSync("sw_vers -productVersion").toString().trim()
    }
    return os.release()
}
process.getCPUUsage = function() {
    // TODO
}
process.getIOCounters = function() {
    // TODO
}
