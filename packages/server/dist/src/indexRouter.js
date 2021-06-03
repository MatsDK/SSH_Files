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
const express_1 = __importDefault(require("express"));
const ssh_1 = __importDefault(require("./utils/ssh"));
const copyData_1 = require("./utils/copyData");
const systeminformation_1 = __importDefault(require("systeminformation"));
const dree = require("dree");
const router = express_1.default.Router();
let sshConn = ssh_1.default.sshConn;
const connect = (host, username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (sshConn.connection)
            return ssh_1.default;
        sshConn = yield ssh_1.default.connect(host, username, password);
        if (sshConn.connection)
            return ssh_1.default;
    }
    catch (err) {
        console.log(err);
    }
});
const options = {
    stat: true,
    normalize: true,
    followLinks: false,
    size: true,
    hash: false,
    depth: 2,
};
router.get("/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const disks = yield systeminformation_1.default.blockDevices();
    const fileTree = dree.scan(`${disks[0].name}/`, options);
    res.json({ localData: fileTree, drives: disks });
}));
router.post("/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { location, path, sshData } = req.body;
    let fileTree;
    if (location === "local") {
        fileTree = dree.scan(path, options);
    }
    else if (location === "remote") {
        yield connect(sshData.host, sshData.username, sshData.password);
        if (!sshConn.connection)
            return res.json({ err: true, data: "failed to connect" });
        const sshRes = yield ssh_1.default.execCommand(`tree -J -L 2 -f -s ${path} `, {
            cwd: "/",
        });
        if (sshRes.stderr)
            throw sshRes.stderr;
        fileTree = JSON.parse(sshRes.stdout);
    }
    res.json({ data: fileTree });
}));
router.post("/connectSSH", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { host, password, username } = req.body;
    if (!host || !password || !username)
        return res.json({
            connected: false,
            err: true,
            data: "invalid connection data",
        });
    yield connect(host, username, password);
    if (!sshConn.connection)
        return res.json({
            connected: false,
            err: true,
            data: `can't connect to ${host} as ${username}`,
        });
    const sshRes = yield ssh_1.default.execCommand(`tree -J -L 2 -f -s `, {
        cwd: "/",
    });
    if (sshRes.stderr)
        res.json({ connect: false, err: true, data: sshRes.stderr });
    res.json({ connected: true, err: false, data: sshRes.stdout });
}));
router.post("/copyData", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sshData, copyQuery, currDirPath, } = req.body;
    const props = {
        copyQuery,
        sshData,
        connect,
        sshConn,
        ssh: ssh_1.default,
        currDirPath,
    };
    const copyRes = yield copyData_1.copyData(props);
    if (copyRes.err)
        return res.json({ err: true, data: copyRes.data });
    res.json(copyRes);
}));
exports.default = router;
