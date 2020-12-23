import { saveCard, saveGame }from "../utils/database";
import fs from 'fs';

const tichuCards = () => {
    const folderPath = 'src/assets/games/tichu/cards';
    const cards = new Array<any>();

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
        getCards: tichuCards,
    }
];

export const saveGames = async () => {
    for(let i=0; i<games.length; i++){
        const savedGame = await saveGame(games[i]);

        const cards = games[i].getCards().map(card => ({
            ...card, game: savedGame._id,
        }));

        for(let i=0; i<cards.length; i++){
            await saveCard(cards[i]);
        }
    }
}

export const getDataNumOfGames = () => games.length; 