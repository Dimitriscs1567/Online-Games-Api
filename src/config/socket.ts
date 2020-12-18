import { Server as HttpServer } from "http";
import WebSocket from 'ws';
import { getTokenTranslation } from "../utils/token";

let serverIO: WebSocket.Server;
let userSockets: Array<{ socket: WebSocket, username: string }> = [];

export const socketInit = (server: HttpServer) => {
    serverIO = new WebSocket.Server({ server });

    serverIO.on('connection', (socket, mainMessage) => {
        const username = getAuthorization(mainMessage.url);
        
        if(!username){
            socket.close();
        }
        else{
            const exists = getWebSocketForUser(username);
            if(exists){
                exists.close();
            }
            console.log(username, "open")
            
            socket.on("message", (message) => {
                console.log(username, message);
            });
            socket.on("close", (message) => {
                console.log(username, "close");
                const index = userSockets.findIndex(us => us.username === username);
                userSockets.splice(index, 1);
            });

            if(exists){
                const index = userSockets.findIndex(us => us.username === username);
                userSockets[index] = {
                    socket: socket,
                    username: username,
                }
            }
            else{
                userSockets.push({
                    socket: socket,
                    username: username,
                });
            }
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

    return null;
}

const getAuthorization = (url: string | undefined) => {
    if(url && url.split('token=').length > 1){
        const token = url.split('token=')[1];
        const user = getTokenTranslation(token);

        if(user && !user.isRefresh){
            return user.username
        }
    }

    return null;
}