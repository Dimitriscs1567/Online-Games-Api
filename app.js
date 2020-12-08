const express = require('express');
const gameRoutes = require('./routes/game');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const corsPolicy = require('./config/corsPolicy');
const mongoose = require('mongoose');
const { handleErrors } = require('./controllers/error');
const path = require('path');
const Game = require('./models/game');
const { games } = require('./data/data');

const app = express();

//express customization
app.use(bodyParser.json());
app.use(corsPolicy.setCorsHeaders);
app.use('/assets', express.static(path.join(__dirname, 'assets')));

//routes
app.use('/auth', authRoutes);
app.use('/game', gameRoutes);
app.use(handleErrors);

mongoose.connect('mongodb://127.0.0.1:27017/?compressors=zlib&gssapiServiceName=mongodb', {
    useNewUrlParser: true,  
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(result => {
    Game.find().countDocuments((error, count) => {
        if(count === 0){
            games.forEach(async (game) => {
                await game.save();
            });
        }

        app.listen(8080);
    });
}).catch(error => {
    console.log(error);
});
