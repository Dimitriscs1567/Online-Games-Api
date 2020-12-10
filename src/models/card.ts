import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const cardSchema = new Schema({
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

export const CardModel = mongoose.model('card', cardSchema);