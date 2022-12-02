module.exports = (testRunner) => {
    return {
        test_isPackaged: () => {
            return testRunner.compare(`console.log(require('electron').app.isPackaged)`)
        },
        test_name: () => {
            return testRunner.compare(`console.log(require('electron').app.name)`)
        },
        test_isReady: () => {
            return testRunner.compare(`console.log(require('electron').app.isReady())`)
        },
        test_getAppPath: () => {
            // TODO: Test not passing
            return testRunner.compare(`console.log(require('electron').app.getAppPath())`)
        },
        test_getPath: () => {
            return testRunner.compare(`
                console.log(require('electron').app.getPath("home"))
                console.log(require('electron').app.getPath("appData"))
                console.log(require('electron').app.getPath("userData"))
                // console.log(require('electron').app.getPath("sessionData"))
                console.log(require('electron').app.getPath("temp"))
                // console.log(require('electron').app.getPath("exe"))
                // console.log(require('electron').app.getPath("module"))
                console.log(require('electron').app.getPath("desktop"))
                console.log(require('electron').app.getPath("documents"))
                console.log(require('electron').app.getPath("downloads"))
                console.log(require('electron').app.getPath("music"))
                console.log(require('electron').app.getPath("pictures"))
                console.log(require('electron').app.getPath("videos"))
                // console.log(require('electron').app.getPath("recent"))
                // console.log(require('electron').app.getPath("logs"))
                // console.log(require('electron').app.getPath("crashDumps"))
            `)
        },
        test_setPath: () => {
            return testRunner.compare(`
                const app = require('electron').app
                app.setPath("userData", "/DEF")
                console.log(app.getPath("userData"))
            `)
        },
        test_getVersion: () => {
            return testRunner.compare(`console.log(require('electron').app.getVersion())`)
        },
        test_getName: () => {
            return testRunner.compare(`console.log(require('electron').app.getName())`)
        },
        test_setName: () => {
            return testRunner.compare(`
                const app = require('electron').app
                app.setName("ABC")
                console.log(app.getName())
            `)
        },
        test_getLocale: () => {
            // TODO: Test not passing. Expected "" but was "en-US"
            return testRunner.compare(`console.log(require('electron').app.getLocale())`)
        },
        test_getLocaleCountryCode: () => {
            return testRunner.compare(`console.log(require('electron').app.getLocaleCountryCode())`)
        },
        test_getSystemLocale: () => {
            // TODO: Test not passing. Expected "" but was "en-US"
            return testRunner.compare(`console.log(require('electron').app.getSystemLocale())`)
        },
        test_getPreferredSystemLanguages: () => {
            // TODO: Test not passing. Expected "" but was "en-US"
            return testRunner.compare(`console.log(require('electron').app.getSystemLocale())`)
        }
    }
}