//init must be called once during startup, before any function to nw.Screen can be called
nw.Screen.Init();

const electron = require('electron')
const menu = new electron.Menu()
electron.Menu.setApplicationMenu(menu)
