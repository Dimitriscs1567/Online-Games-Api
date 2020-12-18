import express from 'express';
import { 
    getAllGamesController, 
    creatNewBoard, 
    getBoard,
    deleteBoard,
} from '../controllers/game';

const router = express.Router();

router.get('/allGames', getAllGamesController);
router.post('/:game/boards', creatNewBoard);
router.post('/:game/boards/:creator', getBoard);
router.delete('/:game/boards/:creator', deleteBoard);

export default router;