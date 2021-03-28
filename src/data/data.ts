import { saveGame }from "../utils/database";
import fs from 'fs';
import { ICard } from "../declarations/model_declarations";

const tichuCards = () => {
    const folderPath = 'src/assets/games/tichu/cards';
    const cards = new Array<ICard>();

    fs.readdirSync(folderPath).forEach(file => {
        const fileName = file.substring(0, file.length - 4);

        cards.push({
            value: fileName,
            image: `assets/games/tichu/cards/${file}`,
        });
    });

    return cards;
}

const games = [
    {
        title: 'Tichu',
        image: 'assets/games/tichu/cover.png',
        cardCover: 'assets/games/tichu/cardCover.png',
        capacity: 4,
        cards: [],
    }
];

export const saveGames = async () => {
    for(let i=0; i<games.length; i++){
        const savedGame = await saveGame({
            ...games[i],
            cards: [...getCardsForGame(games[i].title)!],
        });
    }
}

const getCardsForGame = (game: string) => {
    switch(game){
        case 'Tichu': return tichuCards(); 
        default: return null;
    }
}

export const getDataNumOfGames = () => games.length; 