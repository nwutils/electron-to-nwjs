# electron-to-nwjs
This project aims to build an Electron app as a NW.js app.

## Requirements
Depending of your project, everything should work out of the box, as long as you have `npm` installed. If something goes wrong, check the COMMON_ISSUES.md file.

## How do I use your project?
Open a terminal in your project root folder and install that package:
```
npm install electron-to-nwjs --save-dev
```

If you want to run your application with NW.js, use the command below (equivalent to `npx electron .`):
```
npx electron-to-nwjs start .
```

If you want to build your application with NW.js, use the command below (equivalent to `npx electron-builder build`):
```
npx electron-to-nwjs build
```

## Flags
We have some extra options available for the commands mentioned above. Those are:

### electron-to-nwjs start .
- `--nwjs-version <version>`: Pick a specific NW.js version, instead of using the latest version compatible with your current system.
- `--ignore-unimplemented-features`: Ignore features that were not implemented by electron-to-nwjs (produced a warning instead of an exception).

### electron-to-nwjs build
- `--projectDir, --project <dir>`: The path to project directory. Defaults to current working directory.
- `-m, --mac, --macos`: Build for macOS.
- `-l, --linux`: 'Build for Linux.
- `-w, --win, --windows`: 'Build for Windows.
- `--nwjs-version <version>`: Pick a specific NW.js version, instead of using the latest version compatible with your current system.
- `--x86`: Build for x86 processors.
- `--ignore-unimplemented-features`: Ignore features that were not implemented by electron-to-nwjs (produced a warning instead of an exception).

## Config file
In case you want to save time, not including the same flags everytime you use `electron-to-nwjs`, you can place a config file inside your project folder, and `electron-to-nwjs` will load it. The file must be named `electron-to-nwjs.config.js`, and it must return an object with the following properties (all of which are optional):
- **target**: Target for the build command.
- - **architecture**: "x86"|"x64". Target architecture.
- - **linux**: true|false. Build for Linux.
- - **mac**: true|false. Build for macOS.
- - **win**: true|false. Build for Windows.
- **nwjs**: Configurations related with NW.js.
- - **chromium-args**: Equivalent to NW.js's `chromium-args` property in package.json.
- - **node-remote**: Equivalent to NW.js's `node-remote` property in package.json.
- - **ignoreUnimplementedFeatures**: true|false. Same as the `--ignore-unimplemented-features` flag.
- - **version**: Same as the `--nwjs-version <version>` flag.
- - **build**: Configurations related with NW.js, but only for the build command.
- - - **version**: Same as the `--nwjs-version <version>` flag, but is only applied for the build command.
- **webpack**: Configurations related with the webpack transpilation.
- - **entry**: Array of paths to the JS files that need to be transpiled relative to your project folder. Defaults to every JS file in your project folder which is loaded by an HTML file using a `<script>` element.
- - **externals**: Equivalent to webpack's `externals` property.

## How does it work?
The Electron main file is converted into the NW.js main file using webpack, by replacing the Electron modules with compatibility layers that make them use the NW.js commands instead. The same is done with the other JS files inside the project folder. So you don't need to change anything in your Electron project, unless you face any of the issues mentioned in the COMMON_ISSUES.md file.

## References
- https://nwjs.readthedocs.io/en/latest/For%20Users/Getting%20Started/
- https://github.com/nwjs-community/nw-builder
- https://nwjs.io/downloads/
- https://docs.nwjs.io/en/latest/References/Window/
- https://www.npmjs.com/package/@happikitsune/nw-builder
