import mongoose, { ObjectId } from 'mongoose';
import { Game } from '../models/game';
import { AllowedUser } from '../models/allowed_user';
import { User } from '../models/user';
import { IAllowedUser, IGame, IUser } from '../declarations/model_declarations';
import { Board } from '../models/board';
import { getSocketServer } from '../config/socket';

export const getAllGames = () => {
    return Game.find().exec();
}

export const getGameByTitle = (gameTitle: string) => {
    return Game.findOne({ title: gameTitle}).exec();
}

export const getNumberOfGames = () => {
    return Game.find().countDocuments().exec();
}

export const getNumberOfBoards = () => {
    return Board.find().countDocuments().exec();
}

export const getBoardsForGame = async (gameTitle: string) => {

    const id = (await getGameByTitle(gameTitle))?._id;

    return id ? Board.find({ game: id })
            .select({ states: 0 })
            .populate('game', '-states')
            .exec() : null;
}

export const updateBoardPlayers = async (creator: string, players: Array<string>) => {
    const board = await Board.findOne({ creator: creator }).exec();

    if(board){
        board.otherPlayers = [...players];
        const newBoard = await board.save();

        getSocketServer().clients.forEach(client => {
            client.send(JSON.stringify(newBoard.toJSON()));
        });
    }
}

export const saveGame = (game: IGame) => {
   return new Game({
        title: game.title,
        image: game.image,
        capacity: game.capacity,
   }).save();
}

export const getAllUsers = () => {
    return User.find().exec();
}

export const saveUser = (user: IUser) => {
    return new User({
        username: user.username,
        email: user.email,
        password: user.password,
        emailConfirmed: user.emailConfirmed,
    }).save();
}

export const getUserByIdentifier = async (identifier: string) => {
    let user = await User.findOne({ email: identifier }).exec();
    if(!user){
        user = await User.findOne({ username: identifier }).exec();
    }

    return user;
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