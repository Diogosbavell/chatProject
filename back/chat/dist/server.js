"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mustache_express_1 = __importDefault(require("mustache-express"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const homeRoutes_1 = __importDefault(require("./routes/homeRoutes"));
const handleError404_1 = require("./middlewares/errors/handleError404");
const handleError_1 = require("./middlewares/errors/handleError");
const socket_io_1 = require("socket.io");
const http_1 = require("http");
//config dotenv
dotenv_1.default.config();
//instance server
const server = (0, express_1.default)();
//view engine
server.set("view engine", "mustache");
server.set("views", path_1.default.join(__dirname, "./views"));
server.engine("mustache", (0, mustache_express_1.default)());
//middlewares
server.use(passport_1.default.initialize());
server.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
server.use(express_1.default.json());
//routes
//post
server.use(express_1.default.urlencoded({ extended: true }));
//static or public
server.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
//standards
server.use("/", homeRoutes_1.default);
//errors middlewares
server.use(handleError_1.handleError);
server.use(handleError404_1.handleError404);
//listen
const httpServer = (0, http_1.createServer)(server);
//server.listen(process.env.PORT as string);
//socket
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
let userList = [];
io.on("connect", (socket) => {
    //login
    socket.on("dataUser", (username) => {
        if (username && socket.id) {
            userList.push({ username: username, id: socket.id });
            socket.emit('listUpdate', userList);
            socket.broadcast.emit('listUpdate', userList);
        }
    });
    //consult users
    socket.on("consultUsers", () => {
        socket.emit("usersLogged", userList);
    });
    //message
    socket.on("message", (data) => {
        if (data) {
            data.checked = true;
            socket.emit('sentMessage', data);
            if (data.to === "Todos") {
                socket.broadcast.emit('receivedMessage', data);
            }
            else {
                const userReceive = userList[userList.findIndex(obj => obj.username === data.to)].id;
                socket.to(userReceive).emit('receivedMessage', data);
            }
        }
    });
    //disconect
    socket.on("disconnect", () => {
        userList = userList.filter((item) => item.id != socket.id);
        socket.emit('listUpdate', userList);
        socket.broadcast.emit('listUpdate', userList);
    });
});
httpServer.listen(process.env.PORT);
