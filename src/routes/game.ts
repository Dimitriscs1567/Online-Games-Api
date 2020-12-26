import express from 'express';
import { 
    getAllGamesController, 
    createNewBoard, 
    deleteBoard,
    getGameController,
    getCards,
} from '../controllers/game';

const router = express.Router();

router.get('/allGames', getAllGamesController);
router.post('/getGame', getGameController);
router.post('/createNewBoard', createNewBoard);
router.delete('/deleteBoard/:creator', deleteBoard);
router.post('/getCards', getCards);

export default router;