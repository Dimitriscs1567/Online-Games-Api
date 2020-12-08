const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
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

module.exports = {
    model: mongoose.model('Card', cardSchema),
    schema: cardSchema,
}   