import { app, BrowserWindow } from "electron";
import "../server";

let mainWindow: null | BrowserWindow;
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    minWidth: 300,
    minHeight: 500,

    // frame: false,
  });

  mainWindow.loadURL("http://localhost:3001");
});
