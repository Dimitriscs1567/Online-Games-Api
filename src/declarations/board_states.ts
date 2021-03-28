import { ICard } from "./model_declarations";

export enum TichuState{
    EightCards,
    Exchanges,
    Turn,
    EndTurn,
}

export interface TichuSpecifics {
    hands: Array<Array<ICard>>,
    inPlay: Array<Array<ICard>>,
}

export interface GeneralState{
    round: Number,
    players: Array<string | null>,
    readyPlayers: Array<boolean>,
    playerTurn: string | null,
    points: Array<number | null>,
    roundState: TichuState | null,
    gameSpecifics: TichuSpecifics | null,
}