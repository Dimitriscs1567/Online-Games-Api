import { NextFunction, Request, Response } from "express";

export const setCorsHeaders = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Contol-Allow-Origin', '*');
    res.setHeader('Access-Contol-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Contol-Allow-Headers', 'Content-Type, Authorization');
    next();
}