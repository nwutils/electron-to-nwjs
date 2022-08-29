
// NW.js 0.14.7 includes Chromium 50.0.2661.102 and Node.js 5.11.1
// https://nodejs.org/dist/latest-v5.x/docs/api/

const cheerio = require('cheerio');
const fs = require('fs')
const path = require('path')

const projectPath = path.resolve(__dirname, '.', 'www')
const projectPackagePath = path.resolve(projectPath, 'package.json')
const projectPackageStr = fs.readFileSync(projectPackagePath, {encoding: 'utf-8'})
const projectPackageJson = JSON.parse(projectPackageStr)
const nwjsConfig = projectPackageJson.nwjs || {}
const windowConfig = nwjsConfig.window || {}
const indexHtml = windowConfig.index || "index.html"

// TODO: Add support to HTML files with multiple scripts being imported
var indexHtmlContents = fs.readFileSync(path.join(projectPath, indexHtml), {encoding: 'utf-8'})
const $ = cheerio.load(indexHtmlContents);
var scripts = $('script[src]')
var scriptSrc = scripts.attr('src');
const indexJs = scriptSrc

module.exports = {
    target: ['nwjs', 'node5'],
    entry: {
        main: ['babel-polyfill', path.resolve(__dirname, './www', indexJs)]
    },
    mode: "production",
    output: {
        path: path.resolve(__dirname, "./_www"),
        filename: indexJs
    },
    experiments: {
        topLevelAwait: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'string-replace-loader',
                exclude: /node_modules/,
                options: {
                  search: '__dirname',
                  replace: `
                            function() {
                                let execPath = process.execPath
                                let isDebug = execPath.endsWith("/nw") || execPath.endsWith("\\nw.exe")
                                if (isDebug) {
                                    return process.cwd()
                                } else {
                                    return require('path').dirname(execPath)
                                }
                            }()
                           `,
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
};
