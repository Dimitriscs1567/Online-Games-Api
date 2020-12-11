import mongoose, { Model, Document } from 'mongoose';
import { IGame } from '../declarations/model_declarations';
import { BoardSchema } from './board';
import { CardSchema } from './card';

const Schema = mongoose.Schema;

export interface IGameModel extends IGame, Document{

}

export const GameSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String,
            required: true,
        },
        cards: [CardSchema],
        boards: [BoardSchema]
    },
    {
        timestamps: true,
    }
);

export const Game: Model<IGameModel> =  mongoose.model<IGameModel>('Game', GameSchema);