import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser'
import gameRoutes from './routes/game';
import authRoutes from './routes/auth';
import { setCorsHeaders } from './config/corsPolicy';
import { handleErrors } from './controllers/error';
import path from 'path';
import { saveGames } from './data/data';
import { connectDb, getNumberOfGames } from './utils/database';
import { getAuthorization } from './controllers/auth';

dotenv.config();
const app = express();

//express customization
app.use(bodyParser.json());
app.use(setCorsHeaders);
app.use('/assets', express.static(path.join(__dirname, 'assets')));

//routes
app.use(getAuthorization);
app.use('/auth', authRoutes);
app.use('/game', gameRoutes);
app.use(handleErrors);

connectDb().then((result) => {
    return getNumberOfGames();
}).then(async (count) => {
    if(count === 0){
        await saveGames();
    }

    app.listen(8080);
}).catch(error => {
    console.log(error);
});
