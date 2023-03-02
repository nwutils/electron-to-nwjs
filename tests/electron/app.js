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
            // Test can't be done properly, so we mock the value
            return testRunner.compare(`console.log(require('electron').app.getAppPath())`, function(nwjsValue) {
                return nwjsValue.startsWith("/tmp/electron-to-nwjs")
            })
        },
        test_getPath: () => {
            return testRunner.compare(`
                console.log(require('electron').app.getPath("home"))
                console.log(require('electron').app.getPath("appData"))
                console.log(require('electron').app.getPath("userData"))
                console.log(require('electron').app.getPath("sessionData"))
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
        test_localeAndLanguageFunctions: () => {
            // TODO: Test not passing. Expected "" but was "en-US"
            return testRunner.compare(`
                console.log(require('electron').app.getLocale())
                console.log(require('electron').app.getLocaleCountryCode())
                console.log(require('electron').app.getSystemLocale())
                console.log(require('electron').app.getPreferredSystemLanguages()[0])
            `)
        }
    }
}