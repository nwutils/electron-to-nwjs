module.exports = (testRunner) => {
    return {
        testName: function() {
            const script = `
                const electronApp = require('electron').app
                return electronApp.name
            `
            return testRunner.compare(script)
        }
    }
}