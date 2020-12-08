const Game = require('../models/game');

exports.getAllGames = (req, res, next) => {
    Game.find((error, result) => {
        if(error){
            console.log(error)
            const error = new Error("Could not retrieve games.");
            error.statusCode = 500;
            throw error;
        }
        
        return res.status(200).json(result);
    });
}