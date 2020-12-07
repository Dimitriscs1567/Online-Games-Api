const express = require('express');
const gameRoutes = require('./routes/game');
const bodyParser = require('body-parser');
const corsPolicy = require('./config/corsPolicy');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(corsPolicy.setCorsHeaders);
app.use('/game', gameRoutes);

mongoose.connect('')
    .then(result => {
        app.listen(8080);
    })
    .catch(error => {
        console.log(error);
    });
