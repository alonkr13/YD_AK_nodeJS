const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    level: String,
    message: String,
    time: Date,
    method: String,
    url: String,
    statusCode: Number
})

module.exports = mongoose.model('Log', logSchema)