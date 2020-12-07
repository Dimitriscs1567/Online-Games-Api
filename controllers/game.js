exports.getAllGames = (req, res, next) => {
    res.status(200).json({
        games: [{
            title: 'Tichu'
        }]
    });
}