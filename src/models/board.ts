import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const boardSchema = new Schema({
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
    }
});

export const BoardModel = mongoose.model('board', boardSchema);