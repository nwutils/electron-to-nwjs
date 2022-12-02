const fs = require('fs')
const path = require('path')

const TestRunner = require('./runner')
const testRunner = new TestRunner(__dirname)

const allTestFiles = []
const electronFolder = path.join(__dirname, "electron")

const isDirectory = function(dir) {
    try {
        return fs.statSync(dir).isDirectory()
    } catch (err) {
        return false
    }
}
const listAllJsFilesFromFolder = function(folder) {
    const folderFiles = fs.readdirSync(folder)
    folderFiles.forEach(folderFile => {
        const folderPath = path.join(folder, folderFile)
        if (folderPath.endsWith(".js")) {
            allTestFiles.push(folderPath)
        }
        else if (isDirectory(folderPath)) {
            listAllJsFilesFromFolder(folderPath)
        }
    })
}
listAllJsFilesFromFolder(electronFolder)

allTestFiles.forEach(allTestFile => {
    const testClassName = path.relative(__dirname, allTestFile).replaceAll("/", ".")
    const testClass = require(allTestFile)(testRunner)
    const testNames = Object.keys(testClass)
    testNames.forEach(testName => {
        try {
            testClass[testName]()
            console.info(`PASSED: ${testClassName}.${testName}`)
        }
        catch(e) {
            console.error(`FAILED: ${testClassName}.${testName}: ${e.message}`)
        }
    })
})
