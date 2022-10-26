const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

module.exports = async function({folder}) {
    const listHtmlsStr = child_process.execSync('find . -type f -name "*.html"', {cwd: folder, encoding: 'utf8'})
    const listHtmls = listHtmlsStr.split("\n").filter(line => line.trim().length > 0 && !line.includes("/node_modules/"))
    listHtmls.forEach(htmlPath => {
        let indexHtmlPath = path.join(folder, htmlPath)
        let indexHtmlContents = fs.readFileSync(indexHtmlPath, {encoding: 'utf-8'})
        const $ = cheerio.load(indexHtmlContents);
        let updated = false

        // Removing type="module" from <script> elements, so NW.js can load them in the correct context
        const scripts = $('script[type=module]')
        if (scripts.length > 0) {
            scripts.removeAttr('type')
            updated = true
        }

        if (updated) {
            indexHtmlContents = $.html();
            fs.writeFileSync(indexHtmlPath, indexHtmlContents, {encoding:'utf-8'})
        }
    })
}