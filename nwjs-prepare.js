const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

const projectPath = path.resolve(__dirname, '.', 'www')
const projectPackagePath = path.resolve(projectPath, 'package.json')
const projectPackageStr = fs.readFileSync(projectPackagePath, {encoding: 'utf-8'})
const projectPackageJson = JSON.parse(projectPackageStr)

const nwjs = projectPackageJson.nwjs || {}
const nwjsBuildVersion = (nwjs.build || {}).version || nwjs.version || "0.68.1"
const nwjsRunVersion = nwjs.version || "0.68.1"

const buildProjectPath = path.resolve(__dirname, '.', '_www')
const buildProjectPackagePath = path.resolve(buildProjectPath, 'package.json')
let buildProjectPackageStr = fs.readFileSync(buildProjectPackagePath, {encoding: 'utf-8'})
const buildProjectPackageJson = JSON.parse(buildProjectPackageStr)
buildProjectPackageJson["chromium-args"] = "--enable-logging=stderr --mixed-context"
buildProjectPackageStr = JSON.stringify(buildProjectPackageJson, null, 2)
fs.writeFileSync(buildProjectPackagePath, buildProjectPackageStr, {encoding:'utf-8'})

let build = (projectPackageJson.build || {})
let authorName = (projectPackageJson.author || {}).name || "Unknown"
let nwjsConfig = {
    buildConfig: {
        version: nwjsBuildVersion,
        platforms: (nwjs.build || {}).platforms || ["win32"]
    },
    runConfig: {
        version: nwjsRunVersion
    },
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
if (!nwjsConfig.files.includes("**/**")) {
    nwjsConfig.files.unshift("**/**")
}
nwjsConfig.files.push("package.json")
nwjsConfig.files = nwjsConfig.files.map(file => {
    const ignorable = file.startsWith("!")
    if (ignorable) file = file.substring(1)
    return (ignorable?"!":"") + path.join('_www', file)
})
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