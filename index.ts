import child_process from 'child_process'
import fs from 'fs'
import fse from 'fs-extra'
import os from 'os'
import path from 'path'
import { Command } from 'commander';
import webpack from 'webpack'
import cheerio from 'cheerio'
const webpackConfigFn = require('./webpack.config')

const onTmpFolder = function(callback:(tmpDir:string) => void) {
    let tmpDir;
    const appPrefix = 'electron-to-nwjs';
    try {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
        callback(tmpDir)
    }
    catch (e) {
        throw e
    }
    finally {
        try {
            if (tmpDir) {
                fs.rmdirSync(tmpDir, { recursive: true });
            }
        }
        catch (e) {
            console.error(`An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`);
        }
    }
}

const runPrebuildAndWebpack = function(opts:{projectDir:string, prod:boolean}, callback:() => void) {
    const prebuildOutput = child_process.execSync("npm run nwjs:prebuild --if-present", {cwd:opts.projectDir})
    console.log(prebuildOutput)

    onTmpFolder((tmpDir) => {
        fse.copySync(opts.projectDir, tmpDir)
        webpack(webpackConfigFn({
            prod: opts.prod,
            main: true,
            projectPath: opts.projectDir,
            outputPath: tmpDir
        }), (err, stats) => {
            if (err || stats.hasErrors()) {
                console.error(err)
                return
            }

            webpack(webpackConfigFn({
                prod: opts.prod,
                main: false,
                projectPath: opts.projectDir,
                outputPath: tmpDir
            }), (err, stats) => {
                if (err || stats.hasErrors()) {
                    console.error(err)
                    return
                }

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
                callback()
            })
        })
    })
}

const program = new Command();

program
  .command('start <dir>')
  .description('start an Electron project with NW.js')
  .action((dir) => {
    const projectDir = path.resolve(__dirname, dir)
    runPrebuildAndWebpack({projectDir, prod:false}, () => {
        require('./nwjs-start')
    })
  });

program
  .command('build')
  .description('build an Electron project with NW.js')
  .option('--projectDir, --project', 'The path to project directory. Defaults to current working directory.', '.')
  .option('--mac, -m, -o, --macos', 'Build for macOS')
  .option('--linux, -l', 'Build for Linux')
  .option('--win, -w, --windows', 'Build for Windows')
  .action(function() {
    const opts = this.opts()
    const projectDir = path.resolve(__dirname, opts.projectDir)
    runPrebuildAndWebpack({projectDir, prod:true}, () => {
        require('./nwjs-build')
    })
  });

program.parse(process.argv);