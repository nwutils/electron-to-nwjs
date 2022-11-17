# Common issues
Those are the most common issue you may face while using electron-to-nwjs. Most of the time, we will fix errors automatically, but in the cases mentioned below, we couldn't do it. If you don't see the issue you are having in that list, open a new issue.

# Regarding running electron-to-nwjs

### My application needs to build some files before starting
We have support to the `nwjs:prebuild` script in that case. Add it to your project `scripts` in `package.json`.

### My application needs to perform some actions after publishing
We have support to the `nwjs:postdist` script in that case. Add it to your project `scripts` in `package.json`.

# Bugs while running app

### I want to toggle the menu bar, but the Electron Alt shortcut is not working
NW.js didn't support adding an `Alt` shortcut, so had to change the shortcut to `Alt + M`.

### I'm using the require function in a HTML file, and my JS isn't finding the DOM elements
You must load your JS files using the `<script src="">` tag, with `type="module"` if needed. Using `require` will load the file in a different NW.js context.

### I'm referencing a variable (var) from a different JS file, and my JS isn't finding it
We use webpack to transpile your code into NW.js compatible code. Webpack turns everything it touched into modules, so var's are restricted to their JS files. If you need to access a variable from another JS-file, either require/import that file, or place that variable into the global object.

### My `<webview>` element isn't behaving like it should
We are not able to support webview's properly, and since they are being deprecated anyway, try replacing it with an `<iframe>`.

### My application is crashing right after opening a window
Do you have an iframe in that window? In older NW.js versions, [an uncaught exception inside an iframe could make NW.js crash](https://github.com/nwjs/nw.js/issues/5148). Just add the `sandbox` attribute to that iframe, and the problem will be fixed.

# Not a bug, a need

### Due to a specific need, I need to find out when I'm dealing with Electron and when I'm dealing with NW.js
This is your new best friend. It works in both main and renderer.
```
const isNWJS = typeof nw !== 'undefined';
```

### Due to a specific need, I need to find out with which NW.js version I'm dealing with inside my application code
If you just need a string with the NW.js version, just access the `__nwjs_version` variable. Now, if you need to create a condition involving the NW.js, there is a more efficient method: use `__nwjs_version_(lte|lt|gte|gt)_X_X_X`.

Variables that follow that pattern will be automatically replaced on transpilation time with `true` or `false`. So, as examples, if you use `__nwjs_version_gte_0_20_0`, it will be `false` for 0.14.7, but `true` for 0.20.0 and 0.21.0.
