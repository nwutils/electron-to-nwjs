const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

const obfuscatedProjectPath = path.join('.', '_www')
const projectPath = path.resolve(__dirname, '.', 'www')
const projectPackagePath = path.resolve(projectPath, 'package.json')
const projectPackageStr = fs.readFileSync(projectPackagePath, {encoding: 'utf-8'})
const projectPackageJson = JSON.parse(projectPackageStr)

let appName = (projectPackageJson.build || {}).productName || projectPackageJson.name || "Unknown"
let authorName = (projectPackageJson.author || {}).name || "Unknown"
let nwjsConfig = {
    appName: appName,
    company: authorName,
    copyright: (projectPackageJson.build || {}).copyright || `Copyright © ${new Date().getFullYear()} ${authorName}. All rights reserved`,
    files: (projectPackageJson.build || {}).files || ["**/**"],
    icon: (projectPackageJson.build || {}).icon,
    scripts: projectPackageJson.scripts
}
let windowConfig = (projectPackageJson.config || {}).window || {}

const indexHtml = windowConfig.index || "index.html"
const appJsContents = `nw.Window.open('${indexHtml}', {
    title: ${JSON.stringify(nwjsConfig.appName)},
    width: ${windowConfig.width},
    height: ${windowConfig.height},
    min_width: ${windowConfig.minWidth},
    min_height: ${windowConfig.minHeight},
    resizable: ${windowConfig.resizable === false ? "false" : "true"},
    icon: ${JSON.stringify(nwjsConfig.icon)}
}, function(win) {
});`
fs.writeFileSync(path.join(obfuscatedProjectPath, "app.js"), appJsContents, {encoding:'utf8'})

nwjsConfig.icon = path.join('./www', nwjsConfig.icon)
nwjsConfig.files = (nwjsConfig.files || ["**/**"]).map(file => path.join(obfuscatedProjectPath, file))
nwjsConfig.runScript = function(script) {
    if (script === undefined) {
        return
    }
    console.info("> " + script)
    try {
        var output = child_process.execSync(script, {cwd: projectPath, encoding: 'utf8'})
        console.info(output)
    }
    catch(e) {
        console.error(e)
    }
}

module.exports = nwjsConfig