import express from 'express';
import { getAllGamesController, getAllBoardsForGame } from '../controllers/game';

const router = express.Router();

router.get('/allGames', getAllGamesController);
router.get('/:game/boards', getAllBoardsForGame);

export default router;