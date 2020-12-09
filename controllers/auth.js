const User = require('../models/user');
const { 
    getAllUsersEmails, 
    getAllowedUsersEmails, 
    saveUser, 
    getUserByEmail 
} = require('../utils/database');
const { checkBody } = require('../utils/post_validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signin = async (req, res, next) => {
    const ok = checkBody(req.body, ['email', 'password']);
    if(!ok){
        const myError = new Error("Invalid body.");
        myError.statusCode = 400;
        return next(myError);
    }

    try {
        const result = await getUserByEmail(req.body.email);
        if(result && result.email && await bcrypt.compare(req.body.password, result.password)){
            const token = jwt.sign({
                email: result.email,
                emailConfirmed: result.emailConfirmed,
            }, process.env.SIGN_KEY, { expiresIn: '2d' });

            return res.status(200).json({ token: token });
        }

        const myError = new Error("Invalid credentials.");
        myError.statusCode = 401;
        return next(myError);

    } catch (error) {
        const myError = new Error("Could not retrieve user.");
        myError.statusCode = 500;
        return next(myError);
    }
}

exports.signout = (req, res, next) => {
    return res.status(200).json({});
}

exports.signup = async (req, res, next) => {
    const ok = checkBody(req.body, ['email', 'password']);
    if(!ok){
        const error = new Error("Invalid body.");
        error.statusCode = 400;
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

        const myError = new Error("Email already exists or is not allowed.");
        myError.statusCode = 400;
        next(myError);

    } catch (error) {
        const myError = new Error("Something went wrong during signup process.");
        myError.statusCode = 500;
        return next(newError);
    }
}

exports.changePassword = (req, res, next) => {
    return res.status(200).json({});
}