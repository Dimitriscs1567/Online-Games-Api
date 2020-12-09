const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allowedUserSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('allowed_user', allowedUserSchema);