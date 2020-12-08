const { saveGame } = require("../utils/database");

const games = [
    {
        title: 'Tichu',
        image: 'assets/games/tichu/cover',
        cards: [],
    }
]

exports.saveGames = async () => {
    games.forEach(async (game) => {
        await saveGame(game);
    });
}