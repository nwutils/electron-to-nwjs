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
const NwBuilder = require('nw-builder');
const webpackConfigFn = require('./webpack.config');
const onTmpFolder = async function (callback) {
    let tmpDir;
    const appPrefix = 'electron-to-nwjs';
    try {
        tmpDir = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), appPrefix));
        await callback(tmpDir);
    }
    catch (e) {
        throw e;
    }
    finally {
        try {
            if (tmpDir) {
                //fs.rmdirSync(tmpDir, { recursive: true });
            }
        }
        catch (e) {
            console.error(`An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`);
        }
    }
};
const asyncWebpack = (config) => {
    return new Promise((resolve, reject) => {
        (0, webpack_1.default)(config, (err, stats) => {
            if (err || stats.hasErrors()) {
                console.error(err);
                console.error(stats.toJson());
                return reject(err);
            }
            resolve(undefined);
        });
    });
};
const runPrebuildAndCreateNwjsProject = function (opts, callback) {
    const prebuildOutput = child_process_1.default.execSync("npm run nwjs:prebuild --if-present", { cwd: opts.projectDir, encoding: 'utf-8' });
    console.log(prebuildOutput);
    onTmpFolder(async function (tmpDir) {
        fs_extra_1.default.copySync(opts.projectDir, tmpDir);
        await asyncWebpack(webpackConfigFn({
            prod: opts.prod,
            main: true,
            projectPath: opts.projectDir,
            outputPath: tmpDir
        }));
        await asyncWebpack(webpackConfigFn({
            prod: opts.prod,
            main: false,
            projectPath: opts.projectDir,
            outputPath: tmpDir
        }));
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
        callback(tmpDir);
    })
        .catch(e => console.error(e));
};
const buildNwjsBuilderConfig = function (projectPath) {
    const projectPackagePath = path_1.default.resolve(projectPath, 'package.json');
    let projectPackageStr = fs_1.default.readFileSync(projectPackagePath, { encoding: 'utf-8' });
    const projectPackageJson = JSON.parse(projectPackageStr);
    const nwjs = projectPackageJson.nwjs || {};
    const nwjsBuildVersion = (nwjs.build || {}).version || nwjs.version || "0.68.1";
    const nwjsRunVersion = nwjs.version || "0.68.1";
    // Mixed-context can't be used, otherwise the ipc methods won't work
    let flags = [
        "--enable-logging=stderr",
        nwjs["chromium-args"] || ""
    ];
    projectPackageJson["chromium-args"] = flags.join(" ");
    projectPackageJson["node-remote"] = nwjs["node-remote"];
    projectPackageStr = JSON.stringify(projectPackageJson, null, 2);
    fs_1.default.writeFileSync(projectPackagePath, projectPackageStr, { encoding: 'utf-8' });
    let build = (projectPackageJson.build || {});
    let authorName = (projectPackageJson.author || {}).name || "Unknown";
    let nwjsConfig = {
        buildConfig: {
            version: nwjsBuildVersion
        },
        runConfig: {
            version: nwjsRunVersion
        },
        appName: (build.win || {}).productName || build.productName || projectPackageJson.name || "Unknown",
        company: authorName,
        copyright: (build.win || {}).copyright || build.copyright || `Copyright © ${new Date().getFullYear()} ${authorName}. All rights reserved`,
        files: (build.win || {}).files || build.files || ["**/**"],
        icon: (build.win || {}).icon || build.icon,
        scripts: projectPackageJson.scripts
    };
    if (nwjsConfig.icon) {
        nwjsConfig.icon = path_1.default.join(projectPath, nwjsConfig.icon);
    }
    if (!nwjsConfig.files.includes("**/**")) {
        nwjsConfig.files.unshift("**/**");
    }
    nwjsConfig.files.push("package.json");
    nwjsConfig.files = nwjsConfig.files.map((file) => {
        const ignorable = file.startsWith("!");
        if (ignorable)
            file = file.substring(1);
        return (ignorable ? "!" : "") + path_1.default.join(projectPath, file);
    });
    return nwjsConfig;
};
const program = new commander_1.Command();
program
    .command('start <dir>')
    .description('start an Electron project with NW.js')
    .action((dir) => {
    const projectDir = path_1.default.resolve(__dirname, dir);
    runPrebuildAndCreateNwjsProject({ projectDir, prod: false }, (tmpDir) => {
        const config = buildNwjsBuilderConfig(tmpDir);
        var nw = new NwBuilder({
            appName: config.appName,
            files: config.files,
            version: config.runConfig.version
        });
        nw.on('log', console.log);
        nw.on("stdout", (out) => {
            console.log(Buffer.isBuffer(out) ? out.toString() : out);
        });
        nw.on("stderr", (out) => {
            console.error(Buffer.isBuffer(out) ? out.toString() : out);
        });
        nw.run().then(function () {
            console.info("App started");
        })
            .catch(function (error) {
            console.error("App failed to start");
            console.error(error);
        });
    });
});
program
    .command('build')
    .description('build an Electron project with NW.js')
    .option('--projectDir, --project', 'The path to project directory. Defaults to current working directory.', '.')
    .option('--mac, -m, -o, --macos', 'Build for macOS')
    .option('--linux, -l', 'Build for Linux')
    .option('--win, -w, --windows', 'Build for Windows')
    .option('--x86', 'Build for x86')
    .action(function () {
    const opts = this.opts();
    const projectDir = path_1.default.resolve(__dirname, opts.projectDir);
    runPrebuildAndCreateNwjsProject({ projectDir, prod: true }, (tmpDir) => {
        const config = buildNwjsBuilderConfig(tmpDir);
        const platforms = [];
        if (opts.mac)
            platforms.push("osx" + (opts.x86 ? "32" : ""));
        if (opts.linux)
            platforms.push("linux" + (opts.x86 ? "32" : ""));
        if (opts.win)
            platforms.push("win" + (opts.x86 ? "32" : ""));
        var nw = new NwBuilder({
            buildDir: path_1.default.resolve(projectDir, './dist'),
            files: config.files,
            flavor: 'normal',
            platforms: platforms,
            version: config.buildConfig.version,
            winIco: config.icon,
            useRcedit: true,
            winVersionString: {
                'CompanyName': config.company,
                'FileDescription': config.appName,
                'ProductName': config.appName,
                'LegalCopyright': config.copyright
            }
        });
        nw.on('log', console.log);
        nw.build().then(function () {
            const postDistOutput = child_process_1.default.execSync("npm run nwjs:postdist --if-present", { cwd: projectDir });
            console.log(postDistOutput);
        })
            .catch(function (error) {
            console.error(error);
        });
    });
});
program.parse(process.argv);
