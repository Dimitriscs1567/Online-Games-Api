import { Schema } from "mongoose";
import { GeneralState } from "./board_states";

export interface IAuthorization{
    email: string,
    username: string,
    isRefresh: boolean,
}

export interface IAllowedUser{
    email: string,
}

export interface IBoard{
    game: Schema.Types.ObjectId,
    creator: string,
    title: string,
    password: string,
    maxCapacity: string,
    currentPlayers: Array<String>,
    states?: Array<GeneralState>
}

export interface ICard{
    game: Schema.Types.ObjectId,
    value: string,
    valueImage: string,
    coverImage: string,
}

export interface IGame{
    title: string,
    image: string,
    capacity?: number,
}

export interface IUser{
    username: string,
    email: string,
    password: string,
    emailConfirmed: boolean,
}