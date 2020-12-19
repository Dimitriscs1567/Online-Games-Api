import * as db from "../utils/database";
import { NextFunction, Request, Response } from "express";
import { IGameModel } from "../models/game";
import { MyError } from "../declarations/my_error";
import { checkBody } from "../utils/validations";
import bcrypt from 'bcrypt';
import { IBoard } from "../declarations/model_declarations";
import mongoose from "mongoose";

export const getAllGamesController = (req: Request, res: Response, next: NextFunction) => {
    db.getAllGames().then((result: Array<IGameModel>) => {
        return res.status(200).json(result);
    }).catch((error: Error) => {
        const myError = new MyError("Could not retrieve games.", 500);
        return next(myError);
    });
}

export const creatNewBoard = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.user){
        const myError = new MyError("Unauthorized request.", 401);
        return next(myError);
    }

    const ok = checkBody(req.body, ['creator', 'title']);
    if(!ok){
        const myError = new MyError("Invalid body.", 400);
        return next(myError);
    }

    const exists = await db.getUserBoard(req.body.creator);
    if(exists){
        await db.deleteBoard(exists);
    }

    let encryptedPassword;
    if(req.body.password){
        encryptedPassword = await bcrypt.hash(req.body.password, 6);
    }

    const parentGame = await db.getGameByTitle(req.params.game);
    if(!parentGame){
        const myError = new MyError("Game for board not found.", 400);
        return next(myError);
    }

    const capacity = parentGame.capacity ?? req.body.capacity;
    if(!capacity){
        const myError = new MyError("Please also include capacity.", 400);
        return next(myError);
    }

    const newBoard: IBoard = {
        title: req.body.title,
        creator: req.body.creator,
        game: new mongoose.Types.ObjectId(parentGame.id),
        password: encryptedPassword,
        otherPlayers: [],
        capacity: capacity,
        started: false,
    }

    db.saveBoard(newBoard).then((result) => {
        return res.status(201).json(result);   
        
    }).catch((error: Error) => {
        console.log(error);
        const myError = new MyError("Could not create board.", 500);
        return next(myError);
    });
}

export const getBoard = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.user){
        const myError = new MyError("Unauthorized request.", 401);
        return next(myError);
    }

    const board = await db.getUserBoard(req.params.creator);
    if(!board){
        const myError = new MyError("Could not found board.", 400);
        return next(myError);
    }

    if(req.user.username !== board.creator && board.password){
        if(req.body.password){
            const ok = await bcrypt.compare(req.body.password, board.password);

            if(ok){
                return res.status(200).json(board);
            }
        }

        const myError = new MyError("Unauthorized request.", 401);
        return next(myError);
    }

    return res.status(200).json(board);  
}

export const deleteBoard = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.user || req.user.username !== req.params.creator){
        const myError = new MyError("Unauthorized request.", 401);
        return next(myError);
    }

    const board = await db.getUserBoard(req.params.creator);
    if(!board){
        const myError = new MyError("Could not found board.", 400);
        return next(myError);
    }

    db.deleteBoard(board);
}