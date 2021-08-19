const electron = require("electron");
const { BrowserWindow, app } = electron;

let mainWindow;
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    minWidth: 300,
    minHeight: 500,
  });

  mainWindow.loadURL("http://localhost:3001");
});
