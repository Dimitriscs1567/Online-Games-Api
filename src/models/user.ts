import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const userSchema = new Schema({
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

export const UserModel = mongoose.model('user', userSchema);