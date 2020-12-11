import { Server as HttpServer } from "http";
import { Server }  from "socket.io";

let serverIO: Server;

export const socketInit = (server: HttpServer) => {
    serverIO = new Server(server);
    return serverIO;
}

export const getSocketServer = () => {
    return serverIO;
}