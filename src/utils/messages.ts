import { getActiveBoardsForGame, getGameById, getGameByTitle } from "./database";
import mongoose from "mongoose";
import { sendMessage } from "../config/socket";
import { Message, MessageType } from "../declarations/message";
import WebSocket from 'ws';

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