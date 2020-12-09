require('dotenv').config()
const express = require('express');
const gameRoutes = require('./routes/game');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const corsPolicy = require('./config/corsPolicy');

const { handleErrors } = require('./controllers/error');
const path = require('path');
const { saveGames } = require('./data/data');
const { connectDb, getNumberOfGames } = require('./utils/database');

const app = express();

//express customization
app.use(bodyParser.json());
app.use(corsPolicy.setCorsHeaders);
app.use('/assets', express.static(path.join(__dirname, 'assets')));

//routes
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
