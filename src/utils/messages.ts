import { getActiveBoardsForGame, getGameById, getGameByTitle, getUserBoard } from "./database";
import mongoose from "mongoose";
import { sendMessage } from "../config/socket";
import { Message, MessageType } from "../declarations/message";
import WebSocket from 'ws';
import bcrypt from "bcrypt";

export const broadcastAllActiveBoardsMessage = async (gameId: mongoose.Types.ObjectId) => {
    const game = await getGameById(gameId);
    if(game){
        sendMessage(new Message(MessageType.Boards, { 
            boards: await getActiveBoardsForGame(game.title) ?? [],
            gameTitle: game.title,
        }));
    }
}

export const sendAllActiveBoardsMessage = async (gameTitle: string, socket: WebSocket) => {
    const game = await getGameByTitle(gameTitle);
    if(game){
        sendMessage(new Message(MessageType.Boards, { 
            boards: await getActiveBoardsForGame(game.title) ?? [],
            gameTitle: game.title,
        }), socket);
    }
}

export const sendBoardMessage = async (creator: string, socket: WebSocket, username: string, password?: string) => {
    const board = await getUserBoard(creator);
    
    if(board){
        if(board.password && username !== creator){
            if(!password || !(await bcrypt.compare(password, board.password))){
                return sendMessage(new Message(MessageType.Error, { 
                    error: "Wrong password.",
                }), socket);
            }
        }

        if(board.started && username !== creator && !board.otherPlayers.includes(username)){
            return sendMessage(new Message(MessageType.Error, { 
                error: "You do not have access to that board.",
            }), socket);
        }

        return sendMessage(new Message(MessageType.BoardState, { 
            board: board,
        }), socket);
    }

    return sendMessage(new Message(MessageType.Error, { 
        error: "Board does not exist.",
    }), socket);
}