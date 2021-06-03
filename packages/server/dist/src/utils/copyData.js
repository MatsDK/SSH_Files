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
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyData = void 0;
const copyFromSsh_1 = require("./copy/copyFromSsh");
const copyLocal_1 = require("./copy/copyLocal");
const dree = require("dree");
const options = {
    stat: true,
    normalize: true,
    followLinks: false,
    size: true,
    hash: false,
    depth: 2,
};
const copyData = ({ copyQuery, sshData, connect, sshConn, ssh, currDirPath, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let copyRes, fileTree;
        if (copyQuery.from === "remote") {
            const props = {
                copyQuery,
                sshData,
                connect,
                sshConn,
                ssh,
                currDirPath,
            };
            copyRes = yield copyFromSsh_1.copyFromRemote(props);
        }
        else if (copyQuery.from === "local") {
            const props = {
                copyQuery,
                sshData,
                connect,
                sshConn,
                ssh,
                currDirPath,
            };
            copyRes = yield copyLocal_1.copyLocal(props);
        }
        if (copyRes === null || copyRes === void 0 ? void 0 : copyRes.err)
            return { err: true, data: copyRes.data };
        if (currDirPath.location === "local")
            fileTree = dree.scan(currDirPath.path, options);
        else if (currDirPath.location === "remote") {
            const tree = yield ssh.execCommand(`tree -J -L 2 -f -s ${currDirPath.path} `, {
                cwd: "/",
            });
            fileTree = JSON.parse(tree.stdout);
        }
        return Object.assign(Object.assign({}, copyRes), { data: fileTree });
    }
    catch (err) {
        console.log(err);
        return { err: true, data: err.message };
    }
});
exports.copyData = copyData;
