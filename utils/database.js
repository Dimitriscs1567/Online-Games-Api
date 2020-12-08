const mongoose = require('mongoose');
const Game = require('../models/game');
const Card = require('../models/card');
const AllowedUser = require('../models/allowed_user');

exports.getAllGames = () => {
    return new Promise((resolve, reject)=>{
        Game.find((error, result) => {
            if(error){
                console.log(error)
                const error = new Error("Could not retrieve games.");
                error.statusCode = 500;
                reject(error);
            }
            
            resolve(result);
        });
    });
}

exports.getNumberOfGames = () => {
    return new Promise((resolve, reject)=>{
        Game.find().countDocuments((error, result) => {
            if(error){
                console.log(error)
                const error = new Error("Could not retrieve number of games.");
                error.statusCode = 500;
                reject(error);
            }
            
            resolve(result);
        });
    });
}

exports.saveGame = (game) => {
   return new Game({
       title: game.title,
       image: game.image,
       cards: game.cards.map(card => new Card.model({
            value: card.value,
            valueImage: card.valueImage,
            coverImage: card.coverImage,
       }).schema),
   }).save();
}

exports.getAllowedUsers = () => {
    return new Promise((resolve, reject)=>{
        AllowedUser.find((error, result) => {
            if(error){
                console.log(error)
                const error = new Error("Could not retrieve allowed users.");
                error.statusCode = 500;
                reject(error);
            }
            
            resolve(result);
        });
    });
}

exports.connectDb = () => {
    return mongoose.connect('mongodb://127.0.0.1:27017/?compressors=zlib&gssapiServiceName=mongodb', {
        useNewUrlParser: true,  
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
}