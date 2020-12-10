import mongoose from 'mongoose';
import { GameModel } from '../models/game';
import { CardModel } from '../models/card';
import { AllowedUserModel } from '../models/allowed_user';
import { UserModel } from '../models/user';

export const getAllGames = () => {
    return GameModel.find().exec();
}

export const getNumberOfGames = () => {
    return new Promise((resolve, reject)=>{
        GameModel.find().countDocuments((error, result) => {
            if(error){                
                reject(error);
            }
            
            resolve(result);
        });
    });
}

export const saveGame = (game: any) => {
   return new GameModel({
       title: game.title,
       image: game.image,
       cards: game.cards.map((card: any) => new CardModel({
            value: card.value,
            valueImage: card.valueImage,
            coverImage: card.coverImage,
       }).schema),
   }).save();
}

export const getAllUsersEmails = () => {
    return new Promise<string[]>((resolve, reject)=>{
        UserModel.find((error, result) => {
            if(error){                
                reject(error);
            }
            
            const emails = result.map((user: any) => user.email);
            resolve(emails);
        });
    });
}

export const saveUser = (user: any) => {
    return new UserModel({
        email: user.email,
        password: user.password,
        emailConfirmed: user.emailConfirmed,
    }).save();
}

export const getUserByEmail = (email: string) => {
    return UserModel.findOne({ email: email }).exec();
}

export const getAllowedUsersEmails = () => {
    return new Promise<string[]>((resolve, reject)=>{
        AllowedUserModel.find((error, result) => {
            if(error){
                reject(error);
            }
            
            const emails = result.map((allowedUser: any) => allowedUser.email);
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