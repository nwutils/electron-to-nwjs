const fs = require('fs')
const path = require('path')

const mainWindowId = "NWJS_MAIN"
const mainHtmlFileName = "NWJS_MAIN.html"

const buildProjectPath = path.resolve(__dirname, '.', '_www')
const buildProjectPackagePath = path.resolve(buildProjectPath, 'package.json')
let buildProjectPackageStr = fs.readFileSync(buildProjectPackagePath, {encoding: 'utf-8'})
const buildProjectPackageJson = JSON.parse(buildProjectPackageStr)

const mainJs = buildProjectPackageJson.main
const mainHtmlContents = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
        </head>
        <body>
            <script src="${mainJs}"></script>
        </body>
    </html>
`
const mainJsPath = path.resolve(buildProjectPath, mainHtmlFileName)
fs.writeFileSync(mainJsPath, mainHtmlContents, {encoding:'utf-8'})

buildProjectPackageJson.main = mainHtmlFileName
buildProjectPackageJson.window = {
    id: mainWindowId,
    height: 100,
    width: 100,
    show: false
}
buildProjectPackageStr = JSON.stringify(buildProjectPackageJson, null, 2)
fs.writeFileSync(buildProjectPackagePath, buildProjectPackageStr, {encoding:'utf-8'})
