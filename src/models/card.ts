import mongoose, { Model, Document } from 'mongoose';
import { ICard } from '../declarations/model_declarations';

const Schema = mongoose.Schema;

export interface ICardModel extends ICard, Document{

}

export const CardSchema = new Schema({
    game: {
        type: Schema.Types.ObjectId, 
        ref: 'Game',
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

export const Card: Model<ICardModel> = mongoose.model<ICardModel>('Card', CardSchema);