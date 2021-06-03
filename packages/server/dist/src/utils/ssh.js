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
const node_ssh_1 = require("node-ssh");
const ssh = new node_ssh_1.NodeSSH();
let sshConn = { connection: false };
const connect = (host, username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const sshClient = yield ssh.connect({
        host,
        username,
        password,
    });
    sshConn = sshClient;
    return { connection: true };
});
const timeout = (cb, interval) => () => new Promise((resolve) => setTimeout(() => cb(resolve), interval));
const onTimeout = timeout((resolve) => resolve({ connection: false }), 3000);
exports.default = {
    connect: (host, username, password) => Promise.race([connect, onTimeout].map((f) => f(host, username, password))).then((res) => {
        return res;
    }),
    getSSHConn: () => {
        return sshConn;
    },
    execCommand: (text, params) => sshConn.execCommand(text, params),
    sshConn,
};
