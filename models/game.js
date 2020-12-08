const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Board = require('./board');
const Card = require('./card');

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
        cards: [Card.schema],
        boards: [Board.schema]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Game', gameSchema);