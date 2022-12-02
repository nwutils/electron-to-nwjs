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
    const testClassName = path.relative(__dirname, allTestFile)
    const testClass = require(allTestFile)(testRunner)
    const testNames = Object.keys(testClass)
    let failureCount = 0
    let successCount = 0
    testNames.forEach(testName => {
        try {
            testClass[testName]()
            console.info("\x1b[32m%s\x1b[0m", `PASSED: ${testClassName}:${testName}`)
            successCount++
        }
        catch(e) {
            console.error("\x1b[31m%s\x1b[0m", `FAILED: ${testClassName}:${testName}: ${e.message}`)
            failureCount++
        }
    })
    console.log(`Result: ${successCount} out of ${successCount + failureCount} have passed`)
})
