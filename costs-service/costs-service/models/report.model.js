const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userid: Number,
    year: Number,
    month: Number,
    costs: Object,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
