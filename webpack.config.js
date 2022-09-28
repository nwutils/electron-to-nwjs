
// NW.js 0.14.7 includes Chromium 50.0.2661.102 and Node.js 5.11.1
// https://nodejs.org/dist/latest-v5.x/docs/api/

const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const child_process = require('child_process')

const jsFiles = []
var fakeLibsFolder = ""
if (env.main === true) {
    const projectPath = path.resolve(__dirname, '.', 'www')
    const projectPackagePath = path.resolve(projectPath, 'package.json')
    const projectPackageStr = fs.readFileSync(projectPackagePath, {encoding: 'utf-8'})
    const projectPackageJson = JSON.parse(projectPackageStr)
    const mainFile = projectPackageJson.main;
    jsFiles.push(mainFile);

    fakeLibsFolder = path.resolve(__dirname, "fakelibs", "main")
}
else {
    const projectPath = path.resolve(__dirname, '.', 'www')
    const listHtmlsStr = child_process.execSync('find . -type f -name "*.html"', {cwd: projectPath, encoding: 'utf8'})
    const listHtmls = listHtmlsStr.split("\n").filter(line => line.trim().length > 0 && !line.startsWith("./node_modules/"))
    listHtmls.forEach(htmlPath => {
        const indexHtmlContents = fs.readFileSync(path.join(projectPath, htmlPath), {encoding: 'utf-8'})
        const $ = cheerio.load(indexHtmlContents);
        const scripts = $('script[src]')
        jsFiles.push(...scripts.map(function() { return $(this).attr('src'); }).get())
    })

    fakeLibsFolder = path.resolve(__dirname, "fakelibs", "renderer")
}

const aliases = {}
const dependenciesThatShouldBeFaked = fs.readdirSync(fakeLibsFolder)
dependenciesThatShouldBeFaked.forEach(dep => aliases[dep] = path.join(fakeLibsFolder, deb))

module.exports = (env, argv) => ({
    target: ['nwjs', 'node5'],
    entry: {
        main: ['babel-polyfill'].concat(jsFiles.map(jsFile => path.resolve(__dirname, './www', jsFile))),
    },
    mode: "production",
    output: {
        path: path.resolve(__dirname, "./_www"),
        filename: jsFiles[0]
    },
    resolve: {
        alias: aliases
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
                  replace: env.prod ? "(require('path').dirname(process.execPath))" : "(process.cwd())",
                  flags: 'g'
                }
            },
            {
                test: /\.js$/,
                loader: 'string-replace-loader',
                options: {
                  search: '__is_packaged',
                  replace: env.prod ? "true" : "false",
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
                        presets: [['@babel/preset-env', {useBuiltIns: 'usage', corejs:'2'}]],
                        plugins: ["@babel/plugin-transform-async-to-generator"]
                    }
                }
            }
        ]
    },
    optimization: {
        minimize: false
    }
});
