#!/usr/bin/env node

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const commander_1 = require("commander");
const plist_1 = __importDefault(require("plist"));
const HtmlTranspiler = require('./scripts/transpile-html');
const JsTranspiler = require('./scripts/transpile-js');
const Versions = require('./scripts/utils/versions');
const buildDir = "nwjs_build";
const distDir = "nwjs_dist";
const getCurrentOs = function () {
    let platform = os_1.default.platform();
    if (platform === 'darwin') {
        return "mac";
    }
    if (platform === 'linux') {
        return 'linux';
    }
    return 'win';
};
const currentSystemRecommendedNwjsVersion = function () {
    // Reference:
    // https://dev.to/thejaredwilcurt/guide-to-nw-js-versions-5d38#osx-support
    let platform = getCurrentOs();
    if (platform === "mac") {
        let osVersion = child_process_1.default.execSync("sw_vers -productVersion", { encoding: 'utf-8' }).toString().trim();
        if (!Versions.isVersionEqualOrSuperiorThanVersion(osVersion + ".0", "10.9.0")) {
            // NW.js v0.14.7 and below works with 10.6+
            // NW.js v0.15.0 works with 10.9+
            return "0.14.7";
        }
        if (!Versions.isVersionEqualOrSuperiorThanVersion(osVersion + ".0", "10.10.0")) {
            // NW.js v0.29.0 works with 10.10+
            return "0.28.3";
        }
        if (!Versions.isVersionEqualOrSuperiorThanVersion(osVersion + ".0", "10.11.0")) {
            // NW.js v0.51.0 works with 10.11+
            return "0.50.3";
        }
        if (!Versions.isVersionEqualOrSuperiorThanVersion(osVersion + ".0", "10.15.0")) {
            // NW.js v0.64.1 works with 10.15 and no longer accurately updates the plist file
            return "0.64.0";
        }
    }
    return "0.69.1";
};
const onTmpFolder = async function (dest, callback) {
    const appPrefix = 'electron-to-nwjs';
    let tmpDir = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), appPrefix));
    console.log(`Temporary folder: ${tmpDir}`);
    try {
        await callback(tmpDir);
    }
    finally {
        if (fs_1.default.existsSync(dest)) {
            fs_1.default.rmdirSync(dest, { recursive: true });
        }
        fs_extra_1.default.moveSync(tmpDir, dest);
    }
};
const runPrebuildAndCreateNwjsProject = function (opts, callback) {
    child_process_1.default.execSync("npm run nwjs:prebuild --if-present", { cwd: opts.projectDir, stdio: 'inherit', encoding: 'utf-8' });
    onTmpFolder(path_1.default.join(opts.projectDir, buildDir), async function (tmpDir) {
        fs_extra_1.default.copySync(opts.projectDir, tmpDir);
        // So the cache and dist folders won't be copied, since they are not only not
        // needed, but they also can be become very big
        let ignorableFolder = [
            { original: path_1.default.resolve(opts.projectDir, 'cache'), temp: path_1.default.resolve(tmpDir, 'cache') },
            { original: path_1.default.resolve(opts.projectDir, buildDir), temp: path_1.default.resolve(tmpDir, buildDir) },
            { original: path_1.default.resolve(opts.projectDir, distDir), temp: path_1.default.resolve(tmpDir, distDir) }
        ];
        ignorableFolder.forEach(folder => {
            if (!fs_1.default.existsSync(folder.original)) {
                fs_1.default.mkdirSync(folder.original);
            }
            if (fs_1.default.existsSync(folder.temp)) {
                fs_extra_1.default.rmdirSync(folder.temp, { recursive: true });
            }
            fs_1.default.symlinkSync(folder.original, folder.temp);
        });
        const projectPackagePath = path_1.default.resolve(tmpDir, 'package.json');
        let projectPackageStr = fs_1.default.readFileSync(projectPackagePath, { encoding: 'utf-8' });
        const projectPackageJson = JSON.parse(projectPackageStr);
        const packagesListKeys = ["dependencies", "devDependencies", "peerDependencies",
            "peerDependenciesMeta", "optionalDependencies", "overrides"];
        packagesListKeys.forEach(key => {
            let dependencies = opts.opts[key] || {};
            Object.keys(dependencies).forEach(depName => projectPackageJson[key][depName] = dependencies[depName]);
        });
        projectPackageStr = JSON.stringify(projectPackageJson, null, 2);
        fs_1.default.writeFileSync(projectPackagePath, projectPackageStr, { encoding: 'utf-8' });
        child_process_1.default.execSync("npm install", { cwd: tmpDir, stdio: 'inherit', encoding: 'utf-8' });
        // So the electron node_module won't be compressed in the end, no matter what
        // That solves a building issue in Mac OS X 10.13 and lower
        const electronModuleFolder = path_1.default.resolve(tmpDir, 'node_modules', 'electron');
        if (fs_1.default.existsSync(electronModuleFolder)) {
            fs_extra_1.default.rmdirSync(electronModuleFolder, { recursive: true });
        }
        await JsTranspiler({
            srcFolder: opts.projectDir,
            dstFolder: tmpDir,
            prod: opts.prod,
            opts: opts.opts,
            main: opts.mainFilename
        });
        await HtmlTranspiler({
            folder: tmpDir
        });
        callback(tmpDir);
    })
        .catch(e => console.error(e));
};
const loadPackageJsonFromFolder = function (folder) {
    const projectPackagePath = path_1.default.resolve(folder, 'package.json');
    let projectPackageStr = fs_1.default.readFileSync(projectPackagePath, { encoding: 'utf-8' });
    return JSON.parse(projectPackageStr);
};
const listNodeModulesThatShouldntBeKept = function (projectDir) {
    let nodeModulesFolder = path_1.default.resolve(projectDir, 'node_modules');
    let neededDependencies = [];
    const getAllDependenciesFromModule = function (module) {
        let moduleFolder = path_1.default.resolve(nodeModulesFolder, module);
        if (!fs_1.default.existsSync(moduleFolder)) {
            return;
        }
        let moduleJson = loadPackageJsonFromFolder(moduleFolder);
        Object.keys(moduleJson.dependencies || {}).forEach(dep => {
            if (!neededDependencies.includes(dep)) {
                neededDependencies.push(dep);
                getAllDependenciesFromModule(dep);
            }
        });
    };
    let packageJson = loadPackageJsonFromFolder(projectDir);
    Object.keys(packageJson.dependencies || {}).forEach(dep => {
        neededDependencies.push(dep);
        getAllDependenciesFromModule(dep);
    });
    neededDependencies = neededDependencies.filter((v, i, a) => a.indexOf(v) === i);
    //console.log(`Needed dependencies:\n${neededDependencies.map(d => `- ${d}`).join('\n')}\n\n`)
    let allDependencies = fs_1.default.readdirSync(nodeModulesFolder);
    let removableDependencies = allDependencies.filter((v, i) => neededDependencies.indexOf(v) === -1);
    return removableDependencies;
};
const getElectronToNwjsProjectConfig = function (projectPath, isBuild, flagOpts) {
    let config = {};
    const electronToNwjsConfigJsPath = path_1.default.join(projectPath, "electron-to-nwjs.config.js");
    if (fs_1.default.existsSync(electronToNwjsConfigJsPath)) {
        config = require(electronToNwjsConfigJsPath);
        if (typeof config === 'function') {
            config = config();
        }
    }
    config.target = config.target || {};
    config.target.architecture = flagOpts.x86 ? "x64" : (config.target.architecture || "x64");
    let osList = ["mac", "linux", "win"];
    let flagOsList = osList.filter(os => flagOpts[os]);
    if (flagOsList.length > 0) {
        osList.forEach(os => delete config.target[os]);
        flagOsList.forEach(os => config.target[os] = true);
    }
    config.nwjs = config.nwjs || {};
    config.nwjs.version = flagOpts.nwjsVersion || (isBuild ? config.nwjs.build?.version : undefined) || config.nwjs.version;
    config.nwjs.ignoreUnimplementedFeatures = config.nwjs.ignoreUnimplementedFeatures || flagOpts.ignoreUnimplementedFeatures;
    let projectPackageJson = loadPackageJsonFromFolder(projectPath);
    let electronPackageJson = loadPackageJsonFromFolder(path_1.default.join(projectPath, "node_modules", "electron"));
    let electronVersion = (projectPackageJson.build || {}).electronVersion || electronPackageJson.version || "19.1.4";
    config.electronVersion = electronVersion;
    return config;
};
const buildNwjsBuilderConfig = function (projectPath, opts, os) {
    const projectPackagePath = path_1.default.resolve(projectPath, 'package.json');
    let projectPackageStr = fs_1.default.readFileSync(projectPackagePath, { encoding: 'utf-8' });
    const projectPackageJson = JSON.parse(projectPackageStr);
    const disableNw2 = Versions.doesVersionMatchesConditions(opts.nwjs.version, ">=0.42.4 <=0.43.0");
    let nwjs = {};
    const electronToNwjsConfigJsPath = path_1.default.join(projectPath, "electron-to-nwjs.config.js");
    if (fs_1.default.existsSync(electronToNwjsConfigJsPath)) {
        nwjs = require(electronToNwjsConfigJsPath);
        if (typeof nwjs === 'function') {
            nwjs = nwjs();
        }
    }
    let flags = [
        "--enable-logging=stderr",
        disableNw2 ? "--disable-features=nw2" : "",
        nwjs["chromium-args"] || ""
    ];
    projectPackageJson["chromium-args"] = flags.join(" ");
    projectPackageJson["node-remote"] = nwjs["node-remote"];
    let build = (projectPackageJson.build || {});
    projectPackageJson["build"] = build;
    projectPackageJson["build"]["electronVersion"] = opts.electronVersion;
    let appName = (build[os] || {}).productName || build.productName || projectPackageJson.name || "Unknown";
    projectPackageJson["product_string"] = appName;
    projectPackageJson["build"]["mac"] = projectPackageJson["build"]["mac"] || {};
    projectPackageJson["build"]["mac"]["extendInfo"] = projectPackageJson["build"]["mac"]["extendInfo"] || {};
    let plistExtras = projectPackageJson["build"]["mac"]["extendInfo"];
    plistExtras["CFBundleDisplayName"] = plistExtras["CFBundleDisplayName"] || appName;
    let iconPath = path_1.default.join("build", (build[os] || {}).icon || ({ mac: "icon.icns", linux: "icon.icns", win: "icon.ico" }[os]));
    console.log("");
    console.log(`chromium-args: ${projectPackageJson["chromium-args"]}`);
    console.log(`node-remote: ${projectPackageJson["node-remote"] || ""}`);
    console.log("");
    projectPackageStr = JSON.stringify(projectPackageJson, null, 2);
    fs_1.default.writeFileSync(projectPackagePath, projectPackageStr, { encoding: 'utf-8' });
    let authorName = (projectPackageJson.author || {}).name || "Unknown";
    let nwjsConfig = {
        appName: appName,
        appVersion: projectPackageJson.version,
        company: authorName,
        copyright: (build[os] || {}).copyright || build.copyright || `Copyright © ${new Date().getFullYear()} ${authorName}. All rights reserved`,
        files: (build[os] || {}).files || build.files || ["**/**"],
        icon: iconPath
    };
    nwjsConfig.icon = path_1.default.join(projectPath, nwjsConfig.icon);
    if (!fs_1.default.existsSync(nwjsConfig.icon)) {
        nwjsConfig.icon = path_1.default.join(projectPath, "build", "icon.png");
    }
    if (!nwjsConfig.files.includes("**/**")) {
        nwjsConfig.files.unshift("**/**");
    }
    nwjsConfig.files.push(`!nwjs_build.js`);
    nwjsConfig.files.push(`!nwjs_start.js`);
    nwjsConfig.files.push(`!nwjs_build_config.json`);
    nwjsConfig.files.push(`!nwjs_start_config.json`);
    nwjsConfig.files.push(`!${buildDir}/*`);
    nwjsConfig.files.push(`!${distDir}/*`);
    let removableDependencies = listNodeModulesThatShouldntBeKept(projectPath);
    removableDependencies.forEach(dep => {
        nwjsConfig.files.push(`!node_modules/${dep}/**`);
    });
    nwjsConfig.files = nwjsConfig.files.map((file) => {
        if (file.endsWith("/*"))
            file = file + "*/**";
        const ignorable = file.startsWith("!");
        if (ignorable)
            file = file.substring(1);
        return (ignorable ? "!" : "") + "./" + file;
    });
    if (os === "mac") {
        const entitlementsFilename = build[os].entitlements;
        if (entitlementsFilename) {
            const entitlementsPath = path_1.default.join(projectPath, entitlementsFilename);
            const entitlementsStr = fs_1.default.readFileSync(entitlementsPath, { encoding: 'utf-8' });
            const entitlements = plist_1.default.parse(entitlementsStr);
            nwjsConfig.macPlist = entitlements;
        }
    }
    return nwjsConfig;
};
const showWarningForVersionIfNeeded = function (version) {
    if (Versions.doesVersionMatchesConditions(version, "<0.14.7")) {
        console.warn("WARNING!!! electron-to-nwjs officially only supports NW.js 0.14.7 and superior versions!");
    }
    if (["0.42.4", "0.42.5", "0.42.6"].includes(version)) {
        console.warn("WARNING!!! That NW.js version is known not to work properly!");
    }
    if (Versions.doesVersionMatchesConditions(version, "<0.25.4")) {
        console.warn("WARNING! NW.js 0.25.3 and below are not compatible with Node-API!");
    }
};
const program = new commander_1.Command();
program
    .command('start <dir>')
    .description('start an Electron project with NW.js')
    .option('-v, --nwjs-version <version>', 'NW.js version', currentSystemRecommendedNwjsVersion())
    .option('--ignore-unimplemented-features', 'Ignore features that were not implemented by electron-to-nwjs (produced a warning instead of an exception)', false)
    .action(function (dir) {
    const opts = this.opts();
    let mainFilename = undefined;
    let projectDir = path_1.default.resolve('.', dir);
    if (projectDir.endsWith(".js")) {
        mainFilename = path_1.default.basename(projectDir);
        projectDir = path_1.default.dirname(projectDir);
    }
    const nwjsConfig = getElectronToNwjsProjectConfig(projectDir, false, opts);
    showWarningForVersionIfNeeded(nwjsConfig.nwjs.version);
    runPrebuildAndCreateNwjsProject({ projectDir, mainFilename, prod: false, opts: nwjsConfig }, (tmpDir) => {
        const config = buildNwjsBuilderConfig(tmpDir, nwjsConfig, getCurrentOs());
        const configStr = JSON.stringify({
            srcDir: config.files.join(" "),
            mode: "run",
            version: nwjsConfig.nwjs.version,
            app: {
                name: config.appName,
                icon: config.icon
            }
        }, null, 2);
        const configPath = path_1.default.join(tmpDir, "nwjs_start_config.json");
        const scriptPath = path_1.default.join(tmpDir, "nwjs_start.js");
        fs_1.default.writeFileSync(configPath, configStr, { encoding: 'utf8' });
        fs_1.default.copyFileSync(path_1.default.join(__dirname, "nwjs_start.js"), scriptPath);
        child_process_1.default.execSync(`node ./nwjs_start.js`, { cwd: tmpDir, stdio: 'inherit' });
    });
});
program
    .command('build')
    .description('build an Electron project with NW.js')
    .option('--projectDir, --project <dir>', 'The path to project directory. Defaults to current working directory.', '.')
    .option('-m, --mac, --macos', 'Build for macOS')
    .option('-l, --linux', 'Build for Linux')
    .option('-w, --win, --windows', 'Build for Windows')
    .option('--nwjs-version <version>', 'NW.js version', currentSystemRecommendedNwjsVersion())
    .option('--x86', 'Build for x86')
    .option('--ignore-unimplemented-features', 'Ignore features that were not implemented by electron-to-nwjs (produced a warning instead of an exception)', false)
    .action(function () {
    const opts = this.opts();
    const projectDir = path_1.default.resolve('.', opts.project);
    const nwjsConfig = getElectronToNwjsProjectConfig(projectDir, true, opts);
    showWarningForVersionIfNeeded(nwjsConfig.nwjs.version);
    runPrebuildAndCreateNwjsProject({ projectDir, prod: true, opts: nwjsConfig }, (tmpDir) => {
        const platforms = ["mac", "linux", "win"].filter(s => nwjsConfig.target[s]);
        if (platforms.length === 0) {
            platforms.push(getCurrentOs());
        }
        for (const platform of platforms) {
            const config = buildNwjsBuilderConfig(tmpDir, nwjsConfig, platform);
            let nwjsPlatform = platform;
            if (nwjsPlatform === "mac") {
                nwjsPlatform = "osx";
            }
            const configStr = JSON.stringify({
                srcDir: config.files.join(" "),
                mode: "build",
                version: nwjsConfig.nwjs.version,
                flavor: 'normal',
                platform: nwjsPlatform,
                arch: nwjsConfig.target.architecture,
                outDir: path_1.default.resolve(projectDir, path_1.default.join('.', distDir)),
                app: {
                    name: config.appName,
                    icon: config.icon,
                    company: config.company,
                    fileDescription: config.appName,
                    productName: config.appName,
                    legalCopyright: config.copyright
                },
                macPlist: config.macPlist,
                useRcedit: true
            }, null, 2);
            const configPath = path_1.default.join(tmpDir, "nwjs_build_config.json");
            const scriptPath = path_1.default.join(tmpDir, "nwjs_build.js");
            fs_1.default.writeFileSync(configPath, configStr, { encoding: 'utf8' });
            fs_1.default.copyFileSync(path_1.default.join(__dirname, "nwjs_build.js"), scriptPath);
            child_process_1.default.execSync(`node ./nwjs_build.js`, { cwd: tmpDir, stdio: 'inherit' });
        }
        child_process_1.default.execSync("npm run nwjs:postdist --if-present", { cwd: projectDir, stdio: 'inherit', encoding: 'utf-8' });
    });
});
program.parse(process.argv);
