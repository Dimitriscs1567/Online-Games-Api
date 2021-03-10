import mongoose from 'mongoose';
import { Game } from '../models/game';
import { AllowedUser } from '../models/allowed_user';
import { User } from '../models/user';
import { IAllowedUser, IBoard, ICard, IGame, IUser } from '../declarations/model_declarations';
import { Board } from '../models/board';
import { broadcastAllActiveBoardsMessage } from './messages';
import { Card } from '../models/card';

export const getAllGames = () => {
    return Game.find().exec();
}

export const getGameById = (gameId: mongoose.Types.ObjectId) => {
    return Game.findOne({ _id: gameId}).exec();
}

export const getGameByTitle = (gameTitle: string) => {
    return Game.findOne({ title: gameTitle}).exec();
}

export const getNumberOfGames = () => {
    return new Promise<number>((resolve, reject) => {
        Game.find().countDocuments((error, count) => {
            if(error){
                resolve(0);
            }

            resolve(count);
        });
    }); 
}

export const saveGame = (game: IGame) => {
    return new Game(game).save();
}

export const getNumberOfBoards = () => {
    return Board.find().countDocuments().exec();
}

export const getActiveBoardsForGame = async (gameTitle: string) => {
    const id = (await getGameByTitle(gameTitle))?._id;

    return id ? Board.find({ game: id, started: false })
            .populate('game')
            .exec() : null;
}

export const getCreatorBoard = async (creator: string) => {
    return Board.findOne({ creator: creator }).exec();
}

export const getUserBoard = async (username: string) => {
    return Board.findOne({ otherPlayers: username }).exec();
}

export const addBoardPlayer = async (creator: string, player: string, position: number) => {
    const board = await Board.findOne({ creator: creator }).exec();

    if(board && board.otherPlayers.length + 1 <= board.capacity && !board.state.players[position]){
        board.otherPlayers = [...board.otherPlayers, player];
        const newPlayers = [...board.state.players];
        newPlayers[position] = player;
        board.state = {
            ...board.state,
            players: [...newPlayers],
        };

        const newBoard = await board.save();

        broadcastAllActiveBoardsMessage(newBoard.game);
        return newBoard;
    }

    return null;
}

export const removeBoardPlayer = async (creator: string, player: string) => {
    const board = await Board.findOne({ creator: creator }).exec();

    if(board && board.otherPlayers.includes(player)){
        const newPlayers = [...board.otherPlayers];
        newPlayers.splice(newPlayers.indexOf(player));
        board.otherPlayers = [...newPlayers];

        const newStatePlayers = [...board.state.players];
        newStatePlayers[newStatePlayers.indexOf(player)] = null;
        board.state = {
            ...board.state,
            players: [...newStatePlayers],
        };

        const newBoard = await board.save();

        broadcastAllActiveBoardsMessage(newBoard.game);
        return newBoard;
    }

    return null;
}

export const saveBoard = async (board: IBoard) => {
    const newBoard = await new Board(board).save();

    broadcastAllActiveBoardsMessage(board.game);

    return newBoard;
}

export const deleteBoard = async (board: IBoard) => {
    await new Board(board).delete();

    broadcastAllActiveBoardsMessage(board.game);
    
    return;
}

export const saveCard = (card: ICard) => {
    return new Card(card).save();
}

export const getCardsForGame = async (gameTitle: string) => {
    const id = (await getGameByTitle(gameTitle))?._id;

    return id ? Card.find({ game: id }).exec() : null;
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