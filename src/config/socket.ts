import { Server as HttpServer } from "http";
import WebSocket from 'ws';
import { getTokenTranslation } from "../utils/token";

let serverIO: WebSocket.Server;
let userSockets: Array<{ socket: WebSocket, username: string }> = [];

export const socketInit = (server: HttpServer) => {
    serverIO = new WebSocket.Server({ server });

    serverIO.on('connection', (socket, mainMessage) => {
        const auth = getAuthorization(mainMessage.headers.authorization);
        if(!auth){
            socket.send({ error: "Unauthorized connection. It will be terminated." });
            socket.terminate();
        }
        else{
            socket.on("message", (message) => {

            });
            socket.on("close", (message) => {
                const index = userSockets.findIndex(us => us.username === auth);
                userSockets.splice(index, 1);
            });
            userSockets.push({
                socket: socket,
                username: auth,
            });
        }
    });
}

export const getSocketServer = () => {
    return serverIO;
}

export const getWebSocketForUser = (username: string) => {
    const res = userSockets.filter(us => us.username === username);
    if(res.length > 0){
        return res[0].socket;
    }
}

const getAuthorization = (auth: string | undefined) => {
    if(auth && auth.split(' ').length > 1){
        const token = auth.split(' ')[1];
        const user = getTokenTranslation(token);

        if(user && !user.isRefresh){
            return user.username
        }
    }

    return null;
}