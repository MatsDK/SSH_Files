"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFromRemote = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const findNewPaths_1 = require("./findNewPaths");
const copyFromRemote = ({ copyQuery, sshData, connect, sshConn, ssh, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (copyQuery.to === "local") {
        yield connect(sshData.host, sshData.username, sshData.password);
        if (!sshConn.connection)
            return { err: true, data: "failed to connect" };
        for (let dataItem of copyQuery.paths) {
            if (dataItem.fromType === "directory") {
                let dataPathName = dataItem.to + "/" + dataItem.from.split("/").pop();
                dataPathName = findNewPaths_1.findValidNewPath(dataPathName, "dir");
                fs_extra_1.default.mkdirSync(dataPathName);
                const sshRes = yield ssh
                    .getSSHConn()
                    .getDirectory(dataPathName, dataItem.from, {
                    recursive: true,
                    concurrency: 20,
                    validate: (itemPath) => {
                        const baseName = path_1.default.basename(itemPath);
                        return (baseName.substr(0, 1) !== "." && baseName !== "node_modules");
                    },
                    tick: (localPath, remotePath, error) => {
                        if (error)
                            return { err: true, data: error.message };
                    },
                });
                if (sshRes.error)
                    return { err: true, data: sshRes.data };
            }
            else if (dataItem.fromType === "file") {
                let dataPathName = dataItem.to + "/" + dataItem.from.split("/").pop();
                dataPathName = findNewPaths_1.findValidNewPath(dataPathName, "file");
                const sshRes = yield ssh
                    .getSSHConn()
                    .getFile(dataPathName, dataItem.from);
                if (sshRes === null || sshRes === void 0 ? void 0 : sshRes.err)
                    return { err: sshRes.err };
            }
        }
        return { err: false };
    }
    else if (copyQuery.to === "remote") {
        yield connect(sshData.host, sshData.username, sshData.password);
        if (!sshConn.connection)
            return { err: true, data: "failed to connect" };
        for (let dataItem of copyQuery.paths) {
            if (dataItem.fromType === "directory") {
                let dataItemName = dataItem.to + "/" + dataItem.from.split("/").pop();
                let copyCommand = `cp -a ${dataItem.from} ${dataItem.to}`;
                const newNameObj = yield findNewPaths_1.findValidNewRemotePath(dataItemName, "dir", ssh);
                if (newNameObj.err)
                    return { err: true, data: newNameObj.data };
                else if (newNameObj.changed) {
                    dataItemName = newNameObj.newName;
                    copyCommand = `cp -a ${dataItem.from}/* ${newNameObj.newName}`;
                    const sshMkdirSshRes = yield ssh
                        .getSSHConn()
                        .execCommand(`mkdir ${newNameObj.newName}`, {
                        cwd: "/",
                    });
                    if (sshMkdirSshRes.stderr)
                        return { err: true, data: sshMkdirSshRes.stderr };
                }
                const copySshRes = yield ssh.getSSHConn().execCommand(copyCommand, {
                    cwd: "/",
                });
                if (copySshRes.stderr)
                    return { err: true, data: copySshRes.stderr };
            }
            else if (dataItem.fromType === "file") {
                let newDataPathName = dataItem.to + "/" + dataItem.from.split("/").pop();
                let copyCommand = `cp -a ${dataItem.from} ${dataItem.to}`;
                const newNameObj = yield findNewPaths_1.findValidNewRemotePath(newDataPathName, "file", ssh);
                if (newNameObj.err)
                    return { err: true, data: newNameObj.data };
                else if (newNameObj.changed) {
                    newDataPathName = newNameObj.newName;
                    copyCommand = `cp ${dataItem.from} ${newNameObj.newName}`;
                }
                const copySshRes = yield ssh
                    .getSSHConn()
                    .execCommand(copyCommand, { cwd: "/" });
                if (copySshRes.stderr)
                    return { err: true, data: copySshRes.stderr };
            }
        }
        return { err: false };
    }
});
exports.copyFromRemote = copyFromRemote;
