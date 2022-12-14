const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const child_process = require('child_process')
const glob = require('simple-glob')
const Versions = require('./utils/versions')
const nodeExternals = require('./utils/node-externals')

module.exports = (env, argv) => {
    const projectPath = env.projectPath
    const outputPath = env.outputPath
    const isMain = env.main === true
    const isBuild = env.prod === true
    
    const opts = env.opts || {}
    const ignoreUnimplementedFeatures = opts.nwjs.ignoreUnimplementedFeatures

    const projectPackagePath = path.resolve(projectPath, 'package.json')
    const projectPackageStr = fs.readFileSync(projectPackagePath, {encoding: 'utf-8'})
    const projectPackageJson = JSON.parse(projectPackageStr)
    
    let nwjs = {}
    const electronToNwjsConfigJsPath = path.join(projectPath, "electron-to-nwjs.config.js")
    if (fs.existsSync(electronToNwjsConfigJsPath)) {
        nwjs = require(electronToNwjsConfigJsPath)
        if (typeof nwjs === 'function') {
            nwjs = nwjs()
        }
    }
    const nwjsVersion = opts.nwjs.version
    const nwjsVersionRedux = nwjsVersion.split(".").slice(0, 2).join(".")
    const electronVersion = opts.electronVersion

    const stringReplacements = [
        {
            // TODO: Untested
            search: 'process.type',
            replace: JSON.stringify(isMain ? "browser" : "renderer")
        },
        {
            search: '__electron_version',
            replace: JSON.stringify(electronVersion)
        },
        {
            search: '__nwjs_version',
            replace: JSON.stringify(nwjsVersion)
        },
        {
            search: '__nwjs_project_name',
            replace: JSON.stringify(projectPackageJson.name)
        },
        {
            search: '__nwjs_app_version',
            replace: JSON.stringify(projectPackageJson.version)
        },
        {
            search: '__nwjs_app_name',
            replace: JSON.stringify((projectPackageJson.build || {}).productName || projectPackageJson.name)
        },
        {
            search: '__nwjs_is_main',
            replace: JSON.stringify(isMain)
        },
        {
            search: '__nwjs_is_packaged',
            replace: JSON.stringify(isBuild)
        },
        {
            search: '__nwjs_ignore_unimplemented_features',
            replace: JSON.stringify(ignoreUnimplementedFeatures)
        },
        {
            search: '__nwjs_feature_node_api_available',
            replace: JSON.stringify(Versions.doesVersionMatchesConditions(nwjsVersion, ">0.25.3"))
        },
        {
            // show_in_taskbar was unavailable for a while
            // https://github.com/nwjs/nw.js/issues/4970

            search: '__nwjs_feature_show_in_taskbar_available',
            replace: JSON.stringify(Versions.doesVersionMatchesConditions(nwjsVersion, ">0.18.8"))
        }
    ]

    const jsFiles = []
    if (isMain) {
        jsFiles.push(env.mainFilename || projectPackageJson.main)
    }
    else if (nwjs.webpack?.entry !== undefined) {
        jsFiles.push(...glob({cwd:projectPath}, nwjs.webpack.entry))
    }
    else {
        const listHtmlsStr = child_process.execSync('find . -type f -name "*.html"', {cwd: projectPath, encoding: 'utf8'})
        const listHtmls = listHtmlsStr.split("\n").filter(line => line.trim().length > 0 && !line.startsWith("./node_modules/"))
        listHtmls.forEach(htmlPath => {
            const indexHtmlContents = fs.readFileSync(path.join(projectPath, htmlPath), {encoding: 'utf-8'})
            const $ = cheerio.load(indexHtmlContents);
            const scripts = $('script[src]')
            jsFiles.push(...scripts.map(function() { return $(this).attr('src'); }).get())
        })
    }

    const extraDependencies = []
    const monkeypatchesFolder = path.resolve(__dirname, '..', "monkeypatches")
    fs.readdirSync(monkeypatchesFolder)
        .filter(fun => {
            const funConfigPath = path.join(monkeypatchesFolder, fun, "config.json")
            const funConfigStr = fs.readFileSync(funConfigPath, {encoding:'utf-8'})
            const funConfig = JSON.parse(funConfigStr)
            if (!Versions.doesVersionMatchesConditions(nwjsVersion, funConfig.nwjs)) {
                return
            }

            extraDependencies.push(path.join(monkeypatchesFolder, fun, "index.js"))
        })

    const aliases = {}
    const fakeLibsFolder = path.resolve(__dirname, '..', "fakelibs")
    const dependenciesThatShouldBeFaked = fs.readdirSync(fakeLibsFolder)
    dependenciesThatShouldBeFaked.filter(dep => !dep.endsWith(".js"))
        .forEach(dep => aliases[dep] = path.join(fakeLibsFolder, dep))

    const externals = nwjs.webpack?.externals || {}
    Object.assign(externals, nodeExternals)
    
    const jsFileByOutputFile = {}
    if (isMain) {
        jsFiles.forEach(jsFile => {
            let jsFileName = jsFile.substring(0, jsFile.length - 3)
            jsFileByOutputFile[jsFileName] = [
                path.resolve(fakeLibsFolder, 'pre-main.js'),
                path.resolve(projectPath, jsFile),
                path.resolve(fakeLibsFolder, 'post-main.js')
            ]
            jsFileByOutputFile[jsFileName].unshift(...extraDependencies)
        })
    }
    else {
        jsFiles.forEach(jsFile => {
            let jsFileName = jsFile.substring(0, jsFile.length - 3)
            jsFileByOutputFile[jsFileName] = [
                path.resolve(projectPath, jsFile)
            ]
        })
    }

    const config = {
        target: [`nwjs${nwjsVersionRedux}`],
        entry: jsFileByOutputFile,
        mode: "production",
        output: {
            path: outputPath,
            filename: '[name].js'
        },
        externals: externals,
        resolve: {
            alias: aliases,
            modules: [
                path.resolve(__dirname, '..', 'node_modules'),
                'node_modules'
            ]
        },
        experiments: {
            topLevelAwait: true
        },
        module: {
            rules: [
                {
                    // Workaround for the lack of __dirname, also compatible with older versions of NW.js
                    // https://github.com/nwjs/nw.js/issues/264

                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    options: {
                        search: `[^\\w\\d_\\.](__dirname)[^\\w\\d_]`,
                        replace(match) {
                            if (isBuild) {
                                return match.replace("__dirname", `(require("path").dirname(process.execPath))`)
                            }
                            let resourceFolderPath = path.dirname(path.relative(projectPath, this.resource))
                            return match.replace("__dirname", 
                                `(require("path").join(process.cwd(), ${JSON.stringify(resourceFolderPath)}))`)
                        },
                        flags: 'g'
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    options: {
                        multiple: stringReplacements.map(rep => {
                            return {
                                search: `[^\\w\\d_\\.](${rep.search})[^\\w\\d_]`,
                                replace(match) {
                                    return match.replace(rep.search, rep.replace)
                                },
                                flags: 'gm'
                            }
                        })
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    exclude: /node_modules\/(core-js|([^\/]*babel[^\/]*))\//,
                    options: {
                        search: `__nwjs_version_(lte|lt|gte|gt)_[0-9_]+`,
                        replace(match) {
                            let subMatch = match.substring("__nwjs_version_".length).split("_")
                            let comparison = subMatch.shift()
                            let comparisonOperator = {
                                lte: "<=",
                                lt:  "<",
                                gte: ">=",
                                gt:  ">"
                            }[comparison]
                            let version = subMatch.join(".")
                            return Versions.doesVersionMatchesConditions(nwjsVersion, `${comparisonOperator}${version}`).toString()
                        },
                        flags: 'gm'
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules\/(core-js|([^\/]*babel[^\/]*))\//,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            sourceType: "script",
                            presets: [['@babel/preset-env', {
                                useBuiltIns: "usage",
                                corejs: 3,
                                debug: !isBuild
                            }]]
                        }
                    }
                }
            ]
        },
        optimization: {
            minimize: isBuild
        }
    }

    const npResume = extraDependencies.map(f => path.basename(path.dirname(f))).join(", ")

    console.log("")
    console.log("About to start webpack...")
    console.log(`NW.js version: ${nwjsVersion}`)
    console.log(`Target: ${config.target}`)
    console.log(`Mode: ${config.mode}`)
    console.log(`Node polyfills: ${npResume.length === 0 ? "none" : npResume}`)
    console.log("")

    return config
};
