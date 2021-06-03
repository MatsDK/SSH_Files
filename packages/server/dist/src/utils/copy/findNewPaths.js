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
exports.findValidNewPath = exports.findValidNewRemotePath = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const findValidNewRemotePath = (newPath, type, ssh) => __awaiter(void 0, void 0, void 0, function* () {
    let isValid = false, newExtension = 0;
    if (type === "dir") {
        const remotePathExists = yield checkIfRemotePathExists(newPath, ssh);
        if (remotePathExists.err)
            return { err: true, data: remotePathExists.data, newName: newPath };
        if (!remotePathExists.exists)
            return { changed: false, newName: newPath };
        while (!isValid) {
            const currentPath = newPath + `${newExtension}`, remotePathExists = yield checkIfRemotePathExists(currentPath, ssh);
            if (remotePathExists.err)
                return { err: true, data: remotePathExists.data, newName: newPath };
            if (remotePathExists.exists)
                newExtension++;
            else {
                isValid = true;
                return { changed: true, newName: currentPath };
            }
        }
    }
    else if (type === "file") {
        const remotePathExists = yield checkIfRemotePathExists(newPath, ssh);
        if (remotePathExists.err)
            return { err: true, data: remotePathExists.data, newName: newPath };
        if (!remotePathExists.exists)
            return { changed: false, newName: newPath };
        const ext = path_1.default.extname(newPath), pathWithoutExt = newPath.slice(0, newPath.lastIndexOf(ext));
        while (!isValid) {
            const currentPath = pathWithoutExt + `${newExtension}` + ext, remotePathExists = yield checkIfRemotePathExists(currentPath, ssh);
            if (remotePathExists.err)
                return { err: true, data: remotePathExists.data, newName: newPath };
            if (remotePathExists.exists)
                newExtension++;
            else {
                isValid = true;
                return { changed: true, newName: currentPath };
            }
        }
    }
    return { err: false, newName: newPath };
});
exports.findValidNewRemotePath = findValidNewRemotePath;
const findValidNewPath = (newPath, type) => {
    let isValid = false, newExtension = 0;
    if (!fs_extra_1.default.existsSync(newPath))
        return newPath;
    if (type === "dir") {
        while (!isValid) {
            const currentPath = newPath + `${newExtension}`;
            if (fs_extra_1.default.existsSync(currentPath))
                newExtension++;
            else {
                isValid = true;
                return currentPath;
            }
        }
    }
    else if (type === "file") {
        const ext = path_1.default.extname(newPath), pathWithoutExt = newPath.slice(0, newPath.lastIndexOf(ext));
        while (!isValid) {
            let currentPath = pathWithoutExt + `${newExtension}` + ext;
            if (fs_extra_1.default.existsSync(currentPath))
                newExtension++;
            else {
                isValid = true;
                return currentPath;
            }
        }
    }
    return newPath;
};
exports.findValidNewPath = findValidNewPath;
const checkIfRemotePathExists = (path, ssh) => __awaiter(void 0, void 0, void 0, function* () {
    const existsSshRes = yield ssh
        .getSSHConn()
        .execCommand(`test -f "${path}" && echo "1" || echo "0" &&  test -d "${path}" && echo "1" || echo "0"`, {
        cwd: "/",
    });
    if (existsSshRes.stderr)
        return { exists: false, err: true, data: existsSshRes.stderr };
    return {
        exists: existsSshRes.stdout.split `\n`
            .map((x) => +x)
            .reduce((a, b) => a + b, 0) > 0,
    };
});
