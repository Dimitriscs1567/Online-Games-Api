import { ICard } from "./model_declarations";

enum TichuState{
    EightCards,
    Exchanges,
    Turn,
    EndTurn,
}

interface TichuSpecifics {
    hands: Array<Array<ICard>>,
    inPlay: Array<Array<ICard>>,
}

export interface GeneralState{
    round: Number,
    players: Array<string | null>,
    points: Array<number | null>,
    roundState: TichuState | null,
    gameSpecifics: TichuSpecifics | null,
}