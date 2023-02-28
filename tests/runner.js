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
        this.projectDir = projectDir
        this.testScriptName = "__test.js"
        this.sep1 = uuidv4()
        this.sep2 = uuidv4()
    }

    _writeScriptToProjectFolder(script) {
        script = `
            console.log("${this.sep1}")
            try {
                ${script}
            }
            catch(e){}
            console.log("${this.sep2}")
            require('electron').app.quit();
        `
        fs.writeFileSync(path.join(this.projectDir, this.testScriptName), script, {encoding:'utf8'})
    }
    _removeScriptFromProjectFolder() {
        fs.rmSync(path.join(this.projectDir, this.testScriptName))
    }
    runWithElectron(script) {
        this._writeScriptToProjectFolder(script)
        let projectDir = this.projectDir
        let output = child_process.execSync("npx electron .", {env, cwd:projectDir, encoding:'utf8'})
        this._removeScriptFromProjectFolder()
        let cleanOutput = output.split(this.sep1).pop().split(this.sep2).shift()
        return cleanOutput.trim()
    }
    runWithElectronToNWjs(script) {
        this._writeScriptToProjectFolder(script)
        let projectDir = this.projectDir
        let output = child_process.spawnSync("node", ["../index.js", "start", "."],
                                            {env, cwd:projectDir, encoding:'utf8', timeout:120*1000})
        this._removeScriptFromProjectFolder()
        output = output.stderr.split("\n").map(line => {
                let startSep = ")] "
                let finalSep = ", source: chrome-extension://"
                if (!line.includes(finalSep)) {
                    return ""
                }
                let lineParts = line.split(finalSep)
                lineParts.pop()
                lineParts = lineParts.join(finalSep).split(startSep)
                if (lineParts.length > 1) {
                    lineParts.shift()
                }
                line = lineParts.join(startSep)
                if (line.trim().length === 0) {
                    return ""
                }
                if (line.startsWith('"') && line.endsWith('"')) {
                    return line.substring(1, line.length - 1)
                }
                return line
            })
            .filter(l => l.length > 0)
            .join("\n")
        let cleanOutput = output.split(this.sep1).pop().split(this.sep2).shift()
        return cleanOutput.trim()
    }
    compare(script, expectedOutput) {
        const output2 = this.runWithElectronToNWjs(script)
        let output1 = undefined
        let matches = false
        if (expectedOutput) {
            if (typeof expectedOutput === 'function') {
                matches = expectedOutput(output2)
            }
            else {
                output1 = expectedOutput
                matches = output1 === output2
            }
        }
        else {
            output1 = this.runWithElectron(script)
            matches = output1 === output2
        }
        if (!matches) {
            throw new Error(`Expected "${output1}" but was "${output2}"`)
        }
    }
}

module.exports = TestRunner