const NwBuilder = require('nw-builder');

var nw = new NwBuilder(require('./nwjs_build_config.json'));

nw.on('log', console.log);
nw.build().then(function(){
    console.log("Build finished")
})
.catch(function(error) {
    console.error(error);
});