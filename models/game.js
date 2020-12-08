const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Board = require('./board');

const gameSchema = new Schema(
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
        boards: [{
            type: Board.schema,
            required: false,
        }]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Game', gameSchema);