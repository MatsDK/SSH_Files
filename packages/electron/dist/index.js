"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.app.on("ready", () => {
    console.log("App is ready");
    const win = new electron_1.BrowserWindow({
        width: 600,
        height: 400,
    });
    win.loadURL("http://localhost:8000");
});
