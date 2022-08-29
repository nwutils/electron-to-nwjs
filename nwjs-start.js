const config = require('./nwjs-prepare')

var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    appName: config.appName,
    files: config.files,
    version: '0.67.1' // required to work on any modern system
});

nw.on('log', console.log);

nw.run().then(function(){
    console.info("App started")
})
.catch(function(error) {
    console.error("App failed to start");
    console.error(error);
});