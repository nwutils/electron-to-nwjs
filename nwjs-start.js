const config = require('./nwjs-prepare')

var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    appName: config.appName,
    files: config.files,
    version: config.runConfig.version
});

nw.on('log', console.log);
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