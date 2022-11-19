const NwBuilder = require('nw-builder');

var nw = new NwBuilder(require('./nwjs_build_config.json'));

nw.on('log', console.log);
await nw.build()