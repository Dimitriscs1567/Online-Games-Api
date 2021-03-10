import dotenv from 'dotenv';
import express from 'express';
import gameRoutes from './routes/game';
import authRoutes from './routes/auth';
import { setCorsHeaders } from './config/corsPolicy';
import { handleErrors } from './controllers/error';
import path from 'path';
import { getDataNumOfGames, saveGames } from './data/data';
import { connectDb, getNumberOfGames } from './utils/database';
import { getAuthorization } from './controllers/auth';
import { socketInit } from './config/socket';
import helmet from 'helmet';
import * as http from 'http';

dotenv.config();
const app = express();

//express customization
app.use(helmet());
app.use(express.json());
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
    //saving initial stuff/////////////////////////
    if(count < getDataNumOfGames()){
        await saveGames();
    }
    ///////////////////////////////////////////////

    const server = http.createServer(app);
    socketInit(server);
    server.listen(process.env.PORT || 8080);
}).catch(error => {
    console.log(error);
});
