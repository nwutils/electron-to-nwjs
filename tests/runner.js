const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid');

const env = Object();
for(var key in process.env) {
    env[key] = process.env[key];
}

class TestRunner {
    constructor(projectDir) {
        console.log("Project dir: " + projectDir)
        this.projectDir = projectDir
        this.testScriptName = "__test.js"
        this.sep1 = uuidv4()
        this.sep2 = uuidv4()
    }

    _writeScriptToProjectFolder(script) {
        script = `
            var output = function() {
                ${script}
            }()
            console.log("${this.sep1}")
            console.log(JSON.stringify(output))
            console.log("${this.sep2}")
            setTimeout(function(){
                require('electron').app.quit();
            }, 200)
        `
        fs.writeFileSync(path.join(this.projectDir, this.testScriptName), script, {encoding:'utf8'})
    }
    _removeScriptFromProjectFolder() {
        fs.rmSync(path.join(this.projectDir, this.testScriptName))
    }
    runWithElectron(script) {
        this._writeScriptToProjectFolder(script)
        let projectDir = this.projectDir
        console.log("Starting Electron execution...")
        let output = child_process.execSync("npx electron __test", {env, cwd:projectDir, encoding:'utf8'})
        console.log("Stopping Electron execution...")
        this._removeScriptFromProjectFolder()
        let cleanOutput = output.split(this.sep1).pop().split(this.sep2).shift()
        console.log(cleanOutput)
        return JSON.parse(cleanOutput)
    }
    runWithElectronToNWjs(script) {
        this._writeScriptToProjectFolder(script)
        let projectDir = this.projectDir
        console.log("Starting NW.js execution...")
        let output = child_process.spawnSync("npx", ["electron-to-nwjs", "start", this.testScriptName],
                                            {env, cwd:projectDir, encoding:'utf8', timeout:60*1000})
        console.log("Stopping NW.js execution...")
        this._removeScriptFromProjectFolder()
        output = output.stderr.split("\n").map(line => {
                let startSep = ")] "
                let finalSep = ", source: chrome-extension://"
                let lineParts = line.split(finalSep)
                lineParts.pop()
                lineParts = lineParts.join(finalSep).split(startSep)
                lineParts.shift()
                if (lineParts.length === 0) {
                    return ""
                }
                line = lineParts.join(startSep)
                if (line.trim().length === 0) {
                    return ""
                }
                return line.substring(1, line.length - 1)
            }).join("\n")
        let cleanOutput = output.split(this.sep1).pop().split(this.sep2).shift()
        console.log(cleanOutput)
        return JSON.parse(cleanOutput)
    }
    compare(script) {
        const output1 = this.runWithElectron(script)
        const output2 = this.runWithElectronToNWjs(script)
        if (output1 !== output2) {
            throw new Error(`Expected "${output1}" but was "${output2}"`)
        }
    }
}

module.exports = TestRunner