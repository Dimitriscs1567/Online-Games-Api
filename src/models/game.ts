import mongoose from 'mongoose';
import { boardSchema } from './board';
import { cardSchema } from './card';

const Schema = mongoose.Schema;

export const gameSchema = new Schema(
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
        cards: [cardSchema],
        boards: [boardSchema]
    },
    {
        timestamps: true,
    }
);

export const GameModel =  mongoose.model('Game', gameSchema);