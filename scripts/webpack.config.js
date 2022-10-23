const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const child_process = require('child_process')
const glob = require('simple-glob')
const defaults = require('../defaults')
const Versions = require('./utils/versions')

const defaultNwjsVersion = defaults.nwjsVersion

module.exports = (env, argv) => {
    const projectPath = env.projectPath
    const outputPath = env.outputPath
    const ignoreUnimplementedFeatures = env.ignoreUnimplementedFeatures

    const projectPackagePath = path.resolve(projectPath, 'package.json')
    const projectPackageStr = fs.readFileSync(projectPackagePath, {encoding: 'utf-8'})
    const projectPackageJson = JSON.parse(projectPackageStr)
    const nwjs = projectPackageJson.nwjs || {}
    const nwjsVersion = (env.prod ? nwjs.buildVersion : nwjs.runVersion) || nwjs.version || defaultNwjsVersion
    const nwjsVersionRedux = nwjsVersion.split(".").slice(0, 2).join(".")

    // NW.js 0.14.7 includes Chromium 50.0.2661.102 and Node.js 5.11.1
    // https://nwjs.io/blog/

    let nodeVersionByNwjsVersion = [
        ["0.15.0", "6"],
        ["0.18.3", "7"],
        ["0.23.0", "8"],
        ["0.26.3", "9"],
        ["0.30.1", "10"],
        ["0.34.1", "11"],
        ["0.38.1", "12"],
        ["0.42.1", "13"],
        ["0.45.4", "14"],
        ["0.49.2", "15"],
        ["0.53.1", "16"],
        ["0.59.0", "17"],
        ["0.64.1", "18"]
    ]
    let nodeVersionTarget = "5"
    nodeVersionByNwjsVersion.forEach(entry => {
        if (Versions.isVersionEqualOrSuperiorThanVersion(nwjsVersion, entry[0])) {
            nodeVersionTarget = entry[1]
        }
    })
    let addPolyfill = ["5", "6", "7"].includes(nodeVersionTarget)

    const jsFiles = []
    if (env.main === true) {
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

    const externals = nwjs.webpack?.externals || []
    
    const jsFileByOutputFile = {}
    if (env.main === true) {
        let jsFile = jsFiles[0];
        let jsFileName = jsFile.substring(0, jsFile.length - 3)
        jsFileByOutputFile[jsFileName] = [
            path.resolve(fakeLibsFolder, 'pre-main.js'),
            path.resolve(projectPath, jsFile),
            path.resolve(fakeLibsFolder, 'post-main.js')
        ]
        if (addPolyfill) {
            jsFileByOutputFile[jsFileName].unshift('regenerator-runtime/runtime');
            jsFileByOutputFile[jsFileName].unshift('core-js/stable');
        }
    }
    else {
        jsFiles.forEach(jsFile => {
            jsFileByOutputFile[jsFile.substring(0, jsFile.length - 3)] = [path.resolve(projectPath, jsFile)]
        })
    }

    return {
        target: [`nwjs${nwjsVersionRedux}`],
        entry: jsFileByOutputFile,
        mode: env.prod ? "production" : "development",
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
                        search: '__dirname',
                        replace: env.prod ?
                            "(require('path').dirname(process.execPath))" :
                            "(require('path').join(process.cwd(), require('path').dirname('[name].js')))",
                        flags: 'g'
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    options: {
                        search: '__nwjs_version',
                        replace: JSON.stringify(nwjsVersion),
                        flags: 'g'
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    options: {
                        search: '__nwjs_app_version',
                        replace: JSON.stringify(projectPackageJson.version),
                        flags: 'g'
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    options: {
                        search: '__nwjs_app_name',
                        replace: JSON.stringify((projectPackageJson.build || {}).productName || projectPackageJson.name),
                        flags: 'g'
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    options: {
                        search: '__nwjs_is_main',
                        replace: JSON.stringify(env.main),
                        flags: 'g'
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    options: {
                        search: '__nwjs_is_packaged',
                        replace: JSON.stringify(env.prod),
                        flags: 'g'
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    options: {
                        search: '__nwjs_ignore_unimplemented_features',
                        replace: JSON.stringify(ignoreUnimplementedFeatures),
                        flags: 'g'
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            sourceType: "script",
                            presets: [['@babel/preset-env']]
                        }
                    }
                }
            ]
        },
        optimization: {
            minimize: false
        }
    }
};
