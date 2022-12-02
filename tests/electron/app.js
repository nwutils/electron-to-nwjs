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
            return testRunner.compare(`console.log(require('electron').app.getAppPath())`)
        },
        test_getPath_home: () => {
            return testRunner.compare(`console.log(require('electron').app.getPath("home"))`)
        },
        test_getPath_appData: () => {
            return testRunner.compare(`console.log(require('electron').app.getPath("appData"))`)
        },
        test_getPath_userData: () => {
            return testRunner.compare(`console.log(require('electron').app.getPath("userData"))`)
        },
        // test_getPath_sessionData: () => {
        //     return testRunner.compare(`console.log(require('electron').app.getPath("sessionData"))`)
        // },
        test_getPath_temp: () => {
            return testRunner.compare(`console.log(require('electron').app.getPath("temp"))`)
        },
        // test_getPath_exe: () => {
        //     return testRunner.compare(`console.log(require('electron').app.getPath("exe"))`)
        // },
        // test_getPath_module: () => {
        //     return testRunner.compare(`console.log(require('electron').app.getPath("module"))`)
        // },
        test_getPath_desktop: () => {
            return testRunner.compare(`console.log(require('electron').app.getPath("desktop"))`)
        },
        test_getPath_documents: () => {
            return testRunner.compare(`console.log(require('electron').app.getPath("documents"))`)
        },
        test_getPath_downloads: () => {
            return testRunner.compare(`console.log(require('electron').app.getPath("downloads"))`)
        },
        test_getPath_music: () => {
            return testRunner.compare(`console.log(require('electron').app.getPath("music"))`)
        },
        test_getPath_pictures: () => {
            return testRunner.compare(`console.log(require('electron').app.getPath("pictures"))`)
        },
        test_getPath_videos: () => {
            return testRunner.compare(`console.log(require('electron').app.getPath("videos"))`)
        },
        test_getPath_recent: () => {
            return testRunner.compare(`console.log(require('electron').app.getPath("recent"))`)
        },
        // test_getPath_logs: () => {
        //     return testRunner.compare(`console.log(require('electron').app.getPath("logs"))`)
        // },
        // test_getPath_crashDumps: () => {
        //     return testRunner.compare(`console.log(require('electron').app.getPath("crashDumps"))`)
        // },
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
            return testRunner.compare(`console.log(require('electron').app.getLocale())`)
        },
        test_getLocaleCountryCode: () => {
            return testRunner.compare(`console.log(require('electron').app.getLocaleCountryCode())`)
        },
        test_getSystemLocale: () => {
            return testRunner.compare(`console.log(require('electron').app.getSystemLocale())`)
        },
        test_getPreferredSystemLanguages: () => {
            return testRunner.compare(`console.log(require('electron').app.getSystemLocale())`)
        }
    }
}