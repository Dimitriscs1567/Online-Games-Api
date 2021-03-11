import mongoose, { Model, Document } from 'mongoose';
import { IBoard } from '../declarations/model_declarations';

const Schema = mongoose.Schema;

export interface IBoardModel extends IBoard, Document {
}

export const BoardSchema = new Schema(
    {
        game: {
            type: Schema.Types.ObjectId, 
            ref: 'Game',
            required: true,
        },
        creator: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: false,
        },
        capacity: {
            type: Number,
            required: true,
        },
        started: {
            type: Boolean,
            required: true,
        },
        otherPlayers: [{
            type: String,
            required: true,
        }],
        state: {
            type: Object,
            required: true,
        }
    },
    {
        timestamps: true,
    },
);

export const Board: Model<IBoardModel> = mongoose.model<IBoardModel>('Board', BoardSchema);