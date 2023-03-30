import child_process from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import fse from 'fs-extra'
import { Command } from 'commander';
import plistUtils from 'plist'
const HtmlTranspiler = require('./scripts/transpile-html')
const JsTranspiler = require('./scripts/transpile-js')
const Versions = require('./scripts/utils/versions')

const buildDir = "nwjs_build"
const distDir = "nwjs_dist"

const getCurrentOs = function() {
    let platform = os.platform()
    if (platform === 'darwin') {
        return "mac"
    }
    if (platform === 'linux') {
        return 'linux'
    }
    return 'win'
}

const currentSystemRecommendedNwjsVersion = function() {
    // Reference:
    // https://dev.to/thejaredwilcurt/guide-to-nw-js-versions-5d38#osx-support
    
    let platform = getCurrentOs()
    if (platform === "mac") {
        let osVersion = child_process.execSync("sw_vers -productVersion", {encoding:'utf-8'}).toString().trim()
        if (!Versions.isVersionEqualOrSuperiorThanVersion(osVersion + ".0", "10.9.0")) {
            // NW.js v0.14.7 and below works with 10.6+
            // NW.js v0.15.0 works with 10.9+
            return "0.14.7"
        }
        if (!Versions.isVersionEqualOrSuperiorThanVersion(osVersion + ".0", "10.10.0")) {
            // NW.js v0.29.0 works with 10.10+
            return "0.28.3"
        }
        if (!Versions.isVersionEqualOrSuperiorThanVersion(osVersion + ".0", "10.11.0")) {
            // NW.js v0.51.0 works with 10.11+
            return "0.50.3"
        }
        if (!Versions.isVersionEqualOrSuperiorThanVersion(osVersion + ".0", "10.15.0")) {
            // NW.js v0.64.1 works with 10.15 and no longer accurately updates the plist file
            return "0.64.0"
        }
    }
    return "0.69.1"
}

const onTmpFolder = async function(dest:string, callback:(tmpDir:string) => Promise<void>) {
    const appPrefix = 'electron-to-nwjs';
    let tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
    console.log(`Temporary folder: ${tmpDir}`)
    
    try {
        await callback(tmpDir)
    }
    finally {
        if (fs.existsSync(dest)) {
            fs.rmdirSync(dest, { recursive: true });
        }
        fse.moveSync(tmpDir, dest)
    }
}

const runPrebuildAndCreateNwjsProject = function(opts:{projectDir:string, mainFilename?:string, prod:boolean, opts:any}, callback:(tmpDir:string) => void) {
    child_process.execSync("npm run nwjs:prebuild --if-present", {cwd:opts.projectDir, stdio: 'inherit', encoding:'utf-8'})

    onTmpFolder(path.join(opts.projectDir, buildDir), async function(tmpDir) {
        fse.copySync(opts.projectDir, tmpDir)

        // So the cache and dist folders won't be copied, since they are not only not
        // needed, but they also can be become very big
        let ignorableFolder = [
            {original:path.resolve(opts.projectDir, 'cache'),  temp:path.resolve(tmpDir, 'cache')},
            {original:path.resolve(opts.projectDir, buildDir), temp:path.resolve(tmpDir, buildDir)},
            {original:path.resolve(opts.projectDir, distDir),  temp:path.resolve(tmpDir, distDir)}
        ]
        ignorableFolder.forEach(folder => {
            if (!fs.existsSync(folder.original)) {
                fs.mkdirSync(folder.original)
            }
            if (fs.existsSync(folder.temp)) {
                fse.rmdirSync(folder.temp, {recursive: true})
            }
            fs.symlinkSync(folder.original, folder.temp)
        })

        const projectPackagePath = path.resolve(tmpDir, 'package.json')
        let projectPackageStr = fs.readFileSync(projectPackagePath, {encoding: 'utf-8'})
        const projectPackageJson = JSON.parse(projectPackageStr)

        const packagesListKeys = ["dependencies", "devDependencies", "peerDependencies", 
                                  "peerDependenciesMeta", "optionalDependencies", "overrides"]
        packagesListKeys.forEach(key => {
            let dependencies = opts.opts[key] || {}
            Object.keys(dependencies).forEach(depName => projectPackageJson[key][depName] = dependencies[depName])
        })

        projectPackageStr = JSON.stringify(projectPackageJson, null, 2)
        fs.writeFileSync(projectPackagePath, projectPackageStr, {encoding:'utf-8'})

        child_process.execSync("npm install", {cwd:tmpDir, stdio: 'inherit', encoding:'utf-8'})


        // So the electron node_module won't be compressed in the end, no matter what
        // That solves a building issue in Mac OS X 10.13 and lower
        const electronModuleFolder = path.resolve(tmpDir, 'node_modules', 'electron')
        if (fs.existsSync(electronModuleFolder)) {
            fse.rmdirSync(electronModuleFolder, {recursive: true})
        }
        
        await JsTranspiler({
            srcFolder: opts.projectDir,
            dstFolder: tmpDir,
            prod: opts.prod,
            opts: opts.opts,
            main: opts.mainFilename
        })
        await HtmlTranspiler({
            folder: tmpDir
        })
        
        callback(tmpDir)
    })
    .catch(e => console.error(e))
}

const loadPackageJsonFromFolder = function(folder:string) {
    const projectPackagePath = path.resolve(folder, 'package.json')
    let projectPackageStr = fs.readFileSync(projectPackagePath, {encoding: 'utf-8'})
    return JSON.parse(projectPackageStr)
}

const listNodeModulesThatShouldntBeKept = function(projectDir:string) {
    let nodeModulesFolder = path.resolve(projectDir, 'node_modules')
    let neededDependencies:string[] = []

    const getAllDependenciesFromModule = function(module:string) {
        let moduleFolder = path.resolve(nodeModulesFolder, module)
        if (!fs.existsSync(moduleFolder)) {
            return
        }
        let moduleJson = loadPackageJsonFromFolder(moduleFolder)
        Object.keys(moduleJson.dependencies || {}).forEach(dep => {
            if (!neededDependencies.includes(dep)) {
                neededDependencies.push(dep)
                getAllDependenciesFromModule(dep)
            }
        })
    }

    let packageJson = loadPackageJsonFromFolder(projectDir)
    Object.keys(packageJson.dependencies || {}).forEach(dep => {
        neededDependencies.push(dep)
        getAllDependenciesFromModule(dep)
    })

    neededDependencies = neededDependencies.filter((v, i, a) => a.indexOf(v) === i)
    //console.log(`Needed dependencies:\n${neededDependencies.map(d => `- ${d}`).join('\n')}\n\n`)

    let allDependencies = fs.readdirSync(nodeModulesFolder)
    let removableDependencies = allDependencies.filter((v, i) => neededDependencies.indexOf(v) === -1)
    return removableDependencies
}

const getElectronToNwjsProjectConfig = function(projectPath:string, isBuild:boolean, flagOpts:any) {
    let config = {} as {[id:string]:any}
    const electronToNwjsConfigJsPath = path.join(projectPath, "electron-to-nwjs.config.js")
    if (fs.existsSync(electronToNwjsConfigJsPath)) {
        config = require(electronToNwjsConfigJsPath)
        if (typeof config === 'function') {
            config = config()
        }
    }

    config.target = config.target || {}
    config.target.architecture = flagOpts.x86 ? "x64" : (config.target.architecture || "x64")
    
    let osList = ["mac","linux","win"]
    let flagOsList = osList.filter(os => flagOpts[os])
    if (flagOsList.length > 0) {
        osList.forEach(os => delete config.target[os])
        flagOsList.forEach(os => config.target[os] = true)
    }

    config.nwjs = config.nwjs || {}
    config.nwjs.version = flagOpts.nwjsVersion || (isBuild ? config.nwjs.build?.version : undefined) || config.nwjs.version
    config.nwjs.ignoreUnimplementedFeatures = config.nwjs.ignoreUnimplementedFeatures || flagOpts.ignoreUnimplementedFeatures
    
    let projectPackageJson = loadPackageJsonFromFolder(projectPath)
    let electronPackageJson = loadPackageJsonFromFolder(path.join(projectPath, "node_modules", "electron"))
    let electronVersion = (projectPackageJson.build || {}).electronVersion || electronPackageJson.version || "19.1.4"
    config.electronVersion = electronVersion
    
    return config
}

const buildNwjsBuilderConfig = function(projectPath:string, opts:any, os:"mac"|"linux"|"win") {
    const projectPackagePath = path.resolve(projectPath, 'package.json')
    let projectPackageStr = fs.readFileSync(projectPackagePath, {encoding: 'utf-8'})
    const projectPackageJson = JSON.parse(projectPackageStr)
    const disableNw2 = Versions.doesVersionMatchesConditions(opts.nwjs.version, ">=0.42.4 <=0.43.0")

    let nwjs = {} as {[id:string]:any}
    const electronToNwjsConfigJsPath = path.join(projectPath, "electron-to-nwjs.config.js")
    if (fs.existsSync(electronToNwjsConfigJsPath)) {
        nwjs = require(electronToNwjsConfigJsPath)
        if (typeof nwjs === 'function') {
            nwjs = nwjs()
        }
    }
    
    let flags = [
        "--enable-logging=stderr", // makes debugging easier
        disableNw2 ? "--disable-features=nw2" : "", // workaround for a bug with specific NW.js versions
        nwjs["chromium-args"] || ""
    ]
    projectPackageJson["chromium-args"] = flags.join(" ")
    projectPackageJson["node-remote"] = nwjs["node-remote"]
    
    let build = (projectPackageJson.build || {})
    projectPackageJson["build"] = build
    projectPackageJson["build"]["electronVersion"] = opts.electronVersion

    let appName = (build[os] || {}).productName || build.productName || projectPackageJson.name || "Unknown"
    projectPackageJson["product_string"] = appName

    projectPackageJson["build"]["mac"] = projectPackageJson["build"]["mac"] || {}
    projectPackageJson["build"]["mac"]["extendInfo"] = projectPackageJson["build"]["mac"]["extendInfo"] || {}
    let plistExtras = projectPackageJson["build"]["mac"]["extendInfo"]
    plistExtras["CFBundleDisplayName"] = plistExtras["CFBundleDisplayName"] || appName

    let iconPath = path.join("build", (build[os] || {}).icon || ({mac:"icon.icns", linux:"icon.icns", win:"icon.ico"}[os]))

    console.log("")
    console.log(`chromium-args: ${projectPackageJson["chromium-args"]}`)
    console.log(`node-remote: ${projectPackageJson["node-remote"] || ""}`)
    console.log("")

    projectPackageStr = JSON.stringify(projectPackageJson, null, 2)
    fs.writeFileSync(projectPackagePath, projectPackageStr, {encoding:'utf-8'})

    let authorName = (projectPackageJson.author || {}).name || "Unknown"
    let nwjsConfig:{[id:string]:any} = {
        appName: appName,
        appVersion: projectPackageJson.version,
        company: authorName,
        copyright: (build[os] || {}).copyright || build.copyright || `Copyright © ${new Date().getFullYear()} ${authorName}. All rights reserved`,
        files: (build[os] || {}).files || build.files || ["**/**"],
        icon: iconPath
    }

    nwjsConfig.icon = path.join(projectPath, nwjsConfig.icon)
    if (!fs.existsSync(nwjsConfig.icon)) {
        nwjsConfig.icon = path.join(projectPath, "build", "icon.png")
    }
    if (!nwjsConfig.files.includes("**/**")) {
        nwjsConfig.files.unshift("**/**")
    }

    nwjsConfig.files.push(`!nwjs_build.js`)
    nwjsConfig.files.push(`!nwjs_start.js`)
    nwjsConfig.files.push(`!nwjs_build_config.json`)
    nwjsConfig.files.push(`!nwjs_start_config.json`)
    nwjsConfig.files.push(`!${buildDir}/*`)
    nwjsConfig.files.push(`!${distDir}/*`)
    let removableDependencies = listNodeModulesThatShouldntBeKept(projectPath)
    removableDependencies.forEach(dep => {
        nwjsConfig.files.push(`!node_modules/${dep}/**`)
    })

    nwjsConfig.files = nwjsConfig.files.map((file:string) => {
        if (file.endsWith("/*")) file = file + "*/**"
        const ignorable = file.startsWith("!")
        if (ignorable) file = file.substring(1)
        return (ignorable?"!":"") + "./" + file
    })

    if (os === "mac") {
        const entitlementsFilename = build[os].entitlements
        if (entitlementsFilename) {
            const entitlementsPath = path.join(projectPath, entitlementsFilename)
            const entitlementsStr = fs.readFileSync(entitlementsPath, {encoding:'utf-8'})
            const entitlements = plistUtils.parse(entitlementsStr) as {[id:string]:any}
            nwjsConfig.macPlist = entitlements
        }
    }

    return nwjsConfig
}

const showWarningForVersionIfNeeded = function(version:string) {
    if (Versions.doesVersionMatchesConditions(version, "<0.14.7")) {
        console.warn("WARNING!!! electron-to-nwjs officially only supports NW.js 0.14.7 and superior versions!")
    }
    if (["0.42.4", "0.42.5", "0.42.6"].includes(version)) {
        console.warn("WARNING!!! That NW.js version is known not to work properly!")
    }
    if (Versions.doesVersionMatchesConditions(version, "<0.25.4")) {
        console.warn("WARNING! NW.js 0.25.3 and below are not compatible with Node-API!")
    }
}

const program = new Command();

program
  .command('start <dir>')
  .description('start an Electron project with NW.js')
  .option('-v, --nwjs-version <version>', 'NW.js version', currentSystemRecommendedNwjsVersion())
  .option('--ignore-unimplemented-features', 'Ignore features that were not implemented by electron-to-nwjs (produced a warning instead of an exception)', false)
  .action(function(dir) {
    const opts = this.opts()
    let mainFilename = undefined
    let projectDir = path.resolve('.', dir)
    if (projectDir.endsWith(".js")) {
        mainFilename = path.basename(projectDir)
        projectDir = path.dirname(projectDir)
    }
    const nwjsConfig = getElectronToNwjsProjectConfig(projectDir, false, opts)
    showWarningForVersionIfNeeded(nwjsConfig.nwjs.version)

    runPrebuildAndCreateNwjsProject({projectDir, mainFilename, prod:false, opts:nwjsConfig}, (tmpDir) => {
        const config = buildNwjsBuilderConfig(tmpDir, nwjsConfig, getCurrentOs())

        const configStr = JSON.stringify({
            appName: config.appName,
            appVersion: config.appVersion,
            files: config.files,
            version: nwjsConfig.nwjs.version
        }, null, 2);
        const configPath = path.join(tmpDir, "nwjs_start_config.json")
        const scriptPath = path.join(tmpDir, "nwjs_start.js")
        fs.writeFileSync(configPath, configStr, {encoding:'utf8'})
        fs.copyFileSync(path.join(__dirname, "nwjs_start.js"), scriptPath)
        child_process.execSync(`node ./nwjs_start.js`, {cwd:tmpDir, stdio: 'inherit'})
    })
  });

program
  .command('build')
  .description('build an Electron project with NW.js')
  .option('--projectDir, --project <dir>', 'The path to project directory. Defaults to current working directory.', '.')
  .option('-m, --mac, --macos', 'Build for macOS')
  .option('-l, --linux', 'Build for Linux')
  .option('-w, --win, --windows', 'Build for Windows')
  .option('--nwjs-version <version>', 'NW.js version', currentSystemRecommendedNwjsVersion())
  .option('--x86', 'Build for x86')
  .option('--ignore-unimplemented-features', 'Ignore features that were not implemented by electron-to-nwjs (produced a warning instead of an exception)', false)
  .action(function() {
    const opts = this.opts()
    const projectDir = path.resolve('.', opts.project)
    const nwjsConfig = getElectronToNwjsProjectConfig(projectDir, true, opts)
    showWarningForVersionIfNeeded(nwjsConfig.nwjs.version)

    runPrebuildAndCreateNwjsProject({projectDir, prod:true, opts:nwjsConfig}, (tmpDir) => {
        const platforms = ["mac", "linux", "win"].filter(s => nwjsConfig.target[s]) as ("mac"|"linux"|"win")[]
        if (platforms.length === 0) {
            platforms.push(getCurrentOs())
        }

        for (const platform of platforms) {
            const config = buildNwjsBuilderConfig(tmpDir, nwjsConfig, platform)

            let nwjsPlatform:string = platform
            if (nwjsPlatform === "mac") {
                nwjsPlatform = "osx"
            }
            
            const configStr = JSON.stringify({
                files: config.files,
                version: nwjsConfig.nwjs.version,
                flavor: 'normal',
                platforms: [nwjsPlatform + (nwjsConfig.target.architecture === "x86" ? "32" : "64")],
                appName: config.appName,
                appVersion: config.appVersion,
                buildDir: path.resolve(projectDir, path.join('.', distDir)),
                // macCredits (path to your credits.html)
                macIcns: config.icon,
                macPlist: config.macPlist,
                winVersionString: {
                    'CompanyName': config.company,
                    'FileDescription': config.appName,
                    'ProductName': config.appName,
                    'LegalCopyright': config.copyright
                },
                winIco: config.icon,
                useRcedit: true
            }, null, 2);
            const configPath = path.join(tmpDir, "nwjs_build_config.json")
            const scriptPath = path.join(tmpDir, "nwjs_build.js")
            fs.writeFileSync(configPath, configStr, {encoding:'utf8'})
            fs.copyFileSync(path.join(__dirname, "nwjs_build.js"), scriptPath)
            child_process.execSync(`node ./nwjs_build.js`, {cwd:tmpDir, stdio: 'inherit'})
        }

        child_process.execSync("npm run nwjs:postdist --if-present", {cwd:projectDir, stdio: 'inherit', encoding:'utf-8'})
    })
  });

program.parse(process.argv);
