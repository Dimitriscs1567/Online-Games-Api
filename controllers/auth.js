const User = require('../models/user');
const { checkBody } = require('../utils/post_validation');

exports.signin = (req, res, next) => {
    return res.status(200).json({});
}

exports.signout = (req, res, next) => {
    return res.status(200).json({});
}

exports.signup = (req, res, next) => {
    const ok = checkBody(req.body, ['email', 'password']);
    if(!ok){
        const error = new Error("Invalid body.");
        error.statusCode = 400;
        throw error;
    }

    //TODO: check email for duplicate and allowed users
    return res.status(200).json({});
}

exports.changePassword = (req, res, next) => {
    return res.status(200).json({});
}