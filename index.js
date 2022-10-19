"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
const webpack_1 = __importDefault(require("webpack"));
const cheerio_1 = __importDefault(require("cheerio"));
const webpackConfigFn = require('./webpack.config');
const onTmpFolder = function (callback) {
    let tmpDir;
    const appPrefix = 'electron-to-nwjs';
    try {
        tmpDir = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), appPrefix));
        callback(tmpDir);
    }
    catch (e) {
        throw e;
    }
    finally {
        try {
            if (tmpDir) {
                fs_1.default.rmdirSync(tmpDir, { recursive: true });
            }
        }
        catch (e) {
            console.error(`An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`);
        }
    }
};
const runPrebuildAndWebpack = function (opts, callback) {
    const prebuildOutput = child_process_1.default.execSync("npm run nwjs:prebuild --if-present", { cwd: opts.projectDir });
    console.log(prebuildOutput);
    onTmpFolder((tmpDir) => {
        fs_extra_1.default.copySync(opts.projectDir, tmpDir);
        (0, webpack_1.default)(webpackConfigFn({
            prod: opts.prod,
            main: true,
            projectPath: opts.projectDir,
            outputPath: tmpDir
        }), (err, stats) => {
            if (err || stats.hasErrors()) {
                console.error(err);
                return;
            }
            (0, webpack_1.default)(webpackConfigFn({
                prod: opts.prod,
                main: false,
                projectPath: opts.projectDir,
                outputPath: tmpDir
            }), (err, stats) => {
                if (err || stats.hasErrors()) {
                    console.error(err);
                    return;
                }
                const listHtmlsStr = child_process_1.default.execSync('find . -type f -name "*.html"', { cwd: tmpDir, encoding: 'utf8' });
                const listHtmls = listHtmlsStr.split("\n").filter(line => line.trim().length > 0 && !line.includes("/node_modules/"));
                listHtmls.forEach(htmlPath => {
                    let indexHtmlPath = path_1.default.join(tmpDir, htmlPath);
                    let indexHtmlContents = fs_1.default.readFileSync(indexHtmlPath, { encoding: 'utf-8' });
                    const $ = cheerio_1.default.load(indexHtmlContents);
                    const scripts = $('script[type=module]');
                    if (scripts.length > 0) {
                        scripts.removeAttr('type');
                        indexHtmlContents = $.html();
                        fs_1.default.writeFileSync(indexHtmlPath, indexHtmlContents, { encoding: 'utf-8' });
                    }
                });
                callback();
            });
        });
    });
};
const program = new commander_1.Command();
program
    .command('start <dir>')
    .description('start an Electron project with NW.js')
    .action((dir) => {
    const projectDir = path_1.default.resolve(__dirname, dir);
    runPrebuildAndWebpack({ projectDir, prod: false }, () => {
        require('./nwjs-start');
    });
});
program
    .command('build')
    .description('build an Electron project with NW.js')
    .option('--projectDir, --project', 'The path to project directory. Defaults to current working directory.', '.')
    .option('--mac, -m, -o, --macos', 'Build for macOS')
    .option('--linux, -l', 'Build for Linux')
    .option('--win, -w, --windows', 'Build for Windows')
    .action(function () {
    const opts = this.opts();
    const projectDir = path_1.default.resolve(__dirname, opts.projectDir);
    runPrebuildAndWebpack({ projectDir, prod: true }, () => {
        require('./nwjs-build');
    });
});
program.parse(process.argv);
