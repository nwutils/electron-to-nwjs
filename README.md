# electron-to-nwjs
This project aims to build an Electron app as a NW.js app.

## Requirements
Depending of your project, everything should work out of the box, as long as you have `npm` installed. If something goes wrong, check the Common issue down below.

## How do I use your project?
- Open a terminal in your project root folder;
- Run `npm install electron-to-nwjs --save-dev`;
- Run `npx electron-to-nwjs start .` or `npx electron-to-nwjs build` in this project root folder.

If your project follows the requirements mentioned in the Requirements section, you should be fine.

## How does it work?
The Electron main file is converted into the NW.js main file using webpack, by replacing the Electron modules with compatibility layers that make them use the NW.js commands instead. So you don't need to change anything in your Electron project, unlessyou face any of the issues mentioned below.

## Common issues

### I want to toggle the menu bar, but the Electron Alt shortcut is not working
NW.js didn't support adding an `Alt` shortcut, so had to change the shortcut to `Alt + D`.

### I'm using the require function in a HTML file, and it isn't finding the DOM elements
You must load it using the `<script src="">` tag. Using `require` will load the file in a different NW.js context.

### I'm receiving a CORS error in an iframe
Add the attribute `nwfaketop` to that iframe.

### Due to a specific need, I need to find out when I'm dealing with Electron and when I'm dealing with NW.js
This is your new best friend. It works in both main and renderer.
```
const isNWJS = typeof nw !== 'undefined';
```

### My application needs to build some files before starting
We have support to the `nwjs:prebuild` script in that case. Add it to your project `scripts` in `package.json`.

### My application needs to perform some actions after publishing
We have support to the `nwjs:postdist` script in that case. Add it to your project `scripts` in `package.json`.

## References
- https://nwjs.readthedocs.io/en/latest/For%20Users/Getting%20Started/
- https://github.com/nwjs-community/nw-builder
- https://nwjs.io/downloads/
- https://docs.nwjs.io/en/latest/References/Window/
- https://www.npmjs.com/package/@happikitsune/nw-builder
