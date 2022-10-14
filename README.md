# ElectroNW.js
This project aims to build an Electron app as a NW.js app.

## Requirements
Depending of your project, everything may work out of the box, as long as you follow the requirements below:
- You need `rsync` (Linux only), `npm` and `nodejs` installed in your system;
- You must not replace the `require`s that reference electron-related libs with their contents (in case you use webpack, you can use `externals` to create an exception list including those).

If something goes wrong, check the Common issue down below.

## How do I use your project?
- Clone this repository;
- Open a terminal in the repository folder;
- Clone your Electron project into a folder called `www`;
- Run `npm run start` or `npm run dist` in this project root folder.

If your project follows the requirements mentioned in the Requirements section, you should be fine.

## My application needs to build some files before starting
We have support to the `nwjs:prebuild` script in that case.

## My application needs to perform some actions after publishing
We have support to the `nwjs:postdist` script in that case.

## How does it work?
The Electron main file is converted into the NW.js main file using webpack, by replacing the Electron modules with compatibility layers that make them use the NW.js commands instead. So you don't need to change anything in your Electron project, unless you need to add a prebuild/postbuild script, or if you face any of the issues mentioned below.

## Common issues

### I'm using the require function in a HTML file, and it isn't finding the DOM elements
You must load it using the `<script>` tag. Using `require` will load the file in a different NW.js context.

### I'm receiving a CORS error in an iframe
Add the attribute `nwfaketop` to that iframe.

## References
- https://nwjs.readthedocs.io/en/latest/For%20Users/Getting%20Started/
- https://github.com/nwjs-community/nw-builder
- https://nwjs.io/downloads/
- https://docs.nwjs.io/en/latest/References/Window/
