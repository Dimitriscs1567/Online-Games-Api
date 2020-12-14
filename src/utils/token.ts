import { IAuthorization } from "../declarations/model_declarations";
import { Request } from "express";
import jwt from 'jsonwebtoken';

export const getTokenFromHeader = (req: Request) => {
    if(req.get('Authorization') && req.get('Authorization')!.split(' ').length > 0){
        const token = req.get('Authorization')!.split(' ')[1];
        return token;
    }

    return null;
}

export const getTokenTranslation = (token: string) => {
    try {
        const decode = jwt.verify(token, process.env.SIGN_KEY as string) as IAuthorization | null;
        return decode;
        
    } catch (error) {
        return null;
    }
}

export const generateNewToken = (user: IAuthorization, expiresIn: string | number) => {
    const token = jwt.sign(user, process.env.SIGN_KEY as string, { expiresIn: expiresIn });

    return token;
}