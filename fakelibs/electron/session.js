const session = {
    defaultSession: {
        spellCheckerEnabled: false,
        webRequest: {
            onHeadersReceived: (opts, callback) => {}
        }
    }
}
module.exports = session