module.exports = function(reason, warning) {
    if (warning === true || __nwjs_ignore_unimplemented_features) {
        console.warn(`electron-to-nwjs warning: ${reason}`)
        return
    }
    throw new Error(`electron-to-nwjs exception: ${reason}`)
}
