const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const child_process = require('child_process')
const glob = require('simple-glob')
const Versions = require('./utils/versions')

module.exports = (env, argv) => {
    const projectPath = env.projectPath
    const outputPath = env.outputPath
    const isMain = env.main === true
    const isBuild = env.prod === true
    
    const opts = env.opts || {}
    const ignoreUnimplementedFeatures = opts.ignoreUnimplementedFeatures

    const projectPackagePath = path.resolve(projectPath, 'package.json')
    const projectPackageStr = fs.readFileSync(projectPackagePath, {encoding: 'utf-8'})
    const projectPackageJson = JSON.parse(projectPackageStr)
    const nwjs = projectPackageJson.nwjs || {}
    const nwjsVersion = opts.nwjsVersion
    const nwjsVersionRedux = nwjsVersion.split(".").slice(0, 2).join(".")
    const nodeVersion = opts.nodeVersion

    const jsFiles = []
    if (isMain) {
        jsFiles.push(projectPackageJson.main)
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

    const aliases = {}
    const fakeLibsFolder = path.resolve(__dirname, '..', "fakelibs")
    const dependenciesThatShouldBeFaked = fs.readdirSync(fakeLibsFolder)
    dependenciesThatShouldBeFaked.filter(dep => !dep.endsWith(".js"))
        .forEach(dep => aliases[dep] = path.join(fakeLibsFolder, dep))

    const externals = nwjs.webpack?.externals || {}

    // Workarounds to make libs that import "node:*" work properly
    const nodeCoreModules = ["buffer", "child_process", "crypto", "fs", "http", "http2", "https",
                             "net", "os", "path", "stream", "url", "util", "zlib"]
    nodeCoreModules.forEach(nodeCoreModule => externals[`node:${nodeCoreModule}`] = `require('${nodeCoreModule}')`)
    externals["fs/promises"] = "require('fs').promises"
    
    const jsFileByOutputFile = {}
    if (isMain) {
        jsFiles.forEach(jsFile => {
            let jsFileName = jsFile.substring(0, jsFile.length - 3)
            jsFileByOutputFile[jsFileName] = [
                path.resolve(fakeLibsFolder, 'pre-main.js'),
                path.resolve(projectPath, jsFile),
                path.resolve(fakeLibsFolder, 'post-main.js')
            ]
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

    const stringReplacements = [
        {
            // Workaround for the lack of __dirname, also compatible with older versions of NW.js
            // https://github.com/nwjs/nw.js/issues/264

            search: '__dirname',
            replace: isBuild ?
                "(require('path').dirname(process.execPath))" :
                "(require('path').join(process.cwd(), require('path').dirname('[name].js')))",
        },
        {
            // TODO: Untested
            search: 'process.resourcesPath',
            replace: "(process.cwd())"
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
        }
    ]

    

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
                    // Workaround for the lack of setImmediate
                    // https://github.com/nwjs/nw.js/issues/897

                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    exclude: /node_modules\/(core-js|([^\/]*babel[^\/]*))\//,
                    options: {
                        search: `((var\\s+)|(let\\s+)|(const\\s+)|([^\\w\\d_\\.]))(setImmediate)[^\\w\\d_]`,
                        replace(match) {
                            if (match.startsWith("const") || match.startsWith("let") || match.startsWith("var")) {
                                return match
                            }
                            return match.replace("setImmediate", "global.setImmediate")
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

    console.log("")
    console.log("About to start webpack...")
    console.log(`NW.js version: ${nwjsVersion}`)
    console.log(`Target: ${config.target}`)
    console.log(`Mode: ${config.mode}`)
    console.log("")

    return config
};
