import { getAllGames, getBoardsForGame } from "../utils/database";
import { NextFunction, Request, Response } from "express";
import { IGameModel } from "../models/game";
import { MyError } from "../declarations/my_error";

export const getAllGamesController = (req: Request, res: Response, next: NextFunction) => {
    getAllGames().then((result: Array<IGameModel>) => {
        return res.status(200).json(result);
    }).catch((error: Error) => {
        const myError = new MyError("Could not retrieve games.", 500);
        return next(myError);
    });
}

export const getAllBoardsForGame = (req: Request, res: Response, next: NextFunction) => {
    if(!req.user){
        const myError = new MyError("Unauthorized request.", 401);
        return next(myError);
    }

    getBoardsForGame(req.params.game).then((result: IGameModel | null) => {
        if(result){
            return res.status(200).json(result);
        }

        const myError = new MyError("Game not found.", 400);
        return next(myError);
    }).catch((error: Error) => {
        const myError = new MyError("Could not retrieve boards.", 500);
        return next(myError);
    });
}