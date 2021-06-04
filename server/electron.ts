import "./server";
import * as electron from "electron";

electron.app.on("ready", () => {
  console.log("App is ready");

  const win = new electron.BrowserWindow({
    width: 600,
    height: 400,
  });

  win.loadURL("http://localhost:3001");
});
