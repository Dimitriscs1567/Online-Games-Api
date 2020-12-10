import express from 'express';
import { signin, signout, signup, changePassword } from '../controllers/auth';

const router = express.Router();

router.post('/signin', signin);
router.get('/signout', signout);
router.post('/signup', signup);
router.post('/changePassword', changePassword);

export default router;