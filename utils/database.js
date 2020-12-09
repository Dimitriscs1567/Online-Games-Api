const mongoose = require('mongoose');
const Game = require('../models/game');
const Card = require('../models/card');
const AllowedUser = require('../models/allowed_user');
const User = require('../models/user');

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

exports.getAllUsersEmails = () => {
    return new Promise((resolve, reject)=>{
        User.find((error, result) => {
            if(error){
                console.log(error)
                const error = new Error("Could not retrieve users emails.");
                error.statusCode = 500;
                reject(error);
            }
            
            const emails = result.map(user => user.email);
            resolve(emails);
        });
    });
}

exports.saveUser = (user) => {
    return new User({
        email: user.email,
        password: user.password,
        emailConfirmed: user.emailConfirmed,
    }).save();
}

exports.getUserByEmail = (email) => {
    return User.findOne({ email: email }).exec();
}

exports.getAllowedUsersEmails = () => {
    return new Promise((resolve, reject)=>{
        AllowedUser.find((error, result) => {
            if(error){
                console.log(error)
                const error = new Error("Could not retrieve allowed users emails.");
                error.statusCode = 500;
                reject(error);
            }
            
            const emails = result.map(allowedUser => allowedUser.email);
            resolve(emails);
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