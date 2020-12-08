const express = require('express');
const gameRoutes = require('./routes/game');
const bodyParser = require('body-parser');
const corsPolicy = require('./config/corsPolicy');
const mongoose = require('mongoose');
const myError = require('./controllers/error');

const app = express();

app.use(bodyParser.json());
app.use(corsPolicy.setCorsHeaders);
app.use('/game', gameRoutes);
app.use(myError.handleErrors);

mongoose.connect('mongodb://127.0.0.1:27017/?compressors=zlib&gssapiServiceName=mongodb', {
    useNewUrlParser: true,  
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(result => {
    app.listen(8080);
}).catch(error => {
    console.log(error);
});
