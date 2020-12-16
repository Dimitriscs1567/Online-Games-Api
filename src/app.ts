import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser'
import gameRoutes from './routes/game';
import authRoutes from './routes/auth';
import { setCorsHeaders } from './config/corsPolicy';
import { handleErrors } from './controllers/error';
import path from 'path';
import { saveGames } from './data/data';
import { connectDb, getAllGames, getNumberOfBoards, getNumberOfGames, updateBoardPlayers } from './utils/database';
import { getAuthorization } from './controllers/auth';
import { socketInit } from './config/socket';
import helmet from 'helmet';
import { Board } from './models/board';

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
    if(count === 0){
        await saveGames();
    }

    const numOfBoards = await getNumberOfBoards();
    if(numOfBoards === 0){
        const id = (await getAllGames())[0]._id;
        await new Board({
            game: id,
            creator: "dimis",
            title: "My game",
            maxCapacity: 4,
            otherPlayers: [],
        }).save();
    }
    ///////////////////////////////////////////////

    const creator = (await Board.findOne().exec())?.creator;
    setInterval(()=>{
        const l = Math.floor(Math.random() * 4); 
        const players = new Array<string>(l).fill("player");

        updateBoardPlayers(creator ?? "", players);
    }, 2000);
    
    const server = app.listen(process.env.PORT || 8080);
    socketInit(server);
}).catch(error => {
    console.log(error);
});
