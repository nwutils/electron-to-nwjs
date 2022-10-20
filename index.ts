import child_process from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import fse from 'fs-extra'
import { Command } from 'commander';
import webpack from 'webpack'
import cheerio from 'cheerio'
const NwBuilder = require('nw-builder');
const webpackConfigFn = require('./webpack.config')

const latestNwjsVersion = "0.69.1"

const onTmpFolder = async function(callback:(tmpDir:string) => Promise<void>) {
    let tmpDir;
    const appPrefix = 'electron-to-nwjs';
    try {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
        await callback(tmpDir)
    }
    catch (e) {
        throw e
    }
    finally {
        try {
            if (tmpDir) {
                //fs.rmdirSync(tmpDir, { recursive: true });
            }
        }
        catch (e) {
            console.error(`An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`);
        }
    }
}

const asyncWebpack = (config:webpack.Configuration) => {
    return new Promise((resolve, reject) => {
        webpack(config, (err, stats) => {
            if (err || stats!.hasErrors()) {
                console.error(err)
                console.error(stats!.toJson())
                return reject(err)
            }

            resolve(undefined)
        })
    })
}

const runPrebuildAndCreateNwjsProject = function(opts:{projectDir:string, prod:boolean}, callback:(tmpDir:string) => void) {
    const prebuildOutput = child_process.execSync("npm run nwjs:prebuild --if-present", {cwd:opts.projectDir, encoding:'utf-8'})
    console.log(prebuildOutput)

    onTmpFolder(async function(tmpDir) {
        fse.copySync(opts.projectDir, tmpDir)

        // So the electron node_module won't be compressed in the end, no matter what
        // That solves a building issue in Mac OS X 10.13 and lower
        fse.rmdirSync(path.resolve(tmpDir, 'node_modules', 'electron'), {recursive: true})
        
        await asyncWebpack(webpackConfigFn({
            prod: opts.prod,
            main: true,
            projectPath: opts.projectDir,
            outputPath: tmpDir
        }))
        
        await asyncWebpack(webpackConfigFn({
            prod: opts.prod,
            main: false,
            projectPath: opts.projectDir,
            outputPath: tmpDir
        }))
        
        // Removing type="module" from <script> elements
        const listHtmlsStr = child_process.execSync('find . -type f -name "*.html"', {cwd: tmpDir, encoding: 'utf8'})
        const listHtmls = listHtmlsStr.split("\n").filter(line => line.trim().length > 0 && !line.includes("/node_modules/"))
        listHtmls.forEach(htmlPath => {
            let indexHtmlPath = path.join(tmpDir, htmlPath)
            let indexHtmlContents = fs.readFileSync(indexHtmlPath, {encoding: 'utf-8'})
            const $ = cheerio.load(indexHtmlContents);
            const scripts = $('script[type=module]')
            if (scripts.length > 0) {
                scripts.removeAttr('type')
                indexHtmlContents = $.html();
                fs.writeFileSync(indexHtmlPath, indexHtmlContents, {encoding:'utf-8'})
            }
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
    let packageJson = loadPackageJsonFromFolder(projectDir)
    let rootDependencies = Object.keys(packageJson.dependencies)
    let neededDependencies:string[] = []

    const getAllDependenciesFromModule = function(module:string) {
        let moduleFolder = path.resolve(nodeModulesFolder, module)
        let moduleJson = loadPackageJsonFromFolder(moduleFolder)
        let moduleDependencies = Object.keys(moduleJson.dependencies)
        let allDependencies = moduleDependencies.concat([])
        moduleDependencies.forEach(dep => {
            allDependencies.push(...getAllDependenciesFromModule(dep))
        })
        return allDependencies
    }

    rootDependencies.forEach(dep => {
        neededDependencies.push(dep)
        let moduleFolder = path.resolve(nodeModulesFolder, dep)
        loadPackageJsonFromFolder(moduleFolder)
    })

    neededDependencies = neededDependencies.filter((v, i, a) => a.indexOf(v) === i)

    let allDependencies = fs.readdirSync(nodeModulesFolder)
    let removableDependencies = allDependencies.filter((v, i) => neededDependencies.indexOf(v) === -1)
    return removableDependencies
}

const buildNwjsBuilderConfig = function(projectPath:string) {
    const projectPackagePath = path.resolve(projectPath, 'package.json')
    let projectPackageStr = fs.readFileSync(projectPackagePath, {encoding: 'utf-8'})
    const projectPackageJson = JSON.parse(projectPackageStr)

    const nwjs = projectPackageJson.nwjs || {}
    
    // Mixed-context can't be used, otherwise the ipc methods won't work
    let flags = [
        "--enable-logging=stderr", // makes debugging easier
        nwjs["chromium-args"] || ""
    ]
    projectPackageJson["chromium-args"] = flags.join(" ")
    projectPackageJson["node-remote"] = nwjs["node-remote"]

    projectPackageStr = JSON.stringify(projectPackageJson, null, 2)
    fs.writeFileSync(projectPackagePath, projectPackageStr, {encoding:'utf-8'})

    let build = (projectPackageJson.build || {})
    let authorName = (projectPackageJson.author || {}).name || "Unknown"
    let nwjsConfig = {
        appName: (build.win || {}).productName || build.productName || projectPackageJson.name || "Unknown",
        company: authorName,
        copyright: (build.win || {}).copyright || build.copyright || `Copyright © ${new Date().getFullYear()} ${authorName}. All rights reserved`,
        files: (build.win || {}).files || build.files || ["**/**"],
        icon: (build.win || {}).icon || build.icon
    }

    if (nwjsConfig.icon) {
        nwjsConfig.icon = path.join(projectPath, nwjsConfig.icon)
    }
    if (!nwjsConfig.files.includes("**/**")) {
        nwjsConfig.files.unshift("**/**")
    }

    nwjsConfig.files.push("!.git")
    let removableDependencies = listNodeModulesThatShouldntBeKept(projectPath)
    removableDependencies.forEach(dep => {
        nwjsConfig.files.push(`!node_modules/${dep}/**`)
    })

    nwjsConfig.files = nwjsConfig.files.map((file:string) => {
        if (file.endsWith("/*")) file = file + "*/**"
        const ignorable = file.startsWith("!")
        if (ignorable) file = file.substring(1)
        return (ignorable?"!":"") + path.join(projectPath, file)
    })
    return nwjsConfig
}

const program = new Command();

program
  .command('start <dir>')
  .description('start an Electron project with NW.js')
  .action((dir) => {
    const projectDir = path.resolve('.', dir)
    runPrebuildAndCreateNwjsProject({projectDir, prod:false}, (tmpDir) => {
        const config = buildNwjsBuilderConfig(tmpDir)

        var nw = new NwBuilder({
            appName: config.appName,
            files: config.files,
            version: latestNwjsVersion
        });

        nw.on('log', console.log);
        nw.on("stdout", (out:string|Buffer) => {
            console.log(Buffer.isBuffer(out) ? out.toString() : out)
        });
        nw.on("stderr", (out:string|Buffer) => {
            console.error(Buffer.isBuffer(out) ? out.toString() : out)
        });

        nw.run().then(function(){
            console.info("App started")
        })
        .catch(function(error:Error) {
            console.error("App failed to start");
            console.error(error);
        });
    })
  });

program
  .command('build')
  .description('build an Electron project with NW.js')
  .option('--projectDir, --project <dir>', 'The path to project directory. Defaults to current working directory.', '.')
  .option('-m, -o, --mac, --macos', 'Build for macOS')
  .option('-l, --linux', 'Build for Linux')
  .option('-w, --win, --windows', 'Build for Windows')
  .option('-v, --nwjs-version <version>', 'NW.js version', latestNwjsVersion)
  .option('--x86', 'Build for x86')
  .action(function() {
    const opts = this.opts()
    const projectDir = path.resolve('.', opts.project)
    runPrebuildAndCreateNwjsProject({projectDir, prod:true}, (tmpDir) => {
        const config = buildNwjsBuilderConfig(tmpDir)
        
        const nwjsVersion = opts.nwjsVersion
        const platforms = []
        if (opts.mac)     platforms.push("osx"   + (opts.x86 ? "32" : ""))
        if (opts.linux)   platforms.push("linux" + (opts.x86 ? "32" : ""))
        if (opts.windows) platforms.push("win"   + (opts.x86 ? "32" : ""))
        
        var nw = new NwBuilder({
            buildDir: path.resolve(projectDir, './dist'),
            files: config.files,
            flavor: 'normal',
            platforms: platforms,
            version: nwjsVersion,
            winIco: config.icon,
            useRcedit: true,
            winVersionString: {
                'CompanyName': config.company,
                'FileDescription': config.appName,
                'ProductName': config.appName,
                'LegalCopyright': config.copyright
            }
        });

        nw.on('log', console.log);

        nw.build().then(function(){
            const postDistOutput = child_process.execSync("npm run nwjs:postdist --if-present", {cwd:projectDir})
            console.log(postDistOutput)
        })
        .catch(function(error:Error) {
            console.error(error);
        });
    })
  });

program.parse(process.argv);