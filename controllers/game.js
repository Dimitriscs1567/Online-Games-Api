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

exports.createGame = (req, res, next) => {
    const body = req.body;
    if(!body.title || !body.image){
        const error = new Error("Invalid body.");
        error.statusCode = 400;
        throw error;
    }

    new Game({
        title: body.title,
        image: body.image,
    })
    .save()
    .then(result => {
        return res.status(201).json(result);
    }).catch(error => {
        console.log(error);
        const myError = new Error("Could not create the game.");
        myError.statusCode = 500;
        next(myError);
    });        
}