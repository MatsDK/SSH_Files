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
exports.copyLocal = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const findNewPaths_1 = require("./findNewPaths");
const copyLocal = ({ copyQuery, sshData, connect, sshConn, ssh, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (copyQuery.to === "remote") {
            yield connect(sshData.host, sshData.username, sshData.password);
            if (!sshConn.connection)
                return { err: true, data: "failed to connect" };
            for (let dataItem of copyQuery.paths) {
                let dataPathName = `${dataItem.to}/${dataItem.from.split("/")[dataItem.from.split("/").length - 1]}`;
                const newNameObj = yield findNewPaths_1.findValidNewRemotePath(dataPathName, dataItem.fromType === "directory" ? "dir" : "file", ssh);
                if (newNameObj.err)
                    return { err: true, data: newNameObj.data };
                dataPathName = newNameObj.newName;
                if (dataItem.fromType === "directory") {
                    const sshRes = yield ssh
                        .getSSHConn()
                        .putDirectory(dataItem.from, dataPathName, {
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
                else {
                    const sshRes = yield ssh
                        .getSSHConn()
                        .putFile(dataItem.from, dataPathName);
                    if (sshRes === null || sshRes === void 0 ? void 0 : sshRes.error)
                        return { err: true, data: sshRes === null || sshRes === void 0 ? void 0 : sshRes.data };
                }
            }
            return { err: false };
        }
        else if (copyQuery.to === "local") {
            for (let dataItem of copyQuery.paths) {
                let dataPathName = `${dataItem.to}/${dataItem.from.split("/")[dataItem.from.split("/").length - 1]}`;
                dataPathName = findNewPaths_1.findValidNewPath(dataPathName, dataItem.fromType === "directory" ? "dir" : "file");
                fs_extra_1.default.copySync(dataItem.from, dataPathName, {
                    overwrite: false,
                });
            }
            return { err: false };
        }
    }
    catch (err) {
        return { err: true, data: err.message };
    }
});
exports.copyLocal = copyLocal;
