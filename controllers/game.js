const { getAllGames } = require("../utils/database");

exports.getAllGames = (req, res, next) => {
    getAllGames().then(result => {
        res.status(200).json(result);
    }).catch(error => {
        next(error);
    });
}