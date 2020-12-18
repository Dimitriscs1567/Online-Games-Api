import { saveGame }from "../utils/database";

const games = [
    {
        title: 'Tichu',
        image: 'assets/games/tichu/cover.png',
        cards: [],
    }
]

export const saveGames = async () => {
    for(let i=0; i<games.length; i++){
        await saveGame(games[i]);
    }
}

export const getDataNumOfGames = () => games.length; 