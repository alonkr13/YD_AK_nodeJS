const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    service: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('logs', logSchema);
