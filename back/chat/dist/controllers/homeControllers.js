"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.home = exports.ping = void 0;
const path_1 = __importDefault(require("path"));
const ping = (req, res) => {
    res.json({ ping: "pong" });
};
exports.ping = ping;
const home = (req, res) => {
    res.sendFile('index.html', path_1.default.join(__dirname, "./public"));
};
exports.home = home;
