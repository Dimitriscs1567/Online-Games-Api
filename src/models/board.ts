import mongoose, { Model, Document } from 'mongoose';
import { IBoard } from '../declarations/model_declarations';

const Schema = mongoose.Schema;

export interface IBoardModel extends IBoard, Document {
}

export const BoardSchema = new Schema({
    creator: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    maxCapacity: {
        type: Number,
        required: true,
    },
    states: [{
        type: Object,
        required: false,
    }]
});

export const Board: Model<IBoardModel> = mongoose.model<IBoardModel>('board', BoardSchema);