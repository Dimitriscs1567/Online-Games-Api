import { 
    addBoardPlayer, 
    getActiveBoardsForGame, 
    getGameById, 
    getGameByTitle, 
    getCreatorBoard, 
    removeBoardPlayer ,
    getUserBoard,
    changeBoardPlayerReady,
} from "./database";
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
    const board = await getCreatorBoard(creator);
    
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

export const joinBoardMessage = async (creator: string, position: number, socket: WebSocket, username: string, password?: string) => {
    const board = await getCreatorBoard(creator);
    
    if(board){
        if(board.password && username !== creator){
            if(!password || !(await bcrypt.compare(password, board.password))){
                return sendMessage(new Message(MessageType.Error, { 
                    error: "Wrong password.",
                }), socket);
            }
        }

        if(board.started){
            return sendMessage(new Message(MessageType.Error, { 
                error: "You can not join a game that is started.",
            }), socket);
        }

        if(position < 0){
            return sendMessage(new Message(MessageType.Error, { 
                error: "Invalid position.",
            }), socket);
        }

        const participatedBoard = await getUserBoard(username);
        if(participatedBoard){
            await removeBoardPlayer(creator, username);
        }

        const newBoard = await addBoardPlayer(creator, username, position);
        if(!newBoard){
            return sendMessage(new Message(MessageType.Error, { 
                error: "Invalid position.",
            }), socket);
        }

        return sendMessage(new Message(MessageType.BoardState, { 
            board: newBoard,
        }), [newBoard.creator, ...newBoard.otherPlayers]);
    }

    return sendMessage(new Message(MessageType.Error, { 
        error: "Board does not exist.",
    }), socket);
}

export const removePlayerFromBoardMessage = async (creator: string, socket: WebSocket, username: string) => {
    const board = await getCreatorBoard(creator);
    
    if(board){
        if(creator === username){
            return sendMessage(new Message(MessageType.Error, { 
                error: "The creator cannot leave the game.",
            }), socket);
        }

        if(!board.otherPlayers.includes(username)){
            return sendMessage(new Message(MessageType.Error, { 
                error: "The player has not joined yet.",
            }), socket);
        }

        const newBoard = await removeBoardPlayer(creator, username);
        if(!newBoard){
            return sendMessage(new Message(MessageType.Error, { 
                error: "Invalid player.",
            }), socket);
        }

        return sendMessage(new Message(MessageType.BoardState, { 
            board: newBoard,
        }), [newBoard.creator, ...newBoard.otherPlayers, username]);
    }

    return sendMessage(new Message(MessageType.Error, { 
        error: "Board does not exist.",
    }), socket);
}

export const kickPlayerFromBoardMessage = async (playerToKick: string, socket: WebSocket, username: string) => {
    const board = await getCreatorBoard(username);
    
    if(board){
        if(playerToKick === username){
            return sendMessage(new Message(MessageType.Error, { 
                error: "The creator cannot be kicked.",
            }), socket);
        }

        if(!board.otherPlayers.includes(playerToKick)){
            return sendMessage(new Message(MessageType.Error, { 
                error: "The player has not joined yet.",
            }), socket);
        }

        const newBoard = await removeBoardPlayer(username, playerToKick);
        if(!newBoard){
            return sendMessage(new Message(MessageType.Error, { 
                error: "Invalid player.",
            }), socket);
        }

        sendMessage(new Message(MessageType.Inform, { 
            message: "You have been kicked from the game.",
        }), [playerToKick]);

        return sendMessage(new Message(MessageType.BoardState, { 
            board: newBoard,
        }), [newBoard.creator, ...newBoard.otherPlayers, playerToKick]);
    }

    return sendMessage(new Message(MessageType.Error, { 
        error: "Board does not exist.",
    }), socket);
}

export const changePlayerReady = async (creator: string, socket: WebSocket, username: string) => {
    const board = await getCreatorBoard(creator);

    if(board){
        const newBoard = await changeBoardPlayerReady(creator, username);
        if(!newBoard){
            return sendMessage(new Message(MessageType.Error, { 
                error: "Invalid player.",
            }), socket);
        }

        return sendMessage(new Message(MessageType.BoardState, { 
            board: newBoard,
        }), [newBoard.creator, ...newBoard.otherPlayers]);
    }
    else{
        return sendMessage(new Message(MessageType.Error, { 
            error: "Board does not exist.",
        }), socket);
    }
}