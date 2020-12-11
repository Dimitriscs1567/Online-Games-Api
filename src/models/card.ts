import mongoose, { Model, Document } from 'mongoose';
import { ICard } from '../declarations/model_declarations';

const Schema = mongoose.Schema;

export interface ICardModel extends ICard, Document{

}

export const CardSchema = new Schema({
    value: {
        type: String,
        required: true,
    },
    valueImage: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    }
});

export const Card: Model<ICardModel> = mongoose.model<ICardModel>('card', CardSchema);