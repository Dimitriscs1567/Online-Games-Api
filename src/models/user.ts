import mongoose, { Model, Document } from 'mongoose';
import { IUser } from '../declarations/model_declarations';

const Schema = mongoose.Schema;

export interface IUserModel extends IUser, Document{

} 

export const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    emailConfirmed: {
        type: Boolean,
        required: true,
    }
});

export const User: Model<IUserModel> = mongoose.model<IUserModel>('user', UserSchema);