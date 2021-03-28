import mongoose, { Model, Document } from 'mongoose';
import { IGame } from '../declarations/model_declarations';

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
        capacity: {
            type: Number,
            required: false,
        },
        cardCover: {
            type: String,
            required: true,
        },
        cards: {
            type: Array,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Game: Model<IGameModel> =  mongoose.model<IGameModel>('Game', GameSchema);