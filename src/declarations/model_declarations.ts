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
    creator: string,
    title: string,
    password: string,
    maxCapacity: string,
    states?: Array<GeneralState>
}

export interface ICard{
    value: string,
    valueImage: string,
    coverImage: string,
}

export interface IGame{
    title: string,
    image: string,
    cards: Array<ICard>,
    boards?: Array<IBoard>,
}

export interface IUser{
    username: string,
    email: string,
    password: string,
    emailConfirmed: boolean,
}