import { saveGame }from "../utils/database";

const games = [
    {
        title: 'Tichu',
        image: 'assets/games/tichu/cover.png',
        cards: [],
    }
]

export const saveGames = async () => {
    games.forEach(async (game) => {
        await saveGame(game);
    });
}