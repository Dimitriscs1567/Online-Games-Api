import { IBoardModel } from "../models/board";

export enum MessageType {
    Boards,
    BoardState,
    Error,
    Inform,
}

const messageTypeToString = (type: MessageType): string => {
    switch(type){
        case MessageType.Boards: return 'Boards';
        case MessageType.BoardState: return 'BoardState';
        case MessageType.Error: return 'Error';
        case MessageType.Inform: return 'Inform';
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

export interface InformBody{
    message: string,
}

export class Message{
    type: MessageType;
    body: BoardsBody | BoardStateBody | ErrorBody | InformBody;

    constructor(type: MessageType, body: BoardsBody | BoardStateBody | ErrorBody | InformBody){
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