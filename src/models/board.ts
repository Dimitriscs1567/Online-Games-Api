import mongoose, { Model, Document } from 'mongoose';
import { IBoard } from '../declarations/model_declarations';

const Schema = mongoose.Schema;

export interface IBoardModel extends IBoard, Document {
}

export const BoardSchema = new Schema(
    {
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
        otherPlayers: [{
            type: String,
            required: true,
        }],
        states: [{
            type: Object,
            required: false,
        }]
    },
    {
        timestamps: true,
    },
);

export const Board: Model<IBoardModel> = mongoose.model<IBoardModel>('board', BoardSchema);