import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser'
import gameRoutes from './routes/game';
import authRoutes from './routes/auth';
import { setCorsHeaders } from './config/corsPolicy';
import { handleErrors } from './controllers/error';
import path from 'path';
import { getDataNumOfGames, saveGames } from './data/data';
import { connectDb, getNumberOfBoards, getNumberOfGames, saveBoard } from './utils/database';
import { getAuthorization } from './controllers/auth';
import { socketInit } from './config/socket';
import helmet from 'helmet';
import * as http from 'http';
import { IBoard } from './declarations/model_declarations';
import mongoose from 'mongoose';

dotenv.config();
const app = express();

//express customization
app.use(helmet());
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
    //saving initial stuff/////////////////////////
    if(count < getDataNumOfGames()){
        await saveGames();
    }
    ///////////////////////////////////////////////

    if((await getNumberOfBoards()) === 0){
        const board: IBoard = {
            title: "My title",
            creator: "dimis",
            otherPlayers: [],
            game: new mongoose.Types.ObjectId("5fdcfc581950f5322c11c646"),
            capacity: 4,
            started: false,
        }
        await saveBoard(board);
    }
    
    const server = http.createServer(app);
    socketInit(server);
    server.listen(process.env.PORT || 8080);
}).catch(error => {
    console.log(error);
});
