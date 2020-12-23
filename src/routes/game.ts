import express from 'express';
import { 
    getAllGamesController, 
    createNewBoard, 
    getBoard,
    deleteBoard,
    getGameController,
    getCards,
} from '../controllers/game';

const router = express.Router();

router.get('/allGames', getAllGamesController);
router.post('/getGame', getGameController);
router.post('/createNewBoard', createNewBoard);
router.post('/getBoard', getBoard);
router.delete('/deleteBoard/:creator', deleteBoard);
router.post('/getCards', getCards);

export default router;