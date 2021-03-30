import { TichuState } from "../declarations/board_states";
import { IBoard, ICard, IGame } from "../declarations/model_declarations";
import { getGameById, saveBoardState } from "../utils/database";

export const startGameLogic = async (board: IBoard) => {
    const game = (await getGameById(board.game))!;

    switch(game.title){
        case 'Tichu': startTichuLogic(board, game); break;
        default: break;
    }
}

const startTichuLogic = (board: IBoard, game: IGame) => {
    let allCards = [...game.cards];
    shuffleCards(allCards);

    let hands: Array<Array<ICard>> = new Array(board.capacity).fill([]);
    while(hands[0].length < 8){
        for(let i=0; i<board.capacity; i++){
            hands[i].push(allCards[0]);
            allCards = allCards.slice(1);
        }
    }

    const newBoard = {
        ...board,
        state: {
            players: [...board.state.players],
            round: 1,
            readyPlayers: new Array(board.capacity).fill(false),
            points: new Array(board.capacity).fill(0),
            roundState: TichuState.EightCards,
            playerTurn: null,
            gameSpecifics: {
                hands: [...hands],
                inPlay: [],
            },
        }
    }

    saveBoardState(newBoard);
}

const shuffleCards = (array: Array<ICard>) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}
