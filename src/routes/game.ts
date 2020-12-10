import express from 'express';
import { getAllGamesController } from '../controllers/game';

const router = express.Router();

router.get('/allGames', getAllGamesController);

export default router;