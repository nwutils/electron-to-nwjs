const webpack = require('webpack')
const webpackConfigFn = require('./webpack.config')

const asyncWebpack = (config) => {
    return new Promise((resolve, reject) => {
        webpack(config, (err, stats) => {
            if (err || stats.hasErrors()) {
                console.error(err)
                console.error(stats.toJson())
                return reject(err)
            }

            resolve(undefined)
        })
    })
}

module.exports = async function({srcFolder, dstFolder, prod, main, opts}) {
    await asyncWebpack(webpackConfigFn({
        prod: prod,
        main: true,
        mainFilename: main,
        projectPath: srcFolder,
        outputPath: dstFolder,
        opts
    }))
    
    await asyncWebpack(webpackConfigFn({
        prod: prod,
        main: false,
        projectPath: srcFolder,
        outputPath: dstFolder,
        opts
    }))
}