const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

const projectPath = path.resolve(__dirname, '.', 'www')
const projectPackagePath = path.resolve(projectPath, 'package.json')
const projectPackageStr = fs.readFileSync(projectPackagePath, {encoding: 'utf-8'})
const projectPackageJson = JSON.parse(projectPackageStr)

const obfuscatedProjectPath = path.join('.', '_www')

let build = (projectPackageJson.build || {})
let authorName = (projectPackageJson.author || {}).name || "Unknown"
let nwjsConfig = {
    appName: (build.win || {}).productName || build.productName || projectPackageJson.name || "Unknown",
    company: authorName,
    copyright: (build.win || {}).copyright || build.copyright || `Copyright © ${new Date().getFullYear()} ${authorName}. All rights reserved`,
    files: (build.win || {}).files || build.files || ["**/**"],
    icon: (build.win || {}).icon || build.icon,
    scripts: projectPackageJson.scripts
}

if (nwjsConfig.icon) {
    nwjsConfig.icon = path.join('./www', nwjsConfig.icon)
}
nwjsConfig.files.push("package.json")
nwjsConfig.files = nwjsConfig.files.map(file => path.join(obfuscatedProjectPath, file))
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