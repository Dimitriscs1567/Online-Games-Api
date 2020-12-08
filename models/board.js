const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema({
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

module.exports = {
    model: mongoose.model('Board', boardSchema),
    schema: boardSchema,
}   