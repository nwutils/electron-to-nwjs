module.exports = function(reason) {
    if (__nwjs_ignore_unimplemented_features) {
        console.warn(`electron-to-nwjs warning: ${reason}`)
        return
    }
    throw new Error(`electron-to-nwjs exception: ${reason}`)
}
