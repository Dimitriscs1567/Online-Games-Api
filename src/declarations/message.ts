import { IBoardModel } from "../models/board";

export enum MessageType {
    Boards,
    BoardState,
}

const messageTypeToString = (type: MessageType): string => {
    switch(type){
        case MessageType.Boards: return 'Boards';
        case MessageType.BoardState: return 'BoardState';
    }
}

export interface BoardsBody{
    boards: IBoardModel[],
}

export interface BoardStateBody{
    state: any,
}

export class Message{
    type: MessageType;
    body: BoardsBody | BoardStateBody;

    constructor(type: MessageType, body: BoardsBody | BoardStateBody){
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