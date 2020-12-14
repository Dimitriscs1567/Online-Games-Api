import express from 'express';
import { signin, signout, signup, changePassword, validateToken, getNewToken } from '../controllers/auth';

const router = express.Router();

router.post('/signin', signin);
router.get('/signout', signout);
router.post('/signup', signup);
router.post('/changePassword', changePassword);
router.get('/validateToken', validateToken);
router.post('/getNewToken', getNewToken);

export default router;