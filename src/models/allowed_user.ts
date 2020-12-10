import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const allowedUserSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

export const AllowedUserModel = mongoose.model('allowed_user', allowedUserSchema);