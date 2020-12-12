import { NextFunction, Request, Response } from "express";
import { saveUser, getUserByEmail } from '../utils/database';
import { checkBody, checkNewUser } from '../utils/validations';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserModel } from "../models/user";
import { MyError } from "../declarations/my_error";
import { IAuthorization, IUser } from "../declarations/model_declarations";

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    const ok = checkBody(req.body, ['email', 'password']);
    if(!ok){
        const myError = new MyError("Invalid body.", 400);
        return next(myError);
    }

    try {
        const result = await getUserByEmail(req.body.email) as IUserModel;
        if(result && result.email && await bcrypt.compare(req.body.password, result.password)){
            const token = jwt.sign({
                email: result.email,
                username: result.username
            }, process.env.SIGN_KEY as string, { expiresIn: '2d' });

            return res.status(200).json({ token: token });
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
            return res.status(201).json({});
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
    try {
        if(req.get('Authorization') && req.get('Authorization')!.split(' ').length > 0){
            const token = req.get('Authorization')!.split(' ')[1];
            const decode = jwt.verify(token, process.env.SIGN_KEY as string) as IAuthorization | null;

            if(decode){
                req.user = decode;
            }
        }

        return next();

    } catch (error) {
        const myError = new MyError("Could not decode token.", 500);
        return next();
    }
}