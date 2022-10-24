// nw.Screen.Init() must be called once during startup,
// before any function to nw.Screen can be called
nw.Screen.Init();

// Creating default main menu
const electron = require('electron')
const menu = new electron.Menu()
electron.Menu.setApplicationMenu(menu)
