import { NextFunction, Request, Response } from "express";

export const handleErrors = (error: MyError, req: Request, res: Response, next: NextFunction) => {
    return res.status(error.statusCode).json({
        error: error.message,
    });
}