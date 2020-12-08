const express = require('express');
const gameController = require('../controllers/game');

const router = express.Router();

router.get('/allGames', gameController.getAllGames);

module.exports = router;