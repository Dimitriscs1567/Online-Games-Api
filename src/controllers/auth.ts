import { NextFunction, Request, Response } from "express";
import { saveUser, getUserByIdentifier } from '../utils/database';
import { checkBody, checkNewUser } from '../utils/validations';
import bcrypt from 'bcrypt';
import { IUserModel } from "../models/user";
import { MyError } from "../declarations/my_error";
import { IAuthorization, IUser } from "../declarations/model_declarations";
import { generateNewToken, getTokenFromHeader, getTokenTranslation } from "../utils/token";

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    const ok = checkBody(req.body, ['email', 'password']);
    if(!ok){
        const myError = new MyError("Invalid body.", 400);
        return next(myError);
    }

    try {
        const result = await getUserByIdentifier(req.body.email) as IUserModel;
        if(result && await bcrypt.compare(req.body.password, result.password)){
            const toSign: IAuthorization = {
                email: result.email,
                username: result.username,
                isRefresh: false,
            } 
            const token = generateNewToken(toSign, '1d');

            const toSignRefresh: IAuthorization = {
                email: result.email,
                username: result.username,
                isRefresh: true,
            } 
            const refreshToken = generateNewToken(toSignRefresh, '7d');

            return res.status(200).json({ 
                refreshToken: refreshToken,
                token: token,
                username: result.username,
                emailConfirmed: result.emailConfirmed,
            });
        }

        const myError = new MyError("Invalid credentials.", 401);
        return next(myError);

    } catch (error) {
        const myError = new MyError("Could not retrieve user.", 500);
        return next(myError);
    }
}

export const signout = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({});
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const ok = checkBody(req.body, ['email', 'password', 'username']);
    if(!ok){
        const error = new MyError("Invalid body.", 400);
        return next(error);
    }

    try {
        const newUser: IUser = {
            ...req.body,
            emailConfirmed: false,
        }
        
        const isAllowed = await checkNewUser(newUser);
        if(isAllowed){
            const encruptedPassword = await bcrypt.hash(req.body.password, 12);

            const result = await saveUser({
                username: req.body.username,
                email: req.body.email,
                password: encruptedPassword,
                emailConfirmed: false,
            });

            const toSign: IAuthorization = {
                email: result.email,
                username: result.username,
                isRefresh: false,
            } 
            const token = generateNewToken(toSign, '1d');

            const toSignRefresh: IAuthorization = {
                email: result.email,
                username: result.username,
                isRefresh: true,
            } 
            const refreshToken = generateNewToken(toSignRefresh, '7d');

            return res.status(200).json({ 
                refreshToken: refreshToken,
                token: token,
                username: result.username,
                emailConfirmed: result.emailConfirmed,
            });
        }

        const myError = new MyError("Email/Username already exists or is not allowed.", 400);
        next(myError);

    } catch (error) {
        const myError = new MyError("Something went wrong during signup process.", 500);
        return next(myError);
    }
}

export const changePassword = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({});
}

export const getAuthorization = (req: Request, res: Response, next: NextFunction) => {
    const token = getTokenFromHeader(req);
    if(token){
        const user = getTokenTranslation(token);

        if(user && !user.isRefresh){
            req.user = user;
        }
    }

    return next();
}

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = getTokenFromHeader(req);
    if(!token){
        const error = new MyError("Invalid or expired token.", 401);
        return next(error);
    }

    const user = getTokenTranslation(token);
    if(!user){
        const error = new MyError("Invalid or expired token.", 401);
        return next(error);
    }

    const fullUser = await getUserByIdentifier(user.email);

    return res.status(200).json({ 
        ...user, 
        emailConfirmed: fullUser?.emailConfirmed, 
    });
}

export const getNewToken = (req: Request, res: Response, next: NextFunction) => {
    const ok = checkBody(req.body, ['refreshToken']);
    if(!ok){
        const error = new MyError("Invalid body.", 400);
        return next(error);
    }

    let user = getTokenTranslation(req.body.refreshToken);
    if(!user || !user.isRefresh){
        const error = new MyError("Invalid or expired token.", 401);
        return next(error);
    }

    const toSign: IAuthorization = {
        email: user.email,
        username: user.username,
        isRefresh: false,
    } 
    const token = generateNewToken(toSign, '1d');

    const toSignRefresh: IAuthorization = {
        email: user.email,
        username: user.username,
        isRefresh: true,
    } 
    const refreshToken = generateNewToken(toSignRefresh, '7d');

    return res.status(200).json({
        refreshToken: refreshToken,
        token: token,
    });
}