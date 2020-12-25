import { IBoardModel } from "../models/board";

export enum MessageType {
    Boards,
    BoardState,
    Error
}

const messageTypeToString = (type: MessageType): string => {
    switch(type){
        case MessageType.Boards: return 'Boards';
        case MessageType.BoardState: return 'BoardState';
        case MessageType.Error: return 'Error';
    }
}

export interface BoardsBody{
    boards: IBoardModel[],
    gameTitle: string,
}

export interface BoardStateBody{
    board: IBoardModel,
}

export interface ErrorBody{
    error: string,
}

export class Message{
    type: MessageType;
    body: BoardsBody | BoardStateBody | ErrorBody;

    constructor(type: MessageType, body: BoardsBody | BoardStateBody | ErrorBody){
        this.type = type;
        this.body = body;
    }

    toJson(){
        return {
            type: messageTypeToString(this.type),
            body: this.body,
        };
    }
}