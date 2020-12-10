import { getAllGames } from "../utils/database";
import { NextFunction, Request, Response } from "express";

export const getAllGamesController = (req: Request, res: Response, next: NextFunction) => {
    getAllGames().then(result => {
        return res.status(200).json(result);
    }).catch(error => {
        const myError = new MyError("Could not retrieve games.", 500);
        return next(myError);
    });
}