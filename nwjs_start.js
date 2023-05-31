const { nwbuild } = require('nw-builder');

const options = require('./nwjs_start_config.json')

nwbuild(options);

nw.on('log', (log) => {
    console.log(log)

    let exitPrefix = "App exited with code "
    if (log.startsWith(exitPrefix)) {
        let exitCode = parseInt(log.substring(exitPrefix.length))
        if (exitCode !== 0) {
            throw new Error(log)
        }
    }
});
nw.on("stdout", (out) => {
    console.log(Buffer.isBuffer(out) ? out.toString() : out)
});
nw.on("stderr", (out) => {
    console.error(Buffer.isBuffer(out) ? out.toString() : out)
});

nw.run().then(function(){
    console.info("App started")
})
.catch(function(error) {
    console.error("App failed to start");
    console.error(error);
});