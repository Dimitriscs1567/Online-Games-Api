import WebSocket from 'ws';
import { joinBoardMessage, kickPlayerFromBoardMessage, removePlayerFromBoardMessage, sendAllActiveBoardsMessage, sendBoardMessage } from "../utils/messages";

export const handleClientMessage = async (message: WebSocket.Data, username: string,  socket: WebSocket) => {
    if(message.toString().split(":").length < 2){
        return;
    }
    
    const requestType = message.toString().split(":")[0];

    switch(requestType){
        case 'boards': 
            const gameTitle = message.toString().split(":")[1];
            sendAllActiveBoardsMessage(gameTitle, socket);
            break;

        case 'getBoard': 
            const creator1 = message.toString().split(":")[1];
            let password1;
            if(message.toString().split(":")[2]){
                password1 = message.toString().split(":")[2];
            }

            sendBoardMessage(creator1, socket, username, password1);
            break;

        case 'joinBoard': 
            const creator2 = message.toString().split(":")[1];
            const position2 = +(message.toString().split(":")[2]);
            let password2;
            if(message.toString().split(":")[3]){
                password2 = message.toString().split(":")[3];
            }

            joinBoardMessage(creator2, position2, socket, username, password2);
            break;

        case 'leaveBoard': 
            const creator3 = message.toString().split(":")[1];
            let password3;
            if(message.toString().split(":")[2]){
                password3 = message.toString().split(":")[2];
            }

            removePlayerFromBoardMessage(creator3, socket, username, password3);
            break;

        case 'kickPlayer': 
            const player4 = message.toString().split(":")[1];
            
            kickPlayerFromBoardMessage(player4, socket, username);
            break;

        default: break; 
    }
}