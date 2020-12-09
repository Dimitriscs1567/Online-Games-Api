const { getAllGames } = require("../utils/database");

exports.getAllGames = (req, res, next) => {
    getAllGames().then(result => {
        return res.status(200).json(result);
    }).catch(error => {
        const myError = new Error("Could not retrieve games.");
        myError.statusCode = 500;
        return next(myError);
    });
}