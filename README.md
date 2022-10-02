# PEAWXP NW.js
This project name is an acronym to "Port your Electron app to Windows XP using NW.js". This project aims to run an Electron single window app in Windows XP. It was made in a way that you can actually create an Electron application, and then port it to NW.js almost instantly.

## Requirements
Depending of your project, everything may work out of the box, as long as you follow the requirements below:
- You need `rsync` (Linux only), `npm` and `nodejs` installed in your system.

## How do I use your project?
- Clone this repository;
- Open a terminal in the repository folder;
- Clone your Electron project into a folder called `www`;
- Run `npm run dist`.

If your project follows the requirements mentioned in the Requirements section, you should be fine.

## My application needs to build some files before starting
We have support to the `nwjs:predist` script in that case.

## My application needs to perform some actions after building
We have support to the `nwjs:postdist` script in that case.

## How does it work?
The Electron main file is converted into the NW.js main file using webpack, by replacing the Electron modules with compatibility layers that make them use the NW.js commands instead. So you don't need to change anything in your Electron project, unless you need to add a prebuild/postbuild script.

## References
- https://nwjs.readthedocs.io/en/latest/For%20Users/Getting%20Started/
- https://github.com/nwjs-community/nw-builder
- https://nwjs.io/downloads/
- https://docs.nwjs.io/en/latest/References/Window/
