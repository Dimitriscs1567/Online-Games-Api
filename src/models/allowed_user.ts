import mongoose, { Model, Document } from 'mongoose';
import { IAllowedUser } from '../declarations/model_declarations';

const Schema = mongoose.Schema;

export interface IAllowedUserModel extends IAllowedUser, Document {
}

export const AllowedUserSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

export const AllowedUser: Model<IAllowedUserModel> = mongoose.model<IAllowedUserModel>('Allowed_User', AllowedUserSchema);