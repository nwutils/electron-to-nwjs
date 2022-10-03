const config = require('./nwjs-prepare')

var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    buildDir: './dist',
    files: config.files,
    flavor: 'normal',
    platforms: config.buildConfig.platforms,
    version: config.buildConfig.version,
    winIco: config.icon,
    useRcedit: true,
    winVersionString: {
        'CompanyName': config.company,
        'FileDescription': config.appName,
        'ProductName': config.appName,
        'LegalCopyright': config.copyright
    }
});

nw.on('log', console.log);

nw.build().then(function(){
    config.runScript(config.scripts["nwjs:postdist"])
})
.catch(function(error) {
    console.error(error);
});