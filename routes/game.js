const express = require('express');
const gameController = require('../controllers/game');

const router = express.Router();

router.get('/allGames', gameController.getAllGames);
router.post('/createGame', gameController.createGame);

module.exports = router;