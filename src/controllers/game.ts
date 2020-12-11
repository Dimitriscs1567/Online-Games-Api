import { getAllGames } from "../utils/database";
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