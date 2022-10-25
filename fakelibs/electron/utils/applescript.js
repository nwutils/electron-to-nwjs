const child_process = require('child_process')

module.exports.spawnSync = function(text) {
    var spawn = child_process.spawnSync('osascript', ['-l', 'AppleScript'], {input: text, encoding: 'utf-8'});
    if (spawn.error) {
        throw spawn.error
    }
    return spawn;
};