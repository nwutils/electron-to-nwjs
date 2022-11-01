# electron-to-nwjs
This project aims to build an Electron app as a NW.js app.

## Requirements
Depending of your project, everything should work out of the box, as long as you have `npm` installed. If something goes wrong, check the Common issue down below.

## How does it work?
The Electron main file is converted into the NW.js main file using webpack, by replacing the Electron modules with compatibility layers that make them use the NW.js commands instead. So you don't need to change anything in your Electron project, unless you face any of the issues mentioned in the COMMON_ISSUES.md file.

## How do I use your project?
- Open a terminal in your project root folder;
- Run `npm install electron-to-nwjs --save-dev`;

Done. If your project follows the requirements mentioned in the Requirements section, you should be fine. The available commands are list below:

### electron-to-nwjs start
That command is equivalent to the `electron` CLI. Any flag implemented in the electron CLI is implemented, or will be eventually implemented in the future. So `npx electron-to-nwjs start .` is the equivalent to `npx electron .`.

### electron-to-nwjs build
That command is equivalent to the `electron-builder` CLI. Any flag implemented in the electron-builder CLI is implemented, or will be eventually implemented in the future. So `npx electron-to-nwjs build` is the equivalent to `npx electron-builder build`.

## References
- https://nwjs.readthedocs.io/en/latest/For%20Users/Getting%20Started/
- https://github.com/nwjs-community/nw-builder
- https://nwjs.io/downloads/
- https://docs.nwjs.io/en/latest/References/Window/
- https://www.npmjs.com/package/@happikitsune/nw-builder
