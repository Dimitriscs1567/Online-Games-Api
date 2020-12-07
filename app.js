const express = require('express');
const gameRoutes = require('./routes/game');
const bodyParser = require('body-parser');
const corsPolicy = require('./config/corsPolicy');

const app = express();

app.use(bodyParser.json());
app.use(corsPolicy.setCorsHeaders);
app.use('/game', gameRoutes);

app.listen(8080);