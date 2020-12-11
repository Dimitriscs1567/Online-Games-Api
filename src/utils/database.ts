import mongoose from 'mongoose';
import { Game } from '../models/game';
import { Card } from '../models/card';
import { AllowedUser } from '../models/allowed_user';
import { User } from '../models/user';
import { IAllowedUser, ICard, IGame, IUser } from '../declarations/model_declarations';

export const getAllGames = () => {
    return Game.find().exec();
}

export const getNumberOfGames = () => {
    return new Promise((resolve, reject)=>{
        Game.find().countDocuments((error: Error, result: number) => {
            if(error){                
                reject(error);
            }
            
            resolve(result);
        });
    });
}

export const saveGame = (game: IGame) => {
   return new Game({
       title: game.title,
       image: game.image,
       cards: game.cards.map((card: ICard) => new Card({
            value: card.value,
            valueImage: card.valueImage,
            coverImage: card.coverImage,
       }).schema),
   }).save();
}

export const getAllUsersEmails = () => {
    return new Promise<string[]>((resolve, reject)=>{
        User.find((error, result) => {
            if(error){                
                reject(error);
            }
            
            const emails = result.map((user: IUser) => user.email);
            resolve(emails);
        });
    });
}

export const saveUser = (user: IUser) => {
    return new User({
        email: user.email,
        password: user.password,
        emailConfirmed: user.emailConfirmed,
    }).save();
}

export const getUserByEmail = (email: string) => {
    return User.findOne({ email: email }).exec();
}

export const getAllowedUsersEmails = () => {
    return new Promise<string[]>((resolve, reject)=>{
        AllowedUser.find((error, result) => {
            if(error){
                reject(error);
            }
            
            const emails = result.map((allowedUser: IAllowedUser) => allowedUser.email);
            resolve(emails);
        });
    });
}

export const connectDb = () => {
    return mongoose.connect('mongodb://127.0.0.1:27017/?compressors=zlib&gssapiServiceName=mongodb', {
        useNewUrlParser: true,  
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
}