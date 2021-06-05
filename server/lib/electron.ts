import "../server";
import { app, BrowserWindow } from "electron";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1300,
    titleBarStyle: "hidden",
    height: 800,
  });

  mainWindow.loadURL("http://localhost:3001");
});
