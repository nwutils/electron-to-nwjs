# PEAWXP NW.js
This project name is an acronym to "Port your Electron app to Windows XP using NW.js". This project aims to run an Electron single window app in Windows XP. It was made in a way that you can actually create an Electron application, and then port it to NW.js almost instantly.

## Requirements
Depending of your project, everything may work out of the box, as long as you follow the requirements below:
- Your app must have only a single window;
- You must not import `electron`, or any eletron-related lib, like `electron-remote`, inside your renderer process.

## How do I use your project?
- Clone this repository;
- Open a terminal in the repository folder;
- Clone your Electron project into a folder called `www`;
- Run `npm run dist`.

If your project follows the requirements mentioned in the Requirements section, you should be fine.

## References
- https://nwjs.readthedocs.io/en/latest/For%20Users/Getting%20Started/
- https://github.com/nwjs-community/nw-builder
- https://nwjs.io/downloads/
- https://docs.nwjs.io/en/latest/References/Window/
