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

## How does it work?
The Electron main file is converted into the NW.js main file using webpack, by replacing the Electron modules with compatibility layers that make them use the NW.js commands instead. The same is done with the other JS files inside the project folder. So you don't need to change anything in your Electron project, unless you face any of the issues mentioned in the COMMON_ISSUES.md file.

## References
- https://nwjs.readthedocs.io/en/latest/For%20Users/Getting%20Started/
- https://github.com/nwjs-community/nw-builder
- https://nwjs.io/downloads/
- https://docs.nwjs.io/en/latest/References/Window/
- https://www.npmjs.com/package/@happikitsune/nw-builder
