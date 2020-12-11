import { NextFunction, Request, Response } from "express";
import { 
    getAllUsersEmails, 
    getAllowedUsersEmails, 
    saveUser, 
    getUserByEmail 
} from '../utils/database';
import { checkBody } from '../utils/post_validation';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserModel } from "../models/user";
import { MyError } from "../declarations/my_error";
import { IAuthorization } from "../declarations/model_declarations";

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
                emailConfirmed: result.emailConfirmed,
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
    const ok = checkBody(req.body, ['email', 'password']);
    if(!ok){
        const error = new MyError("Invalid body.", 400);
        return next(error);
    }

    try {
        const existingEmails = await getAllUsersEmails();
        const allowedEmails = await getAllowedUsersEmails();
        
        if(!existingEmails.includes(req.body.email) && allowedEmails.includes(req.body.email)){
            const encruptedPassword = await bcrypt.hash(req.body.password, 12);

            const result = await saveUser({
                email: req.body.email,
                password: encruptedPassword,
                emailConfirmed: false,
            });
            return res.status(201).json({});
        }

        const myError = new MyError("Email already exists or is not allowed.", 400);
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
                req.email = decode.email;
            }
        }

        return next();

    } catch (error) {
        const myError = new MyError("Could not decode token.", 500);
        return next(myError);
    }
}