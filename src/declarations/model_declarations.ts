import mongoose from "mongoose";
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
    game: mongoose.Types.ObjectId,
    creator: string,
    title: string,
    password?: string,
    capacity: number,
    started: boolean,
    otherPlayers: Array<String>,
    states?: Array<GeneralState>
}

export interface ICard{
    game: mongoose.Types.ObjectId,
    value: string,
    image: string,
}

export interface IGame{
    title: string,
    image: string,
    cardCover: string,
    capacity?: number,
}

export interface IUser{
    username: string,
    email: string,
    password: string,
    emailConfirmed: boolean,
}