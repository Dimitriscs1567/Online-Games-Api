const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signin', authController.signin);
router.get('/signout', authController.signout);
router.post('/signup', authController.signup);
router.post('/changePassword', authController.changePassword);

module.exports = router;