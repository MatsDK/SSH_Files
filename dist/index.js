"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const indexRouter_1 = __importDefault(require("@ssh/common/indexRouter"));
const server = express_1.default();
server.use(cors_1.default());
server.use(body_parser_1.default.json());
server.use("/", indexRouter_1.default);
server.listen(3001, (err) => {
    if (err)
        throw err;
    console.log(`> Ready on http://localhost:${3001}`);
});
