const electron = require('electron')
electron.app.dispatchEvent(new Event("ready"));

var option = {
    key : "Alt+M",
    active : function() {
        electron.BrowserWindow.getFocusedWindow()._toggleMenubar()
    },
    failed : function(msg) {
        console.log(msg);
    }
};
var shortcut = new nw.Shortcut(option);
nw.App.registerGlobalHotKey(shortcut);
