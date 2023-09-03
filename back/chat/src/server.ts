import dotenv from "dotenv";
import express from "express";
import path from "path";
import mustache from "mustache-express";
import cors from "cors";
import passport from "passport";
import homeRoutes from "./routes/homeRoutes";
import { handleError404 } from "./middlewares/errors/handleError404";
import { handleError } from "./middlewares/errors/handleError";
import { Server } from "socket.io";
import { createServer } from "http";

//config dotenv
dotenv.config();

//instance server
const server = express();

//view engine
server.set("view engine", "mustache");
server.set("views", path.join(__dirname, "./views"));
server.engine("mustache", mustache());

//middlewares
server.use(passport.initialize());
server.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
server.use(express.json());

//routes
//post
server.use(express.urlencoded({ extended: true }));

//static or public
server.use(express.static(path.join(__dirname, "../public")));

//standards
server.use("/", homeRoutes);

//errors middlewares
server.use(handleError);
server.use(handleError404);

//listen
const httpServer = createServer(server);
//server.listen(process.env.PORT as string);

//socket
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//user list type
type userListType = {
  username: string;
  id: string;
};

//message type
type messageType = {
  hour: string;
  nickname: string;
  message: string;
  to: string;
  checked: boolean;
  id: string;
};

let userList: userListType[] = [];

io.on("connect", (socket: any) => {
  //login
  socket.on("dataUser", (username: string) => {
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
  socket.on("message", (data: messageType) => {
    if (data) {
      data.checked = true;
        socket.emit('sentMessage', data);
        if (data.to === "Todos") {  
          socket.broadcast.emit('receivedMessage', data);
        } else {
          const userReceive: string = userList[userList.findIndex(obj => obj.username === data.to)].id;
          socket.to(userReceive).emit('receivedMessage',data);
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

httpServer.listen(process.env.PORT as string);
